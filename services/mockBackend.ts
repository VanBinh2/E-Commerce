import { Product, Order, User, Role, OrderStatus } from '../types';
import { MOCK_PRODUCTS, MOCK_ORDERS } from '../constants';

// A simple service to mimic API calls and Database persistence using LocalStorage
class MockBackendService {
  private productsKey = 'eflyer_products_v3';
  private ordersKey = 'eflyer_orders';
  private userKey = 'eflyer_user';
  private usersListKey = 'eflyer_users_list';
  private authKey = 'eflyer_auth_db'; // New key for storing credentials securely (mock)

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
        { id: 'u1', name: 'John Doe', email: 'john@example.com', role: Role.CUSTOMER, isActive: true, joinedAt: '2023-01-15' },
        { id: 'u2', name: 'Jane Smith', email: 'jane@example.com', role: Role.EMPLOYEE, isActive: true, joinedAt: '2023-02-20' },
        { id: 'u3', name: 'Alice Johnson', email: 'alice@example.com', role: Role.CUSTOMER, isActive: false, joinedAt: '2023-03-10' },
      ];
      localStorage.setItem(this.usersListKey, JSON.stringify(mockUsers));
    }

    // Initialize Auth DB (Passwords)
    if (!localStorage.getItem(this.authKey)) {
      const initialAuth = {
        'admin@eflyer.com': 'admin',
        'john@example.com': 'password',
        'jane@example.com': 'password',
        'alice@example.com': 'password'
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
      // Delay validation to simulate network
      await new Promise(r => setTimeout(r, 800));

      // 1. Check if user exists in our "DB"
      const users = await this.getUsers();
      // Also check if it's the super admin (who might not be in the users list depending on init state, but let's treat him as special)
      let foundUser = users.find(u => u.email === email);
      
      if (!foundUser && email === 'admin@eflyer.com') {
         foundUser = {
          id: 'admin1',
          name: 'Super Admin',
          email,
          role: Role.ADMIN,
          isActive: true,
          joinedAt: new Date().toISOString()
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

      // 2. Validate Password
      const authDB = this.getAuthDB();
      const storedPassword = authDB[email];

      // If no password stored (legacy data), or password mismatch
      if (!storedPassword || storedPassword !== password) {
        reject('Incorrect password');
        return;
      }

      // Success
      localStorage.setItem(this.userKey, JSON.stringify(foundUser));
      resolve({ user: foundUser, token: `mock-jwt-token-${foundUser.id}` });
    });
  }

  async register(name: string, email: string, password: string): Promise<{ user: User, token: string }> {
    // Delay validation
    await new Promise(r => setTimeout(r, 800));

    const users = await this.getUsers();
    
    // Check duplication
    if (users.find(u => u.email === email) || email === 'admin@eflyer.com') {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      name,
      email,
      role: Role.CUSTOMER, // Default role is Customer
      isActive: true,
      joinedAt: new Date().toISOString()
    };

    // Save User
    users.push(newUser);
    localStorage.setItem(this.usersListKey, JSON.stringify(users));
    
    // Save Password
    const authDB = this.getAuthDB();
    authDB[email] = password;
    this.saveAuthDB(authDB);
    
    // Auto login after register
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

  // --- Orders ---
  async getOrders(): Promise<Order[]> {
    const data = localStorage.getItem(this.ordersKey);
    return data ? JSON.parse(data) : [];
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const products = await this.getProducts();
    
    // 1. Check Inventory Logic
    if (orderData.items && orderData.items.length > 0) {
      for (const item of orderData.items) {
        const productIndex = products.findIndex(p => p.id === item.productId);
        if (productIndex === -1) throw new Error(`Product ${item.productName} no longer exists`);
        
        if (products[productIndex].stock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.productName}. Available: ${products[productIndex].stock}`);
        }
        
        // Deduct Stock
        products[productIndex].stock -= item.quantity;
      }
      // Save updated inventory
      localStorage.setItem(this.productsKey, JSON.stringify(products));
    }

    const orders = await this.getOrders();
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      userId: 'guest',
      customerName: 'Guest Customer',
      totalAmount: 0,
      status: OrderStatus.PENDING,
      items: [],
      createdAt: new Date().toISOString(),
      ...orderData
    };
    
    // Simulate slight delay
    await new Promise(r => setTimeout(r, 500));
    
    orders.unshift(newOrder); // Add to beginning
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
}

export const api = new MockBackendService();