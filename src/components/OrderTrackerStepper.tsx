import React from 'react';
import { PackageCheck, ChefHat, Bike, Truck, PartyPopper, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming 'cn' is available from shadcn/ui setup

export type OrderStatus =
  | 'ORDER_PLACED'
  | 'IN_KITCHEN'
  | 'RIDER_ASSIGNED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED';

interface StepConfig {
  id: OrderStatus;
  label: string;
  icon: React.ElementType;
}

const STEPS: StepConfig[] = [
  { id: 'ORDER_PLACED', label: 'Order Placed', icon: PackageCheck },
  { id: 'IN_KITCHEN', label: 'In Kitchen', icon: ChefHat },
  { id: 'RIDER_ASSIGNED', label: 'Rider Assigned', icon: Bike },
  { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
  { id: 'DELIVERED', label: 'Delivered', icon: PartyPopper }, // Default icon for "Delivered" state
];

interface OrderTrackerStepperProps {
  currentStatus: OrderStatus;
  className?: string;
}

const OrderTrackerStepper: React.FC<OrderTrackerStepperProps> = ({ currentStatus, className }) => {
  console.log('OrderTrackerStepper loaded with status:', currentStatus);
  const currentStepIndex = STEPS.findIndex(step => step.id === currentStatus);

  if (currentStepIndex === -1) {
    console.error('OrderTrackerStepper: Invalid currentStatus provided.');
    return <div className="text-red-500">Error: Invalid order status.</div>;
  }

  return (
    <div className={cn("w-full p-4", className)}>
      <div className="flex items-start justify-between">
        {STEPS.map((step, index) => {
          const isPast = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          let IconToRender: React.ElementType = step.icon;
          let iconContainerClasses = "bg-gray-300";
          let iconClasses = "text-gray-500";
          let textClasses = "text-gray-600";
          let lineClassesAfter = "bg-gray-300"; // Style for the line connecting to the *next* step

          if (isPast) {
            IconToRender = CheckCircle;
            iconContainerClasses = "bg-green-500"; // Green for completed
            iconClasses = "text-white";
            textClasses = "text-green-600 font-semibold";
            lineClassesAfter = "bg-green-500";
          } else if (isCurrent) {
            IconToRender = step.icon; // Use the step's specific icon
            if (step.id === 'DELIVERED') { // Special icon for active "Delivered" state
              IconToRender = PartyPopper;
            }
            iconContainerClasses = "bg-blue-500"; // Blue for active/current
            iconClasses = "text-white";
            textClasses = "text-blue-600 font-semibold";
            // lineClassesAfter remains gray-300 as the next step is not yet active/completed
          }
          // For future steps, default gray styles (icon, text, line) are already set

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center text-center" style={{ width: `${100 / STEPS.length}%` }}>
                <div
                  className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-110",
                    iconContainerClasses
                  )}
                >
                  <IconToRender className={cn("w-5 h-5 md:w-6 md:h-6 transition-all duration-300", iconClasses)} />
                </div>
                <p className={cn("mt-2 text-xs sm:text-sm break-words min-h-[2.5rem] sm:min-h-[2rem]", textClasses)}>
                  {step.label}
                </p>
              </div>

              {index < STEPS.length - 1 && (
                <div className={cn("flex-1 h-1 mt-5 md:mt-[1.375rem] mx-1 sm:mx-2 transition-all duration-300", lineClassesAfter)}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTrackerStepper;