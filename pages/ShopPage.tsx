import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, SlidersHorizontal, X, Filter } from 'lucide-react';
import { Input, Button, Badge } from '../components/ui/Shared';
import { api } from '../services/mockBackend';
import { Product } from '../types';
import { useCartStore } from '../store/useStore';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    api.getProducts().then(data => {
      setProducts(data);
      setIsLoading(false);
    });
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'All' || p.category === category;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchTerm, category, priceRange]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shop Collection</h1>
          <p className="text-gray-500 mt-1">Found {filteredProducts.length} items</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto items-center">
          <Button variant="outline" className="md:hidden" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <SlidersHorizontal size={16} className="mr-2" /> Filters
          </Button>
          
          <div className="flex-1 flex gap-2 md:w-[450px]">
            {/* Real-time Category Filter (Dropdown) */}
            <div className="relative hidden md:block w-40">
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Real-time Search */}
            <div className="relative flex-1">
               <Input 
                 placeholder="Search products by name..." 
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 icon={<Search size={16} />}
               />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters - Desktop (Price Only now, Category moved up) */}
        <aside className="hidden md:block w-64 space-y-8 flex-shrink-0">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Filter size={18}/> Price Range</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                 <Input 
                   type="number" 
                   value={priceRange[0]} 
                   onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                   className="h-8 text-xs"
                 />
                 <span className="text-gray-400 self-center">-</span>
                 <Input 
                   type="number" 
                   value={priceRange[1]} 
                   onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                   className="h-8 text-xs"
                 />
              </div>
              <input 
                type="range" 
                min="0" 
                max="2000" 
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {isFilterOpen && (
           <div className="fixed inset-0 bg-black/50 z-50 md:hidden flex justify-end">
             <div className="bg-white w-80 h-full p-6 overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                   <h2 className="font-bold text-lg">Filters</h2>
                   <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Categories</h3>
                    {categories.map(c => (
                      <div key={c} className="flex items-center mb-2">
                        <input type="radio" checked={category === c} onChange={() => setCategory(c)} className="mr-2" />
                        <label>{c}</label>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
           </div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="animate-pulse space-y-3">
                   <div className="bg-gray-200 h-64 rounded-xl" />
                   <div className="bg-gray-200 h-4 w-3/4 rounded" />
                   <div className="bg-gray-200 h-4 w-1/2 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {product.stock === 0 ? (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                         <Badge variant="destructive">Out of Stock</Badge>
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => { e.preventDefault(); addItem(product); }}
                        className="absolute bottom-4 right-4 bg-white text-primary p-3 rounded-full shadow-lg translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white"
                      >
                        <ShoppingCart size={20} />
                      </button>
                    )}
                    <Link to={`/product/${product.id}`} className="absolute inset-0" />
                  </div>
                  
                  <div className="p-4 flex flex-col flex-1">
                    <div className="mb-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</span>
                    </div>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {!isLoading && filteredProducts.length === 0 && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-center py-24 bg-gray-50 rounded-xl border border-dashed border-gray-300"
             >
               <div className="bg-white p-4 rounded-full inline-block shadow-sm mb-4">
                 <Search size={32} className="text-gray-400" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
               <p className="text-gray-500 mb-6 max-w-md mx-auto">
                 We couldn't find any products matching "{searchTerm}" in the {category} category.
               </p>
               <Button variant="outline" onClick={() => { setSearchTerm(''); setCategory('All'); }}>Clear All Filters</Button>
             </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
