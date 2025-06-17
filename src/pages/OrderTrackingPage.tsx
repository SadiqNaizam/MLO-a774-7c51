import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Custom Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OrderTrackerStepper, { OrderStatus } from '@/components/OrderTrackerStepper'; // Import OrderStatus type

// shadcn/ui Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

// Icons
import { MapPin, Phone, Info } from 'lucide-react';

const orderStages: OrderStatus[] = [
  'ORDER_PLACED',
  'IN_KITCHEN',
  'RIDER_ASSIGNED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

const progressMap: Record<OrderStatus, number> = {
  ORDER_PLACED: 10,
  IN_KITCHEN: 30,
  RIDER_ASSIGNED: 50,
  OUT_FOR_DELIVERY: 75,
  DELIVERED: 100,
};

const etaMap: Record<OrderStatus, string> = {
  ORDER_PLACED: 'Calculating...',
  IN_KITCHEN: 'Approx. 25-35 minutes',
  RIDER_ASSIGNED: 'Approx. 15-25 minutes',
  OUT_FOR_DELIVERY: 'Approx. 5-15 minutes',
  DELIVERED: 'Delivered!',
};

const OrderTrackingPage: React.FC = () => {
  console.log('OrderTrackingPage loaded');
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('ORDER_PLACED');
  const [progressValue, setProgressValue] = useState<number>(progressMap.ORDER_PLACED);
  const [estimatedTime, setEstimatedTime] = useState<string>(etaMap.ORDER_PLACED);
  const orderId = "FD12345XYZ"; // Example Order ID

  useEffect(() => {
    // Simulate order progress
    let stageIndex = 0;
    const interval = setInterval(() => {
      stageIndex++;
      if (stageIndex < orderStages.length) {
        const nextStatus = orderStages[stageIndex];
        setCurrentStatus(nextStatus);
        setProgressValue(progressMap[nextStatus]);
        setEstimatedTime(etaMap[nextStatus]);
      } else {
        clearInterval(interval);
      }
    }, 7000); // Change status every 7 seconds for demo

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header currentLocation="Tracking Order..." cartItemCount={0} />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <Card className="w-full max-w-3xl mx-auto shadow-xl">
          <CardHeader className="border-b">
            <CardTitle className="text-2xl md:text-3xl font-bold">Order Tracking</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Order ID: <span className="font-semibold text-primary">{orderId}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <section>
              <h2 className="text-lg font-semibold mb-3">Current Status: {currentStatus.replace('_', ' ')}</h2>
              <OrderTrackerStepper currentStatus={currentStatus} />
            </section>

            <section className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
                  <span className="text-sm font-medium text-primary">{progressValue}%</span>
                </div>
                <Progress value={progressValue} aria-label="Order progress" className="w-full h-3" />
              </div>
              <p className="text-center text-lg">
                Estimated Delivery Time: <span className="font-semibold text-green-600">{estimatedTime}</span>
              </p>
            </section>

            {currentStatus !== 'DELIVERED' && (
            <section className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800/30">
              <h3 className="text-md font-semibold mb-2 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                Delivery Information (Live Map Placeholder)
              </h3>
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">
                  {currentStatus === 'OUT_FOR_DELIVERY' ? "Rider's live location will appear here." : "Map will activate when rider is out for delivery."}
                </p>
              </div>
               {currentStatus === 'OUT_FOR_DELIVERY' && (
                <div className="mt-3 text-sm">
                  <p><strong>Rider:</strong> Alex P.</p>
                  <p><strong>Contact:</strong> (555) 012-3456 (For emergencies only)</p>
                </div>
              )}
            </section>
            )}
            
            {currentStatus === 'DELIVERED' && (
                <div className="text-center p-6 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">Your order has been delivered!</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">Enjoy your meal! Thank you for using FoodDash.</p>
                    <Button asChild className="mt-4">
                        <Link to="/">Order Again</Link>
                    </Button>
                </div>
            )}


            <section className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => alert('Feature coming soon!')}>
                <Phone className="mr-2 h-4 w-4" /> Contact Support
              </Button>
              <Button variant="ghost" className="w-full sm:w-auto" onClick={() => alert('Receipt details would show here.')}>
                <Info className="mr-2 h-4 w-4" /> View Receipt
              </Button>
              <Button asChild className="w-full sm:w-auto sm:ml-auto">
                <Link to="/">Back to Homepage</Link>
              </Button>
            </section>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default OrderTrackingPage;