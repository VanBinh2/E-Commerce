import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, Truck, ShieldCheck } from 'lucide-react';
import { api } from '../services/mockBackend';
import { useCartStore } from '../store/useStore';
import { Product } from '../types';
import { Button, Badge } from '../components/ui/Shared';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (!id) return;
    const loadProduct = async () => {
      try {
        const products = await api.getProducts();
        const found = products.find((p) => p.id === id);
        setProduct(found || null);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse flex flex-col md:flex-row gap-8">
          <div className="bg-gray-200 w-full md:w-1/2 aspect-square rounded-xl"></div>
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Button variant="ghost" onClick={() => navigate('/shop')} className="mt-4">
          <ArrowLeft size={16} className="mr-2" /> Back to Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 pl-0 hover:bg-transparent hover:text-primary">
        <ArrowLeft size={16} className="mr-2" /> Back
      </Button>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover max-h-[600px]"
          />
        </div>

        {/* Info Section */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-2">
               <span className="text-sm text-muted-foreground uppercase tracking-wide">{product.category}</span>
               {product.stock > 0 ? (
                 <Badge variant="success">In Stock</Badge>
               ) : (
                 <Badge variant="destructive">Out of Stock</Badge>
               )}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              <div className="flex items-center text-yellow-500">
                <Star size={18} fill="currentColor" />
                <span className="ml-1 text-sm font-medium text-gray-600">4.8 (120 reviews)</span>
              </div>
            </div>
          </div>

          <div className="prose prose-gray">
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="border-t border-b border-gray-100 py-6 space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Truck size={18} />
              <span>Free shipping on orders over $100</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <ShieldCheck size={18} />
              <span>2-year warranty included</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              size="lg" 
              className="flex-1 text-lg" 
              onClick={() => addItem(product)}
              disabled={product.stock === 0}
            >
              <ShoppingCart size={20} className="mr-2" />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button size="lg" variant="outline" className="px-6">
              Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}