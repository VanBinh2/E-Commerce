import { Product, Order, User, Role, OrderStatus, AnalyticsData, PaymentStatus } from '../types';
import { MOCK_PRODUCTS, MOCK_ORDERS } from '../constants';

// A simple service to mimic API calls and Database persistence using LocalStorage
class MockBackendService {
  private productsKey = 'eflyer_products_v3';
  private ordersKey = 'eflyer_orders';
  private userKey = 'eflyer_user';
  private usersListKey = 'eflyer_users_list';
  private authKey = 'eflyer_auth_db'; 

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (!localStorage.getItem(this.productsKey)) {
      localStorage.setItem(this.productsKey, JSON.stringify(MOCK_PRODUCTS));
    }
    if (!localStorage.getItem(this.ordersKey)) {
      // @ts-ignore
      localStorage.setItem(this.ordersKey, JSON.stringify(MOCK_ORDERS));
    }
    
    // Initialize Users
    if (!localStorage.getItem(this.usersListKey)) {
      const mockUsers: User[] = [
        { id: 'u1', name: 'John Doe', email: 'john@example.com', role: Role.CUSTOMER, isActive: true, createdAt: '2023-01-15' },
        { id: 'u2', name: 'Jane Smith', email: 'jane@example.com', role: Role.EMPLOYEE, isActive: true, createdAt: '2023-02-20' },
        { id: 'u3', name: 'Alice Johnson', email: 'alice@example.com', role: Role.CUSTOMER, isActive: false, createdAt: '2023-03-10' },
        { id: 'u4', name: 'Support Agent', email: 'support@eflyer.com', role: Role.SUPPORT, isActive: true, createdAt: '2023-01-10' },
        { id: 'u5', name: 'Store Manager', email: 'manager@eflyer.com', role: Role.MANAGER, isActive: true, createdAt: '2023-01-05' },
      ];
      localStorage.setItem(this.usersListKey, JSON.stringify(mockUsers));
    }

