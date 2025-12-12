import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import { Button, Input, Table, Badge, Card, Modal } from '../../components/ui/Shared';
import { api } from '../../services/mockBackend';
import { Product } from '../../types';
import { useForm } from 'react-hook-form';
import { useUIStore } from '../../store/useStore';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const { register, handleSubmit, reset, setValue } = useForm();
  const { addNotification } = useUIStore();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    const data = await api.getProducts();
    setProducts(data);
    setIsLoading(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setValue('name', product.name);
    setValue('price', product.price);
    setValue('category', product.category);
    setValue('stock', product.stock);
    setValue('description', product.description);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await api.deleteProduct(id);
      addNotification({ type: 'success', title: 'Deleted', message: 'Product removed successfully' });
      loadProducts();
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, {
          ...data,
          price: Number(data.price),
          stock: Number(data.stock)
        });
        addNotification({ type: 'success', title: 'Updated', message: 'Product updated successfully' });
      } else {
        await api.createProduct({
          ...data,
          price: Number(data.price),
          stock: Number(data.stock),
          imageUrl: `https://picsum.photos/300/300?r=${Math.random()}`
        });
        addNotification({ type: 'success', title: 'Created', message: 'Product created successfully' });
      }
      setIsModalOpen(false);
      reset();
      setEditingProduct(null);
      loadProducts();
    } catch (e) {
      addNotification({ type: 'error', title: 'Error', message: 'Operation failed' });
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedProducts = useMemo(() => {
    let result = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (sortConfig) {
      result.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [products, searchTerm, sortConfig]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory.</p>
        </div>
        <Button onClick={() => { setEditingProduct(null); reset(); setIsModalOpen(true); }}>
          <Plus size={16} className="mr-2" /> Add Product
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Input 
              placeholder="Search products..." 
              icon={<Search size={16} />}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline"><Filter size={16} className="mr-2"/> Filter</Button>
        </div>

        <Table 
            headers={[
                { label: 'Product', key: 'name' },
                { label: 'Category', key: 'category' },
                { label: 'Price', key: 'price' },
                { label: 'Stock', key: 'stock' },
                { label: 'Status' },
                { label: 'Actions' }
            ]}
            onSort={handleSort}
            sortConfig={sortConfig}
        >
          {isLoading ? (
            <tr><td colSpan={6} className="p-4 text-center">Loading...</td></tr>
          ) : processedProducts.map(product => (
            <tr key={product.id} className="hover:bg-gray-50 group transition-colors">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <img src={product.imageUrl} alt="" className="h-10 w-10 rounded-md object-cover bg-gray-100" />
                  <span className="font-medium text-gray-900">{product.name}</span>
                </div>
              </td>
              <td className="px-4 py-4 text-gray-500">{product.category}</td>
              <td className="px-4 py-4 font-medium">${product.price.toFixed(2)}</td>
              <td className="px-4 py-4 text-gray-500">{product.stock}</td>
              <td className="px-4 py-4">
                <Badge variant={product.stock > 0 ? 'success' : 'destructive'}>
                  {product.stock > 0 ? 'Active' : 'Out of Stock'}
                </Badge>
              </td>
              <td className="px-4 py-4">
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(product)} className="text-gray-400 hover:text-primary"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingProduct ? 'Edit Product' : 'Create Product'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Name" {...register('name', { required: true })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price" type="number" step="0.01" {...register('price', { required: true })} />
            <Input label="Stock" type="number" {...register('stock', { required: true })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select {...register('category')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Electronics">Electronics</option>
              <option value="Jewellery">Jewellery</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea {...register('description')} rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingProduct ? 'Save Changes' : 'Create Product'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
