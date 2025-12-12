import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, Truck, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button, Input, Card, Badge } from '../components/ui/Shared';
import { useCartStore, useUIStore } from '../store/useStore';
import { api } from '../services/mockBackend';
import { PaymentStatus } from '../types';

const steps = [
  { id: 1, name: 'Shipping', icon: Truck },
  { id: 2, name: 'Payment', icon: CreditCard },
  { id: 3, name: 'Confirm', icon: CheckCircle },
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, total, clearCart } = useCartStore();
  const { addNotification } = useUIStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  // Stripe Simulation States
  const [cardError, setCardError] = useState('');
  const [cardName, setCardName] = useState('');

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4 tracking-tight">Your cart is empty</h2>
        <Button onClick={() => navigate('/shop')}>Go Shopping</Button>
      </div>
    );
  }

  const onSubmitShipping = (data: any) => {
    setCurrentStep(2);
  };

  const handleStripePayment = async () => {
    if (!cardName) {
      setCardError('Cardholder name is required');
      return;
    }
    setCardError('');
    setIsProcessing(true);

    try {
      // Simulate Stripe Client-Server Handshake
      await new Promise(r => setTimeout(r, 1500)); // Creating Payment Intent...
      
      // Simulate confirming payment
      await api.processPayment(total(), 'stripe');
      
      await api.createOrder({
        items: items,
        totalAmount: total(),
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: 'stripe'
      });
      
      clearCart();
      addNotification({
        title: "Payment Successful",
        message: "Your order has been secured via Stripe.",
        type: "success"
      });
      setCurrentStep(3);
    } catch (error: any) {
      setCardError(error.message || "Card declined. Please try again.");
      addNotification({
        title: "Payment Failed",
        message: "Transaction declined by bank.",
        type: "error"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Steps Indicator */}
      <div className="mb-12">
        <div className="flex justify-center items-center">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className={`flex flex-col items-center transition-colors duration-300 ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-300'}`}>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 mb-2 transition-all duration-300 ${currentStep >= step.id ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200'}`}>
                  <step.icon size={18} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">{step.name}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-0.5 w-24 mx-4 rounded ${currentStep > step.id ? 'bg-gray-900' : 'bg-gray-100'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-2">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <Card className="p-8 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold mb-6 tracking-tight text-gray-900">Shipping Details</h2>
                <form id="shipping-form" onSubmit={handleSubmit(onSubmitShipping)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="First Name" {...register('firstName', { required: true })} error={errors.firstName ? 'Required' : ''} />
                    <Input label="Last Name" {...register('lastName', { required: true })} error={errors.lastName ? 'Required' : ''} />
                  </div>
                  <Input label="Address" {...register('address', { required: true })} error={errors.address ? 'Required' : ''} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="City" {...register('city', { required: true })} />
                    <Input label="Postal Code" {...register('zip', { required: true })} />
                  </div>
                  <Input label="Phone" {...register('phone', { required: true })} />
                  <Button type="submit" className="w-full mt-4 bg-gray-900 hover:bg-black text-white" size="lg">Continue to Payment</Button>
                </form>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className="p-8 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-bold tracking-tight text-gray-900">Payment</h2>
                   <div className="flex gap-2">
                      <div className="h-6 w-10 bg-gray-200 rounded"></div> {/* Visa Mock */}
                      <div className="h-6 w-10 bg-gray-200 rounded"></div> {/* MC Mock */}
                   </div>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 mb-6 flex items-start gap-3">
                  <Lock size={16} className="text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold">Secure SSL Payment</p>
                    <p className="opacity-80">Your card details are processed securely by Stripe.</p>
                  </div>
                </div>

                {/* Simulated Stripe Element UI */}
                <div className="space-y-5">
                  <div className="p-4 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                      <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Card Information</label>
                      <div className="flex items-center gap-2">
                         <CreditCard size={20} className="text-gray-400" />
                         <input 
                            type="text" 
                            placeholder="0000 0000 0000 0000" 
                            className="flex-1 outline-none text-gray-900 font-medium placeholder:font-normal"
                         />
                         <input 
                            type="text" 
                            placeholder="MM/YY" 
                            className="w-16 outline-none text-gray-900 font-medium text-center border-l border-gray-200 pl-2 placeholder:font-normal"
                         />
                         <input 
                            type="text" 
                            placeholder="CVC" 
                            className="w-12 outline-none text-gray-900 font-medium text-center border-l border-gray-200 pl-2 placeholder:font-normal"
                         />
                      </div>
                  </div>
                  
                  <Input 
                    label="Cardholder Name" 
                    placeholder="Name on card" 
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />

                  {cardError && (
                    <div className="text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle size={16} /> {cardError}
                    </div>
                  )}
                </div>
                
                <div className="mt-8 flex gap-4">
                  <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">Back</Button>
                  <Button onClick={handleStripePayment} isLoading={isProcessing} className="flex-1 bg-[#635BFF] hover:bg-[#534be0] text-white border-0" size="lg">
                    Pay ${total().toFixed(2)}
                  </Button>
                </div>
                
                <div className="mt-6 text-center">
                   <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                      <ShieldCheck size={12} /> Powered by Stripe
                   </p>
                </div>
              </Card>
            )}

            {currentStep === 3 && (
              <Card className="p-12 text-center border-gray-100 shadow-sm">
                <div className="mx-auto h-24 w-24 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-6">
                  <CheckCircle size={48} />
                </div>
                <h2 className="text-3xl font-bold mb-2 text-gray-900 tracking-tight">Order Confirmed!</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                   Thank you for your purchase. We have sent a receipt to your email address and will notify you when it ships.
                </p>
                <div className="flex justify-center gap-4">
                   <Button onClick={() => navigate('/shop')} variant="outline">Continue Shopping</Button>
                   <Button onClick={() => navigate('/')}>Return Home</Button>
                </div>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24 border border-gray-100 shadow-sm bg-gray-50/50">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Order Summary</h3>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between text-sm items-start">
                  <div className="flex gap-3">
                     <div className="w-10 h-10 rounded bg-white border border-gray-200 overflow-hidden relative">
                        {item.imageUrl && <img src={item.imageUrl} className="w-full h-full object-cover" />}
                        <span className="absolute top-0 right-0 bg-gray-900 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-bl">{item.quantity}</span>
                     </div>
                     <span className="text-gray-700 font-medium line-clamp-2 max-w-[120px]">{item.productName}</span>
                  </div>
                  <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-6 pt-4 space-y-3">
               <div className="flex justify-between text-sm text-gray-600">
                 <span>Subtotal</span>
                 <span>${total().toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-sm text-gray-600">
                 <span>Shipping</span>
                 <span className="text-green-600 font-medium">Free</span>
               </div>
               <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                 <span>Total</span>
                 <span>${total().toFixed(2)}</span>
               </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
