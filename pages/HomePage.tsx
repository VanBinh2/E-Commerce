import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '../components/ui/Shared';
import { api } from '../services/mockBackend';
import { Product } from '../types';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    api.getProducts().then(products => {
      setFeaturedProducts(products.slice(0, 4));
    });
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-[#fcf0d3] py-20 lg:py-32">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 z-10"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold tracking-wide">
              New Collection 2024
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] text-gray-900">
              Discover <span className="text-orange-600">Style</span> <br/> That Speaks to You
            </h1>
            <p className="text-lg text-gray-700 max-w-lg leading-relaxed">
              Explore our curated collection of premium apparel and accessories. Minimalist design meets maximum comfort.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/shop">
                <Button size="lg" className="rounded-full">
                  Shop Now <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="rounded-full bg-white/50 border-gray-900 text-gray-900 hover:bg-white">
                View Lookbook
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:h-[500px] flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-3xl transform -translate-y-4"></div>
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80" 
              alt="Hero Fashion" 
              className="relative rounded-2xl shadow-2xl z-10 max-h-[500px] object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          {[
            { icon: Truck, title: "Free Shipping", desc: "On all orders over $100" },
            { icon: ShieldCheck, title: "Secure Payment", desc: "100% secure payment gateway" },
            { icon: Star, title: "Premium Quality", desc: "Certified top quality materials" }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-xl border bg-gray-50 flex items-start gap-4 hover:shadow-md transition-shadow"
            >
              <div className="p-3 bg-white rounded-lg shadow-sm text-primary">
                <feature.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
              <p className="text-muted-foreground mt-2">Handpicked items just for you</p>
            </div>
            <Link to="/shop" className="text-primary font-medium hover:underline flex items-center">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="group">
                <div className="bg-white rounded-xl overflow-hidden border transition-all hover:shadow-lg">
                  <div className="aspect-square relative bg-gray-100 overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">{product.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
