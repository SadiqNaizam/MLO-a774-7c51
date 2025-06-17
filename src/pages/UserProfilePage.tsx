import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';

import { User, MapPin, CreditCard, ShoppingBag, Bell, HelpCircle, Edit3, Trash2, PlusCircle, LogOut } from 'lucide-react';

// Schemas for forms
const personalInfoSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).optional(),
  avatarUrl: z.string().url({ message: "Invalid URL." }).optional(),
});

const addressSchema = z.object({
  id: z.string().optional(),
  street: z.string().min(5, "Street address is too short."),
  city: z.string().min(2, "City name is too short."),
  state: z.string().min(2, "State is too short."),
  zipCode: z.string().min(5, "Zip code is too short."),
  isDefault: z.boolean().optional(),
});

const paymentMethodSchema = z.object({
  id: z.string().optional(),
  cardHolderName: z.string().min(2, "Cardholder name is required."),
  cardNumber: z.string().length(16, "Card number must be 16 digits."),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be MM/YY."),
  cvv: z.string().length(3, "CVV must be 3 digits."),
  isDefault: z.boolean().optional(),
});

const notificationPreferencesSchema = z.object({
  orderUpdatesEmail: z.boolean().default(true),
  orderUpdatesSms: z.boolean().default(false),
  promotionalEmails: z.boolean().default(true),
  appPushes: z.boolean().default(true),
});

// Placeholder Data
const mockUser = {
  fullName: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "555-123-4567",
  avatarUrl: "https://i.pravatar.cc/150?u=alexjohnson",
};

const mockAddresses = [
  { id: "addr1", street: "123 Main St", city: "Foodville", state: "CA", zipCode: "90210", isDefault: true },
  { id: "addr2", street: "456 Oak Ave", city: "Restaurania", state: "NY", zipCode: "10001", isDefault: false },
];

const mockPaymentMethods = [
  { id: "pay1", cardHolderName: "Alex Johnson", cardNumberLast4: "1234", cardType: "Visa", expiryDate: "12/25", isDefault: true },
  { id: "pay2", cardHolderName: "Alex Johnson", cardNumberLast4: "5678", cardType: "Mastercard", expiryDate: "06/24", isDefault: false },
];

const mockOrderHistory = [
  { id: "order1", date: "2023-10-26", total: 45.99, status: "Delivered", items: [{name: "Pizza", quantity: 1}, {name: "Soda", quantity: 4}] },
  { id: "order2", date: "2023-11-05", total: 22.50, status: "Processing", items: [{name: "Burger", quantity: 2}, {name: "Fries", quantity: 1}] },
];

