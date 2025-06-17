import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Custom Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Shadcn/ui Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

// Lucide Icons
import { CreditCard, Lock, Home, Package, Trash2 } from 'lucide-react';

// Define Zod schema for form validation
const checkoutFormSchema = z.object({
  // Delivery Address
  deliveryFullName: z.string().min(3, { message: "Full name must be at least 3 characters." }),
  deliveryStreet: z.string().min(5, { message: "Street address must be at least 5 characters." }),
  deliveryCity: z.string().min(2, { message: "City must be at least 2 characters." }),
  deliveryState: z.string().min(2, { message: "State/Province must be at least 2 characters." }),
  deliveryZip: z.string().min(3, { message: "ZIP/Postal code must be at least 3 characters." }),
  deliveryCountry: z.string({ required_error: "Please select a country." }),
  deliveryPhoneNumber: z.string().optional(),
  saveAddress: z.boolean().default(false).optional(),

  // Payment Method
  paymentMethod: z.enum(["creditCard", "paypal"], {
    required_error: "Please select a payment method.",
  }),
  cardName: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(), // Should be MM/YY
  cardCVC: z.string().optional(),
}).refine(data => {
  if (data.paymentMethod === "creditCard") {
    return !!data.cardName && data.cardName.length >= 2 &&
           !!data.cardNumber && /^\d{13,19}$/.test(data.cardNumber.replace(/\s/g, '')) &&
           !!data.cardExpiry && /^(0[1-9]|1[0-2])\/\d{2}$/.test(data.cardExpiry) &&
           !!data.cardCVC && /^\d{3,4}$/.test(data.cardCVC);
  }
  return true;
}, {
  message: "Please fill in all credit card details correctly.",
  path: ["cardName"], // Show error near first card field if general card validation fails
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

// Placeholder cart data
const initialCartItems = [
  { id: 'item1', name: 'Margherita Pizza', quantity: 1, price: 15.99, image: 'https://via.placeholder.com/60x60?text=Pizza' },
  { id: 'item2', name: 'Coke Zero', quantity: 2, price: 2.50, image: 'https://via.placeholder.com/60x60?text=Drink' },
  { id: 'item3', name: 'Garlic Bread', quantity: 1, price: 6.00, image: 'https://via.placeholder.com/60x60?text=Side' },
];

const CheckoutPage: React.FC = () => {
  console.log('CheckoutPage loaded');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = React.useState(initialCartItems);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      deliveryFullName: "",
      deliveryStreet: "",
      deliveryCity: "",
      deliveryState: "",
      deliveryZip: "",
      deliveryCountry: undefined,
      deliveryPhoneNumber: "",
      saveAddress: false,
      paymentMethod: "creditCard",
      cardName: "",
      cardNumber: "",
      cardExpiry: "",
      cardCVC: "",
    },
  });

  const paymentMethod = form.watch("paymentMethod");

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    toast({ title: "Item removed", description: "The item has been removed from your cart." });
  };
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal > 0 ? 5.00 : 0; // No shipping fee for empty cart
  const taxRate = 0.08; // 8%
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + shippingFee + taxAmount;


  function onSubmit(data: CheckoutFormValues) {
    console.log("Checkout form submitted:", data);
    toast({
      title: "Order Placed!",
      description: "Your order has been successfully placed. Redirecting to tracking...",
    });
    // Simulate API call delay
    setTimeout(() => {
      navigate('/order-tracking'); // Path from App.tsx
    }, 1500);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header currentLocation="Checkout" cartItemCount={cartItems.length} isLoggedIn={true} userName="Demo User" />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-screen-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-slate-800 dark:text-slate-100">Secure Checkout</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Delivery and Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Home className="h-6 w-6 text-primary" /> Delivery Address</CardTitle>
                  <CardDescription>Enter your shipping information for this order.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="deliveryFullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deliveryStreet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main Street" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="deliveryCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Anytown" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deliveryState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State / Province</FormLabel>
                          <FormControl>
                            <Input placeholder="CA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="deliveryZip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP / Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="90210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deliveryCountry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USA">United States</SelectItem>
                              <SelectItem value="CAN">Canada</SelectItem>
                              <SelectItem value="GBR">United Kingdom</SelectItem>
                              <SelectItem value="AUS">Australia</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="deliveryPhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormDescription>In case we need to contact you about your order.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="saveAddress"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Save this address for future orders
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Payment Method Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CreditCard className="h-6 w-6 text-primary" /> Payment Method</CardTitle>
                  <CardDescription>Choose how you'd like to pay for your order.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="creditCard" />
                              </FormControl>
                              <FormLabel className="font-normal">Credit Card</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="paypal" />
                              </FormControl>
                              <FormLabel className="font-normal">PayPal</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {paymentMethod === "creditCard" && (
                    <div className="space-y-4 mt-4 pt-4 border-t">
                      <FormField
                        control={form.control}
                        name="cardName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name on Card</FormLabel>
                            <FormControl>
                              <Input placeholder="John M Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input placeholder="•••• •••• •••• ••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="cardExpiry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cardCVC"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVC</FormLabel>
                              <FormControl>
                                <Input placeholder="123" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                  {paymentMethod === "paypal" && (
                     <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-muted-foreground">You will be redirected to PayPal to complete your payment.</p>
                        <Button type="button" variant="outline" className="mt-2 w-full" disabled>
                            {/* Replace with actual PayPal button/integration */}
                            Proceed with PayPal (Placeholder)
                        </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="sticky top-24"> {/* Sticky for long forms */}
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Package className="h-6 w-6 text-primary"/> Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {cartItems.length === 0 ? (
                    <p className="text-muted-foreground">Your cart is empty.</p>
                  ) : (
                    <ul className="space-y-3 mb-4">
                      {cartItems.map(item => (
                        <li key={item.id} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p>{(item.price * item.quantity).toFixed(2)}</p>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveItem(item.id)}>
                               <Trash2 className="h-3 w-3"/>
                               <span className="sr-only">Remove {item.name}</span>
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>${shippingFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
                      <span>${taxAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={cartItems.length === 0 || form.formState.isSubmitting}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    {form.formState.isSubmitting ? "Placing Order..." : `Place Order ($${totalAmount.toFixed(2)})`}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    By placing your order, you agree to our <Link to="#" className="underline hover:text-primary">Terms of Service</Link>.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </form>
        </Form>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;