import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

// Custom Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MenuItemCard from '@/components/MenuItemCard';

// Shadcn/ui Components
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Lucide Icons
import { Star, Clock, MapPin, Settings2, ChevronRight } from 'lucide-react';

// Data types
interface CustomizationOptionChoice {
  label: string;
  priceChange?: number;
}
interface CustomizationOption {
  type: string;
  options: CustomizationOptionChoice[];
  defaultOption?: string;
}
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  customizable?: boolean;
  customizationOptions?: CustomizationOption[];
}

interface RestaurantData {
  id: string;
  name: string;
  address: string;
  rating: number;
  openingHours: string;
  cuisineTypes: string[];
  logoUrl: string;
  bannerUrl?: string;
  menu: {
    categories: string[];
    items: MenuItem[];
  };
}

// Placeholder Restaurant Data
const restaurantData: RestaurantData = {
  id: "rest123",
  name: "The Gourmet Place",
  address: "123 Foodie Lane, Gourmet City",
  rating: 4.7,
  openingHours: "11:00 AM - 10:00 PM",
  cuisineTypes: ["Modern European", "Fusion"],
  logoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmVzdGF1cmFudCUyMGxvZ298ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60",
  bannerUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1200&q=80",
  menu: {
    categories: ["Starters", "Main Courses", "Desserts", "Drinks"],
    items: [
      { id: "s1", name: "Artisan Bread Basket", description: "Selection of fresh artisan breads with butter and olive oil.", price: 8.00, category: "Starters", imageUrl: "https://images.unsplash.com/photo-1598135397039-b76698790160?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnJlYWQlMjBiYXNrZXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60" },
      { id: "s2", name: "Seared Scallops", description: "With parsnip puree and crispy pancetta.", price: 18.00, category: "Starters", imageUrl: "https://images.unsplash.com/photo-1600891964091-bab61c504705?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2VaredJTIwc2NhbGxvcHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60", customizable: true, customizationOptions: [{ type: 'Sauce', options: [{label: 'Lemon Butter'}, {label: 'Garlic Aioli'}], defaultOption: 'Lemon Butter'}] },
      { id: "m1", name: "Filet Mignon", description: "Grilled to perfection, served with potato gratin and asparagus.", price: 35.00, category: "Main Courses", imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmlsZXQlMjBtaWdub258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60", customizable: true, customizationOptions: [{ type: 'Doneness', options: [{label: 'Rare'}, {label: 'Medium Rare'}, {label: 'Medium'}, {label: 'Well Done'}], defaultOption: 'Medium Rare'}, {type: 'Side Sauce', options: [{label: 'Peppercorn', priceChange: 2}, {label: 'Béarnaise', priceChange: 2.50}], defaultOption: 'Peppercorn'}] },
      { id: "m2", name: "Pan-Seared Salmon", description: "With roasted vegetables and a dill-lemon sauce.", price: 28.00, category: "Main Courses", imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FsbW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60" },
      { id: "m3", name: "Mushroom Risotto", description: "Creamy risotto with wild mushrooms and truffle oil.", price: 22.00, category: "Main Courses", imageUrl: "https://images.unsplash.com/photo-1595908129330-636879388704?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmlzb3R0b3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=300&q=60" },
      { id: "d1", name: "Chocolate Lava Cake", description: "Warm chocolate cake with a molten center, served with vanilla ice cream.", price: 12.00, category: "Desserts", imageUrl: "https://images.unsplash.com/photo-1586985289900-80907680351f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hvY29sYXRlJTIwbGF2YSUyMGNha2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60" },
      { id: "dr1", name: "Sparkling Water", description: "Bottle of sparkling mineral water.", price: 4.00, category: "Drinks" },
    ]
  }
};

const RestaurantMenuPage = () => {
  console.log('RestaurantMenuPage loaded');
  // const [searchParams] = useSearchParams();
  // const restaurantId = searchParams.get('restaurantId');
  // In a real app, you would fetch restaurant data based on restaurantId
  // For this example, we use the static restaurantData.

  const [cartItemCount, setCartItemCount] = useState(0);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedItemForCustomization, setSelectedItemForCustomization] = useState<MenuItem | null>(null);
  const [customizationValues, setCustomizationValues] = useState<Record<string, string>>({});


  useEffect(() => {
    if (selectedItemForCustomization?.customizationOptions) {
      const defaultValues: Record<string, string> = {};
      selectedItemForCustomization.customizationOptions.forEach(opt => {
        if (opt.defaultOption) {
          defaultValues[opt.type] = opt.defaultOption;
        } else if (opt.options.length > 0) {
          defaultValues[opt.type] = opt.options[0].label; // Default to first option if no default specified
        }
      });
      setCustomizationValues(defaultValues);
    }
  }, [selectedItemForCustomization]);

  const handleAddToCart = (itemId: string | number, quantity: number, itemName: string) => {
    setCartItemCount(prevCount => prevCount + quantity);
    toast.success(`${quantity}x ${itemName} added to cart!`, {
      description: `Item ID: ${itemId}`,
    });
  };

  const handleCustomizedAddToCart = () => {
    if (!selectedItemForCustomization) return;
    // Logic to calculate price with customizations would go here
    const customizedPrice = selectedItemForCustomization.price; // Placeholder
    
    toast.success(`${selectedItemForCustomization.name} (customized) added to cart!`, {
      description: `Customizations: ${JSON.stringify(customizationValues)}`,
    });
    setCartItemCount(prevCount => prevCount + 1); // Assuming 1 customized item
    setIsSheetOpen(false);
  };

  const handleOpenCustomizationSheet = (item: MenuItem) => {
    setSelectedItemForCustomization(item);
    setIsSheetOpen(true);
  };

  const handleCustomizationChange = (optionType: string, value: string) => {
    setCustomizationValues(prev => ({ ...prev, [optionType]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header cartItemCount={cartItemCount} currentLocation="Gourmet City" />

      <ScrollArea className="flex-1">
        {/* Restaurant Banner Image */}
        {restaurantData.bannerUrl && (
          <div className="h-48 md:h-64 lg:h-80 w-full overflow-hidden">
            <img src={restaurantData.bannerUrl} alt={`${restaurantData.name} banner`} className="w-full h-full object-cover" />
          </div>
        )}

        <main className="container mx-auto px-4 py-6 md:py-10">
          {/* Breadcrumbs */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator><ChevronRight /></BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/restaurant-listing">Restaurants</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator><ChevronRight /></BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{restaurantData.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Restaurant Info Section */}
          <section className="mb-8 p-6 bg-card dark:bg-card rounded-lg shadow">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-2 border-primary">
                <AvatarImage src={restaurantData.logoUrl} alt={restaurantData.name} />
                <AvatarFallback>{restaurantData.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground dark:text-foreground">{restaurantData.name}</h1>
                <div className="flex flex-wrap gap-2 mb-3">
                  {restaurantData.cuisineTypes.map(cuisine => (
                    <Badge key={cuisine} variant="secondary">{cuisine}</Badge>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground dark:text-muted-foreground space-y-1">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1.5 text-yellow-400 fill-yellow-400" />
                    <span>{restaurantData.rating.toFixed(1)} stars</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1.5" />
                    <span>{restaurantData.openingHours}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1.5" />
                    <span>{restaurantData.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Menu Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground dark:text-foreground">Menu</h2>
            <Tabs defaultValue={restaurantData.menu.categories[0]} className="w-full">
              <TabsList className="mb-4 overflow-x-auto pb-1">
                {restaurantData.menu.categories.map(category => (
                  <TabsTrigger key={category} value={category} className="whitespace-nowrap">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              {restaurantData.menu.categories.map(category => (
                <TabsContent key={category} value={category}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {restaurantData.menu.items
                      .filter(item => item.category === category)
                      .map(item => (
                        <div key={item.id} className="flex flex-col">
                          <MenuItemCard
                            id={item.id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            imageUrl={item.imageUrl}
                            onAddToCart={handleAddToCart}
                          />
                          {item.customizable && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenCustomizationSheet(item)}
                              className="mt-2 w-full"
                            >
                              <Settings2 className="mr-2 h-4 w-4" />
                              Customize
                            </Button>
                          )}
                        </div>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </section>
        </main>
      </ScrollArea>

      {/* Customization Sheet */}
      {selectedItemForCustomization && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="sm:max-w-lg w-full flex flex-col">
            <SheetHeader>
              <SheetTitle>Customize: {selectedItemForCustomization.name}</SheetTitle>
              <SheetDescription>
                Make selections for your item. Price may vary based on options.
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="flex-1 py-4 pr-6"> {/* Added pr-6 for scrollbar visibility */}
              <div className="space-y-6">
                {selectedItemForCustomization.customizationOptions?.map(optionGroup => (
                  <div key={optionGroup.type}>
                    <Label className="text-base font-medium">{optionGroup.type}</Label>
                    <RadioGroup
                      value={customizationValues[optionGroup.type]}
                      onValueChange={(value) => handleCustomizationChange(optionGroup.type, value)}
                      className="mt-2 space-y-2"
                    >
                      {optionGroup.options.map(choice => (
                        <div key={choice.label} className="flex items-center space-x-2">
                          <RadioGroupItem value={choice.label} id={`${optionGroup.type}-${choice.label}`} />
                          <Label htmlFor={`${optionGroup.type}-${choice.label}`} className="flex-1 cursor-pointer">
                            {choice.label}
                            {choice.priceChange && choice.priceChange > 0 && (
                              <span className="text-xs text-muted-foreground ml-1">(+${choice.priceChange.toFixed(2)})</span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
                {!selectedItemForCustomization.customizationOptions?.length && (
                    <p className="text-muted-foreground">No customization options available for this item.</p>
                )}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto pt-4 border-t">
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <Button onClick={handleCustomizedAddToCart}>Add to Cart</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}

      <Footer />
    </div>
  );
};

export default RestaurantMenuPage;