const UserProfilePage = () => {
  const navigate = useNavigate();
  console.log('UserProfilePage loaded');

  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: mockUser.fullName,
      email: mockUser.email,
      phone: mockUser.phone,
      avatarUrl: mockUser.avatarUrl,
    },
  });

  const notificationPrefsForm = useForm<z.infer<typeof notificationPreferencesSchema>>({
    resolver: zodResolver(notificationPreferencesSchema),
    defaultValues: {
      orderUpdatesEmail: true,
      orderUpdatesSms: false,
      promotionalEmails: true,
      appPushes: true,
    },
  });

  function onPersonalInfoSubmit(values: z.infer<typeof personalInfoSchema>) {
    console.log("Personal Info Submitted:", values);
    toast({ title: "Profile Updated", description: "Your personal information has been saved." });
  }

  function onNotificationPrefsSubmit(values: z.infer<typeof notificationPreferencesSchema>) {
    console.log("Notification Preferences Submitted:", values);
    toast({ title: "Preferences Saved", description: "Your notification settings have been updated." });
  }
  
  const handleLogout = () => {
    console.log("User logging out...");
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    // In a real app, clear auth state and redirect
    navigate('/'); // Navigate to homepage after logout
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header isLoggedIn={true} userName={mockUser.fullName.split(' ')[0]} cartItemCount={2} />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile, preferences, and order history.</p>
        </div>

        <Tabs defaultValue="personal-info" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-6">
            <TabsTrigger value="personal-info"><User className="mr-2 h-4 w-4 inline"/>Personal</TabsTrigger>
            <TabsTrigger value="addresses"><MapPin className="mr-2 h-4 w-4 inline"/>Addresses</TabsTrigger>
            <TabsTrigger value="payment-methods"><CreditCard className="mr-2 h-4 w-4 inline"/>Payment</TabsTrigger>
            <TabsTrigger value="order-history"><ShoppingBag className="mr-2 h-4 w-4 inline"/>Orders</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4 inline"/>Notifications</TabsTrigger>
            <TabsTrigger value="help-support"><HelpCircle className="mr-2 h-4 w-4 inline"/>Support</TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal-info">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your profile details.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...personalInfoForm}>
                  <form onSubmit={personalInfoForm.handleSubmit(onPersonalInfoSubmit)} className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={personalInfoForm.watch('avatarUrl') || mockUser.avatarUrl} alt={mockUser.fullName} />
                            <AvatarFallback>{mockUser.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <FormField
                            control={personalInfoForm.control}
                            name="avatarUrl"
                            render={({ field }) => (
                                <FormItem className="flex-grow">
                                <FormLabel>Avatar URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com/avatar.png" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                      control={personalInfoForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalInfoForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalInfoForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full sm:w-auto">Save Profile</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Delivery Addresses Tab */}
          <TabsContent value="addresses">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Addresses</CardTitle>
                <CardDescription>Manage your saved delivery locations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockAddresses.map((address) => (
                  <Card key={address.id} className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{address.street}</p>
                      <p className="text-sm text-muted-foreground">{`${address.city}, ${address.state} ${address.zipCode}`}</p>
                      {address.isDefault && <span className="text-xs text-primary font-medium">(Default)</span>}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => console.log('Edit address:', address.id)}><Edit3 className="h-4 w-4" /></Button>
                      <Button variant="destructive" size="icon" onClick={() => console.log('Remove address:', address.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </Card>
                ))}
                {mockAddresses.length === 0 && <p>No saved addresses.</p>}
                 <Button className="mt-4 w-full sm:w-auto" onClick={() => console.log('Add new address modal/page')}>
                    <PlusCircle className="mr-2 h-4 w-4"/> Add New Address
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payment-methods">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your saved payment options.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockPaymentMethods.map((method) => (
                  <Card key={method.id} className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{method.cardType} ending in {method.cardNumberLast4}</p>
                      <p className="text-sm text-muted-foreground">Expires {method.expiryDate}</p>
                      {method.isDefault && <span className="text-xs text-primary font-medium">(Default)</span>}
                    </div>
                     <div className="flex gap-2">
                       {!method.isDefault && <Button variant="outline" size="sm" onClick={() => console.log('Set as default:', method.id)}>Set Default</Button>}
                      <Button variant="destructive" size="icon" onClick={() => console.log('Remove payment:', method.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </Card>
                ))}
                {mockPaymentMethods.length === 0 && <p>No saved payment methods.</p>}
                <Button className="mt-4 w-full sm:w-auto" onClick={() => console.log('Add new payment method modal/page')}>
                    <PlusCircle className="mr-2 h-4 w-4"/> Add New Payment Method
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Order History Tab */}
          <TabsContent value="order-history">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View your past orders.</CardDescription>
              </CardHeader>
              <CardContent>
                {mockOrderHistory.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {mockOrderHistory.map((order) => (
                      <AccordionItem value={order.id} key={order.id}>
                        <AccordionTrigger>
                          <div className="flex justify-between w-full pr-4">
                            <span>Order ID: {order.id.substring(0,8)}...</span>
                            <span>{order.date}</span>
                            <span>${order.total.toFixed(2)}</span>
                            <span>Status: {order.status}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <p className="font-semibold mb-2">Order Items:</p>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {order.items.map(item => <li key={item.name}>{item.quantity}x {item.name}</li>)}
                          </ul>
                          <Button 
                            variant="link" 
                            className="mt-2 px-0" 
                            asChild
                          >
                            <Link to={`/order-tracking?orderId=${order.id}`}>View Details & Track</Link>
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p>You have no past orders.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notification Preferences Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you receive updates from us.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationPrefsForm}>
                  <form onSubmit={notificationPrefsForm.handleSubmit(onNotificationPrefsSubmit)} className="space-y-6">
                    <FormField
                      control={notificationPrefsForm.control}
                      name="orderUpdatesEmail"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Order Updates (Email)</FormLabel>
                            <FormDescription>Receive email notifications about your order status.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={notificationPrefsForm.control}
                      name="orderUpdatesSms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Order Updates (SMS)</FormLabel>
                            <FormDescription>Receive SMS notifications for critical order updates.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={notificationPrefsForm.control}
                      name="promotionalEmails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Promotional Emails</FormLabel>
                            <FormDescription>Receive emails about new offers and promotions.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={notificationPrefsForm.control}
                      name="appPushes"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">App Push Notifications</FormLabel>
                            <FormDescription>Receive push notifications on your mobile device.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full sm:w-auto">Save Preferences</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Help & Support Tab */}
          <TabsContent value="help-support">
            <Card>
              <CardHeader>
                <CardTitle>Help & Support</CardTitle>
                <CardDescription>Find answers to your questions or contact us.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>If you need assistance, please check our FAQ or contact our support team.</p>
                <div className="space-x-4">
                  <Button asChild><Link to="#">Visit FAQ</Link></Button> {/* Changed to # as /faq not in App.tsx */}
                  <Button variant="outline" asChild><Link to="#">Contact Support</Link></Button> {/* Changed to # as /contact not in App.tsx */}
                </div>
                <Separator className="my-6" />
                <h3 className="text-lg font-semibold">Account Actions</h3>
                <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto">
                    <LogOut className="mr-2 h-4 w-4"/> Log Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfilePage;