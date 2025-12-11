import React, { useState } from 'react';
import { 
  Server, 
  Smartphone, 
  Database, 
  Container, 
  Globe, 
  Layers, 
  Code, 
  GitBranch,
  CheckCircle2
} from 'lucide-react';

const CodeBlock = ({ title, lang, code }: { title: string, lang: string, code: string }) => (
  <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm group hover:shadow-md transition-shadow">
    <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Code size={16} className="text-blue-500" />
        <span className="text-sm font-semibold text-gray-900">{title}</span>
      </div>
      <span className="text-xs font-mono text-gray-500 uppercase bg-white border border-gray-200 px-2 py-0.5 rounded shadow-sm">{lang}</span>
    </div>
    <div className="p-4 overflow-x-auto bg-[#1e1e1e]">
      <pre className="text-xs md:text-sm font-mono text-gray-300 whitespace-pre leading-relaxed">{code}</pre>
    </div>
  </div>
);

const FeatureList = ({ items }: { items: string[] }) => (
  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
    {items.map((item, idx) => (
      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100">
        <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
      ${active 
        ? 'bg-black text-white shadow-md transform scale-105' 
        : 'text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm'}`}
  >
    <Icon size={18} strokeWidth={active ? 2.5 : 2} />
    <span>{label}</span>
  </button>
);

export const ArchitectureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'backend' | 'database' | 'mobile' | 'frontend' | 'devops'>('backend');

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <GitBranch className="text-gray-400" />
            System Architecture
          </h1>
          <p className="text-gray-500 mt-2 max-w-2xl">
            Full-stack implementation details for the E-commerce platform. Includes Node.js Microservices, MongoDB Schemas, React Admin Dashboard, and React Native Mobile App.
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">
            v2.4.0 Stable
          </span>
          <span className="text-xs text-gray-400 mt-2 font-mono">
            Updated: {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100/80 rounded-xl backdrop-blur-sm border border-gray-200 sticky top-0 z-10">
        <TabButton active={activeTab === 'backend'} onClick={() => setActiveTab('backend')} icon={Server} label="Backend API" />
        <TabButton active={activeTab === 'database'} onClick={() => setActiveTab('database')} icon={Database} label="Database" />
        <TabButton active={activeTab === 'mobile'} onClick={() => setActiveTab('mobile')} icon={Smartphone} label="Mobile App" />
        <TabButton active={activeTab === 'frontend'} onClick={() => setActiveTab('frontend')} icon={Globe} label="Admin Web" />
        <TabButton active={activeTab === 'devops'} onClick={() => setActiveTab('devops')} icon={Container} label="DevOps" />
      </div>
      
      {/* Content Area */}
      <div className="animate-fade-in">
        
        {/* --- BACKEND TAB --- */}
        {activeTab === 'backend' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">REST API Architecture</h3>
              <FeatureList items={[
                "Node.js & Express with TypeScript",
                "JWT Authentication & Role Based Access Control (RBAC)",
                "RESTful Endpoints for Products, Orders, Users",
                "Middleware for Error Handling & Validation"
              ]} />
            </div>

            <CodeBlock 
              title="server.ts - Application Entry Point" 
              lang="typescript" 
              code={`import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middleware/errorMiddleware';

dotenv.config();
connectDB(); // MongoDB Connection

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', require('./routes/authRoutes'));

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));`}
            />

            <CodeBlock 
              title="controllers/orderController.ts - Logic Layer" 
              lang="typescript" 
              code={`import { Request, Response } from 'express';
import Order from '../models/Order';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Customer)
export const addOrderItems = async (req: Request, res: Response) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      status: 'Pending'
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
};`}
            />
          </div>
        )}

        {/* --- DATABASE TAB --- */}
        {activeTab === 'database' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">MongoDB Schema Design</h3>
              <p className="text-gray-600 mb-6">
                Using Mongoose ODM to model application data. Relations are handled via ObjectId references.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CodeBlock 
                title="models/User.ts" 
                lang="typescript" 
                code={`import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'customer', 'manager'],
    default: 'customer'
  },
  avatar: { type: String },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);`}
              />

              <CodeBlock 
                title="models/Product.ts" 
                lang="typescript" 
                code={`import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Creator
  name: { type: String, required: true },
  image: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  countInStock: { type: Number, required: true, default: 0 },
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);`}
              />
            </div>

            <CodeBlock 
              title="models/Order.ts" 
              lang="typescript" 
              code={`import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  orderItems: [{
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
  }],
  totalPrice: { type: Number, required: true, default: 0.0 },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  status: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending' 
  },
}, {
  timestamps: true
});