    // Initialize Auth DB
    if (!localStorage.getItem(this.authKey)) {
      const initialAuth = {
        'admin@eflyer.com': 'admin',
        'john@example.com': 'password',
        'jane@example.com': 'password',
        'alice@example.com': 'password',
        'support@eflyer.com': 'password',
        'manager@eflyer.com': 'password'
      };
      localStorage.setItem(this.authKey, JSON.stringify(initialAuth));
    }
  }

  private getAuthDB(): Record<string, string> {
    const data = localStorage.getItem(this.authKey);
    return data ? JSON.parse(data) : {};
  }

  private saveAuthDB(db: Record<string, string>) {
    localStorage.setItem(this.authKey, JSON.stringify(db));
  }

  // --- Auth ---
  async login(email: string, password: string): Promise<{ user: User, token: string }> {
    return new Promise(async (resolve, reject) => {
      await new Promise(r => setTimeout(r, 800));

      const users = await this.getUsers();
      let foundUser = users.find(u => u.email === email);
      
      if (!foundUser && email === 'admin@eflyer.com') {
         foundUser = {
          id: 'admin1',
          name: 'Super Admin',
          email,
          role: Role.SUPER_ADMIN,
          isActive: true,
          createdAt: new Date().toISOString()
        };
      }

      if (!foundUser) {
        reject('User not found');
        return;
      }

      if (!foundUser.isActive) {
        reject('Account is locked. Please contact support.');
        return;
      }

      const authDB = this.getAuthDB();
      const storedPassword = authDB[email];

      if (!storedPassword || storedPassword !== password) {
        reject('Incorrect password');
        return;
      }

      localStorage.setItem(this.userKey, JSON.stringify(foundUser));
      resolve({ user: foundUser, token: `mock-jwt-token-${foundUser.id}` });
    });
  }

  async register(name: string, email: string, password: string): Promise<{ user: User, token: string }> {
    await new Promise(r => setTimeout(r, 800));

    const users = await this.getUsers();
    
    if (users.find(u => u.email === email) || email === 'admin@eflyer.com') {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      name,
      email,
      role: Role.CUSTOMER, 
      isActive: true,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(this.usersListKey, JSON.stringify(users));
    
    const authDB = this.getAuthDB();
    authDB[email] = password;
    this.saveAuthDB(authDB);
    
    localStorage.setItem(this.userKey, JSON.stringify(newUser));
    return { user: newUser, token: `mock-jwt-token-${newUser.id}` };
  }

  logout() {
    localStorage.removeItem(this.userKey);
  }

  getCurrentUser(): User | null {
    const u = localStorage.getItem(this.userKey);
    return u ? JSON.parse(u) : null;
  }

  // --- Products ---
  async getProducts(): Promise<Product[]> {
    const data = localStorage.getItem(this.productsKey);
    return data ? JSON.parse(data) : [];
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const products = await this.getProducts();
    const newProduct = { ...product, id: Date.now().toString() };
    products.push(newProduct);
    localStorage.setItem(this.productsKey, JSON.stringify(products));
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Product not found");
    
    const updated = { ...products[index], ...updates };
    products[index] = updated;
    localStorage.setItem(this.productsKey, JSON.stringify(products));
    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    let products = await this.getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem(this.productsKey, JSON.stringify(products));
  }

  // --- Orders & Payments ---
  async getOrders(): Promise<Order[]> {
    const data = localStorage.getItem(this.ordersKey);
    return data ? JSON.parse(data) : [];
  }

  async processPayment(amount: number, method: 'stripe' | 'paypal' | 'credit_card'): Promise<{ success: boolean, transactionId: string }> {
    // Simulate Payment Gateway Delay
    const delay = method === 'stripe' ? 2500 : 1500;
    await new Promise(r => setTimeout(r, delay));
    
    // Random failure for testing (5% chance)
    if (Math.random() < 0.05) {
      throw new Error("Payment declined by bank.");
    }

    return { success: true, transactionId: `txn_${Date.now()}_${method}` };
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const products = await this.getProducts();
    
    // Check Inventory
    if (orderData.items && orderData.items.length > 0) {
      for (const item of orderData.items) {
        const productIndex = products.findIndex(p => p.id === item.productId);
        if (productIndex === -1) throw new Error(`Product ${item.productName} no longer exists`);
        
        if (products[productIndex].stock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.productName}. Available: ${products[productIndex].stock}`);
        }
        products[productIndex].stock -= item.quantity;
      }
      localStorage.setItem(this.productsKey, JSON.stringify(products));
    }

    const orders = await this.getOrders();
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      userId: 'guest',
      customerName: 'Guest Customer',
      totalAmount: 0,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.UNPAID,
      paymentMethod: 'credit_card',
      items: [],
      createdAt: new Date().toISOString(),
      ...orderData
    };
    
    orders.unshift(newOrder); 
    localStorage.setItem(this.ordersKey, JSON.stringify(orders));
    return newOrder;
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const orders = await this.getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) throw new Error("Order not found");

    orders[index].status = status;
    localStorage.setItem(this.ordersKey, JSON.stringify(orders));
    return orders[index];
  }

  // --- Users ---
  async getUsers(): Promise<User[]> {
    const data = localStorage.getItem(this.usersListKey);
    return data ? JSON.parse(data) : [];
  }

  async toggleUserStatus(id: string): Promise<User> {
    const users = await this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error("User not found");
    
    users[index].isActive = !users[index].isActive;
    localStorage.setItem(this.usersListKey, JSON.stringify(users));
    return users[index];
  }

  async updateUserRole(id: string, role: Role): Promise<User> {
    const users = await this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error("User not found");

    users[index].role = role;
    localStorage.setItem(this.usersListKey, JSON.stringify(users));
    return users[index];
  }

  // --- Analytics (Mock) ---
  async getAnalyticsData(): Promise<any> {
    await new Promise(r => setTimeout(r, 500));
    return {
      revenue: [1200, 1900, 3000, 5000, 4500, 6000, 7500],
      orders: [50, 75, 120, 160, 140, 200, 250],
      visitors: [500, 800, 1200, 1500, 1300, 2000, 2200],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      topProducts: [
        { name: 'Summer Yellow Tee', sales: 120 },
        { name: 'Pro Gaming PC', sales: 85 },
        { name: 'Gold Drop Earrings', sales: 70 },
      ]
    };
  }
}

export const api = new MockBackendService();
