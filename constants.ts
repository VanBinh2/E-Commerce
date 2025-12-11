// In a real Node.js app, this would be in a .env file
// The user provided connection string:
export const MONGO_DB_URI = "mongodb+srv://binhlienminhhuyenthoai_db_user:<db_password>@cluster0.qw9l05j.mongodb.net/?appName=Cluster0";

export const APP_NAME = "Eflyer Admin";

export const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Summer Yellow Tee',
    price: 35.00,
    category: 'Men',
    description: 'Casual yellow t-shirt for summer, 100% cotton.',
    stock: 120,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '2',
    name: 'Classic Green Shirt',
    price: 55.00,
    category: 'Men',
    description: 'Formal green shirt, perfect for office wear.',
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '3',
    name: 'Pro Gaming PC',
    price: 899.99,
    category: 'Electronics',
    description: 'High performance gaming PC with RGB lighting.',
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '4',
    name: 'Ultrabook Series X',
    price: 650.00,
    category: 'Electronics',
    description: 'Reliable laptop for work and study, lightweight design.',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '5',
    name: 'Gold Drop Earrings',
    price: 45.00,
    category: 'Jewellery',
    description: 'Traditional gold earrings with intricate design.',
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '6',
    name: 'Diamond Bangle Set',
    price: 120.00,
    category: 'Jewellery',
    description: 'Beautiful gold bangles, set of 2.',
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '7',
    name: 'Pearl Necklace',
    price: 250.00,
    category: 'Jewellery',
    description: 'Elegant gold necklace for special occasions.',
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '8',
    name: 'Red Summer Dress',
    price: 65.00,
    category: 'Women',
    description: 'Vintage style red dress.',
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80' 
  }
];

export const MOCK_ORDERS = [
  {
    id: 'ORD-001',
    userId: 'u1',
    customerName: 'John Doe',
    totalAmount: 125.00,
    status: 'delivered',
    createdAt: '2023-10-01T10:00:00Z',
    items: []
  },
  {
    id: 'ORD-002',
    userId: 'u2',
    customerName: 'Jane Smith',
    totalAmount: 55.00,
    status: 'processing',
    createdAt: '2023-10-02T14:30:00Z',
    items: []
  },
  {
    id: 'ORD-003',
    userId: 'u3',
    customerName: 'Bob Brown',
    totalAmount: 210.00,
    status: 'pending',
    createdAt: '2023-10-05T09:15:00Z',
    items: []
  }
];