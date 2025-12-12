
/**
 * ENTERPRISE BACKEND SERVER
 * Architecture: Monolithic Modular (Easy to split into Microservices)
 * Tech: Express, Mongoose, JWT, CORS
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "eflyer-enterprise-secret-key-2024";
const MONGO_URI = "mongodb+srv://binhlienminhhuyenthoai_db_user:<db_password>@cluster0.qw9l05j.mongodb.net/?appName=Cluster0";

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Auth Middleware
const authenticate = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: 'Forbidden: Invalid token' });
      
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      }
      
      req.user = user;
      next();
    });
  };
};

// --- DATABASE CONNECTION ---
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Enterprise DB Connected (MongoDB)'))
  .catch(err => console.error('❌ DB Connection Error:', err));

// --- SCHEMAS (Simplified Mongoose versions of Prisma Schema) ---
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: String,
  role: { type: String, enum: ['super_admin', 'admin', 'manager', 'customer'], default: 'customer' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  description: String,
  price: Number,
  category: String,
  stock: Number,
  images: [String],
  thumbnail: String,
  isPublished: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', ProductSchema);

const OrderSchema = new mongoose.Schema({
  orderNumber: String,
  userId: String,
  customerName: String,
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    total: Number
  }],
  totalAmount: Number,
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

// --- CONTROLLERS (Business Logic Layer) ---

// Auth Controller
const AuthController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      // In production: Use bcrypt to compare password
      const user = await User.findOne({ email, password });
      
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      if (!user.isActive) return res.status(403).json({ error: 'Account locked' });

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );

      // Remove sensitive data
      const userResponse = user.toObject();
      delete userResponse.password;

      res.json({ user: userResponse, token });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ error: 'Email already exists' });

      const newUser = new User({ name, email, password });
      await newUser.save();
      
      res.status(201).json({ message: 'User registered successfully' });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
};

// Analytics Controller
const AnalyticsController = {
  getDashboardData: async (req, res) => {
    try {
      const [userCount, orderCount, productCount, revenueData] = await Promise.all([
        User.countDocuments(),
        Order.countDocuments(),
        Product.countDocuments(),
        Order.aggregate([
          { $match: { paymentStatus: 'paid' } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ])
      ]);

      const totalRevenue = revenueData.length ? revenueData[0].total : 0;

      // Mock Trend Data for Charts (Real implementation would use aggregation by date)
      const salesTrend = [
        { name: 'Mon', value: 1200 },
        { name: 'Tue', value: 2100 },
        { name: 'Wed', value: 800 },
        { name: 'Thu', value: 1600 },
        { name: 'Fri', value: 2400 },
        { name: 'Sat', value: 3200 },
        { name: 'Sun', value: 2800 },
      ];

      res.json({
        kpi: {
          revenue: { value: totalRevenue, trend: 12.5 },
          orders: { value: orderCount, trend: 8.2 },
          customers: { value: userCount, trend: 5.1 },
          products: { value: productCount, trend: 0 }
        },
        charts: {
          sales: salesTrend
        }
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
};

// --- ROUTES DEFINITION ---

// API V1 Router
const apiV1 = express.Router();

// Auth Routes
apiV1.post('/auth/login', AuthController.login);
apiV1.post('/auth/register', AuthController.register);

// Product Routes
apiV1.get('/products', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});
apiV1.post('/products', authenticate(['admin', 'super_admin']), async (req, res) => {
  const product = new Product({
    ...req.body,
    slug: req.body.name.toLowerCase().replace(/ /g, '-') + '-' + Date.now()
  });
  await product.save();
  res.status(201).json(product);
});

// Order Routes
apiV1.get('/orders', authenticate(['admin', 'super_admin']), async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});
apiV1.post('/orders', authenticate(), async (req, res) => {
  const order = new Order({
    ...req.body,
    userId: req.user.id,
    orderNumber: `ORD-${Date.now()}`
  });
  await order.save();
  res.status(201).json(order);
});

// Analytics Routes
apiV1.get('/admin/analytics', authenticate(['admin', 'super_admin']), AnalyticsController.getDashboardData);

// Mount API
app.use('/api/v1', apiV1);

// Health Check
app.get('/', (req, res) => {
  res.json({ status: 'active', version: '1.0.0-enterprise' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Enterprise Server running on port ${PORT}`);
  console.log(`📡 API Endpoint: http://localhost:${PORT}/api/v1`);
});