export default mongoose.model('Order', orderSchema);`}
            />
          </div>
        )}

        {/* --- MOBILE TAB --- */}
        {activeTab === 'mobile' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">React Native Customer App</h3>
              <FeatureList items={[
                "React Native (Expo Managed Workflow)",
                "React Navigation v6 (Stack & Bottom Tabs)",
                "Redux Toolkit for Global State (Cart, Auth)",
                "AsyncStorage for Local Persistence"
              ]} />
            </div>

            <CodeBlock 
              title="App.js - Navigation Setup" 
              lang="javascript" 
              code={`import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from './store';

// Screens
import HomeScreen from './screens/HomeScreen';
import ProductDetails from './screens/ProductDetails';
import CartScreen from './screens/CartScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Shop" component={HomeScreen} />
      <Stack.Screen name="Details" component={ProductDetails} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="Home" component={HomeStack} />
          <Tab.Screen name="Cart" component={CartScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}`}
            />

            <CodeBlock 
              title="screens/CartScreen.js - UI Logic" 
              lang="javascript" 
              code={`import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../store/cartSlice';

export default function CartScreen({ navigation }) {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text>{item.name}</Text>
                <Text>\${item.price} x {item.qty}</Text>
                <TouchableOpacity onPress={() => dispatch(removeFromCart(item.id))}>
                   <Text style={{color: 'red'}}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <View style={styles.footer}>
            <Text style={styles.total}>Total: \${total.toFixed(2)}</Text>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Checkout')}>
              <Text style={styles.btnText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}`}
            />
          </div>
        )}

        {/* --- FRONTEND TAB --- */}
        {activeTab === 'frontend' && (
          <div className="space-y-8">
             <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">React Admin Dashboard</h3>
              <FeatureList items={[
                "React 18 with Hooks",
                "TailwindCSS for Styling",
                "Recharts for Analytics Visualization",
                "Lucide React for Iconography"
              ]} />
            </div>

             <CodeBlock 
              title="hooks/useAuth.ts - Custom Hook" 
              lang="typescript" 
              code={`import { useState, useEffect } from 'react';
import { api } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await api.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (creds) => {
    const user = await api.login(creds);
    setUser(user);
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  return { user, loading, login, logout };
};`}
            />
          </div>
        )}

        {/* --- DEVOPS TAB --- */}
        {activeTab === 'devops' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Containerization & Deployment</h3>
              <p className="text-gray-600 mb-6">
                Standard Docker setup for microservices and docker-compose for local development orchestration.
              </p>
            </div>

            <CodeBlock 
              title="docker-compose.yml - Local Dev Stack" 
              lang="yaml" 
              code={`version: '3.8'

services:
  backend-api:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://mongo:27017/eflyer
      - JWT_SECRET=devsecret
    depends_on:
      - mongo
    networks:
      - app-network

  admin-web:
    build: ./admin
    ports:
      - "3000:80"
    networks:
      - app-network

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    networks:
      - app-network

volumes:
  mongo-data:

networks:
  app-network:
    driver: bridge`}
            />

            <CodeBlock 
              title="backend/Dockerfile - Production Build" 
              lang="dockerfile" 
              code={`FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000
CMD ["node", "dist/server.js"]`}
            />
          </div>
        )}

      </div>
    </div>
  );
};