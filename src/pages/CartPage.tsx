import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter as ShadcnTableFooter } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"; // For notifications

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  restaurantName?: string;
}

const initialCartItems: CartItem[] = [
  {
    id: 'item1',
    name: 'Classic Cheeseburger',
    price: 9.99,
    quantity: 1,
    imageUrl: 'https://via.placeholder.com/80x80?text=Burger',
    restaurantName: "Burger Queen",
  },
  {
    id: 'item2',
    name: 'Large Fries',
    price: 3.49,
    quantity: 2,
    imageUrl: 'https://via.placeholder.com/80x80?text=Fries',
    restaurantName: "Burger Queen",
  },
  {
    id: 'item3',
    name: 'Chocolate Milkshake',
    price: 4.99,
    quantity: 1,
    imageUrl: 'https://via.placeholder.com/80x80?text=Shake',
    restaurantName: "Burger Queen",
  },
];

const DELIVERY_FEE = 5.00;
const TAX_RATE = 0.08; // 8%

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    console.log('CartPage loaded');
  }, []);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      // Optionally remove item if quantity goes below 1, or keep it at 1
      // For this example, we'll remove it.
      handleRemoveItem(itemId, "Item quantity reduced to zero.");
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string, customMessage?: string) => {
    const itemToRemove = cartItems.find(item => item.id === itemId);
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    if (itemToRemove) {
      toast({
        title: "Item Removed",
        description: customMessage || `${itemToRemove.name} has been removed from your cart.`,
      });
    }
  };
  
  const handleApplyPromoCode = () => {
    if (promoCode.toUpperCase() === 'DISCOUNT10') {
      toast({
        title: "Promo Code Applied!",
        description: "10% discount has been applied to your order.",
      });
      // Here you would typically adjust the total or store the discount
    } else if (promoCode.trim() === '') {
       toast({
        title: "No Promo Code Entered",
        description: "Please enter a valid promo code.",
        variant: "destructive",
      });
    }
    else {
      toast({
        title: "Invalid Promo Code",
        description: `The promo code "${promoCode}" is not valid.`,
        variant: "destructive",
      });
    }
    // For simplicity, this example doesn't actually apply a discount.
    console.log('Promo code applied (or attempted):', promoCode);
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const taxes = useMemo(() => {
    return subtotal * TAX_RATE;
  }, [subtotal]);

  const grandTotal = useMemo(() => {
    // Promo code logic would affect this in a real app
    return subtotal + DELIVERY_FEE + taxes;
  }, [subtotal, taxes]);

  const totalCartItemCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header cartItemCount={totalCartItemCount} isLoggedIn={true} userName="Test User" />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8">
          Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingCartIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Button asChild>
                <Link to="/restaurant-listing">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <section className="lg:col-span-2">
              <Card className="shadow-md dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                    Cart Items ({cartItems.length} unique item{cartItems.length === 1 ? '' : 's'})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="dark:border-gray-700">
                        <TableHead className="w-[80px] hidden md:table-cell pl-6">Image</TableHead>
                        <TableHead className="pl-6 md:pl-0">Product</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-center w-32">Quantity</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-center pr-6">Remove</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map(item => (
                        <TableRow key={item.id} className="dark:border-gray-700">
                          <TableCell className="hidden md:table-cell pl-6">
                            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                          </TableCell>
                          <TableCell className="font-medium pl-6 md:pl-0">
                            <div className="text-gray-800 dark:text-white">{item.name}</div>
                            {item.restaurantName && <div className="text-xs text-gray-500 dark:text-gray-400">{item.restaurantName}</div>}
                          </TableCell>
                          <TableCell className="text-right text-gray-700 dark:text-gray-300">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="h-8 w-8 dark:border-gray-600 dark:hover:bg-gray-700">
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (!isNaN(val) && val > 0) handleQuantityChange(item.id, val);
                                    else if (e.target.value === '') handleQuantityChange(item.id, 1); // Treat empty as 1 for now
                                }}
                                className="w-12 h-8 text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                min="1"
                              />
                              <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="h-8 w-8 dark:border-gray-600 dark:hover:bg-gray-700">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-gray-800 dark:text-white">${(item.price * item.quantity).toFixed(2)}</TableCell>
                          <TableCell className="text-center pr-6">
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                     <ShadcnTableFooter className="bg-gray-50 dark:bg-gray-800/50">
                        <TableRow>
                            <TableCell colSpan={3} className="pl-6 font-semibold text-gray-700 dark:text-gray-300">Subtotal</TableCell>
                            <TableCell colSpan={3} className="text-right pr-6 font-semibold text-gray-800 dark:text-white">${subtotal.toFixed(2)}</TableCell>
                        </TableRow>
                    </ShadcnTableFooter>
                  </Table>
                </CardContent>
              </Card>
            </section>

            {/* Order Summary Section */}
            <aside className="lg:col-span-1 space-y-6">
              <Card className="shadow-md dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${DELIVERY_FEE.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes ({(TAX_RATE * 100).toFixed(0)}%)</span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                  
                  <Separator className="my-4 dark:bg-gray-700" />
                  
                  <div>
                    <label htmlFor="promoCode" className="block text-sm font-medium mb-1">Promo Code</label>
                    <div className="flex space-x-2">
                      <Input 
                        id="promoCode" 
                        placeholder="Enter code" 
                        value={promoCode} 
                        onChange={(e) => setPromoCode(e.target.value)} 
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                      <Button onClick={handleApplyPromoCode} variant="outline" className="dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white">Apply</Button>
                    </div>
                  </div>

                  <Separator className="my-4 dark:bg-gray-700" />

                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                    <span>Grand Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild size="lg" className="w-full text-base" disabled={cartItems.length === 0}>
                    <Link to="/checkout">Proceed to Checkout</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Button variant="link" asChild className="w-full text-primary dark:text-primary-foreground">
                <Link to="/restaurant-listing">Continue Shopping</Link>
              </Button>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

// Placeholder for ShoppingCartIcon if not directly imported from lucide-react
const ShoppingCartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.16" />
  </svg>
);


export default CartPage;