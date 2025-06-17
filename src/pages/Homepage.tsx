import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Custom Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LocationSearchBar from '@/components/LocationSearchBar';
import CuisineCategoryChip from '@/components/CuisineCategoryChip';
import RestaurantCard from '@/components/RestaurantCard';

// Shadcn/ui Components
import { ScrollArea } from '@/components/ui/scroll-area';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Lucide Icons for Category Chips
import { Pizza, UtensilsCrossed, FishSymbol, Salad, CakeSlice, Coffee } from 'lucide-react';

// Placeholder data
const cuisineCategories = [
  { name: 'Pizza', slug: 'pizza', icon: <Pizza className="h-5 w-5" /> },
  { name: 'Burgers', slug: 'burgers', icon: <UtensilsCrossed className="h-5 w-5" /> },
  { name: 'Sushi', slug: 'sushi', icon: <FishSymbol className="h-5 w-5" /> },
  { name: 'Salads', slug: 'salads', icon: <Salad className="h-5 w-5" /> },
  { name: 'Desserts', slug: 'desserts', icon: <CakeSlice className="h-5 w-5" /> },
  { name: 'Coffee & Tea', slug: 'coffee-tea', icon: <Coffee className="h-5 w-5" /> },
  { name: 'Italian', slug: 'italian', icon: <Pizza className="h-5 w-5" /> }, // Re-using for variety
  { name: 'Mexican', slug: 'mexican', icon: <UtensilsCrossed className="h-5 w-5" /> }, // Re-using for variety
];

const featuredRestaurants = [
  { id: 'feat-1', imageUrl: 'https://placehold.co/600x400/FFBF00/FFFFFF?text=Featured+Grill', name: 'The Sizzling Grill', cuisineTypes: ['Steakhouse', 'BBQ'], rating: 4.7, deliveryTime: '35-45 min', promotionalTag: '15% Off Entire Order' },
  { id: 'feat-2', imageUrl: 'https://placehold.co/600x400/34D399/FFFFFF?text=Vegan+Delights', name: 'Green Leaf Eatery', cuisineTypes: ['Vegan', 'Healthy'], rating: 4.9, deliveryTime: '25-35 min', distance: '0.5 km' },
  { id: 'feat-3', imageUrl: 'https://placehold.co/600x400/8B5CF6/FFFFFF?text=Pasta+Paradise', name: 'Pasta Paradise', cuisineTypes: ['Italian', 'Pasta'], rating: 4.6, deliveryTime: '30-40 min' },
  { id: 'feat-4', imageUrl: 'https://placehold.co/600x400/F87171/FFFFFF?text=Spicy+Noodles', name: 'Noodle Nirvana', cuisineTypes: ['Asian', 'Noodles'], rating: 4.5, deliveryTime: '20-30 min', promotionalTag: 'Free Dumplings' },
];

const popularRestaurants = [
  { id: 'pop-1', imageUrl: 'https://placehold.co/600x400/F472B6/FFFFFF?text=Sweet+Treats', name: 'Sweet Dreams Bakery', cuisineTypes: ['Desserts', 'Cakes'], rating: 4.8, deliveryTime: '15-25 min', distance: '1.1 km' },
  { id: 'pop-2', imageUrl: 'https://placehold.co/600x400/60A5FA/FFFFFF?text=Ocean+Catch', name: 'Ocean Catch Seafood', cuisineTypes: ['Seafood', 'Grill'], rating: 4.4, deliveryTime: '40-50 min' },
  { id: 'pop-3', imageUrl: 'https://placehold.co/600x400/A78BFA/FFFFFF?text=Taco+Fiesta', name: 'Taco Fiesta', cuisineTypes: ['Mexican', 'Tacos'], rating: 4.6, deliveryTime: '25-35 min', promotionalTag: 'Taco Tuesday Special' },
  { id: 'pop-4', imageUrl: 'https://placehold.co/600x400/2DD4BF/FFFFFF?text=Burger+Joint', name: 'The Burger Joint', cuisineTypes: ['Burgers', 'Fast Food'], rating: 4.3, deliveryTime: '20-30 min', distance: '2.5 km' },
];


const Homepage = () => {
  const [currentLocation, setCurrentLocation] = useState<string>('');

  console.log('Homepage loaded');

  const handleSetLocation = (location: string) => {
    setCurrentLocation(location);
    // Potentially trigger API calls to fetch restaurants for the new location
    console.log('New location set:', location);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-background">
      <Header currentLocation={currentLocation || "Set Location"} cartItemCount={3} isLoggedIn={false} userName="Guest"/>
      
      <ScrollArea className="flex-1">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-10 md:space-y-16">
          
          {/* Section 1: Location Search Bar - Prominent */}
          <section aria-labelledby="location-search-heading" className="py-8 md:py-12 bg-gradient-to-r from-primary to-orange-500 dark:from-primary/80 dark:to-orange-600/80 rounded-xl shadow-xl text-center">
            <div className="container mx-auto px-4">
              <h1 id="location-search-heading" className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
                Your Next Meal, Delivered.
              </h1>
              <p className="text-white/90 mb-8 md:text-xl max-w-2xl mx-auto">
                Discover local favorites and new cravings. Just enter your address below.
              </p>
              <LocationSearchBar
                currentLocation={currentLocation}
                onLocationSet={handleSetLocation}
                placeholder="Enter delivery address or zip code"
                className="max-w-2xl" 
              />
            </div>
          </section>

          {/* Section 2: Cuisine Categories */}
          <section aria-labelledby="cuisine-categories-heading">
            <h2 id="cuisine-categories-heading" className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Explore Cuisines</h2>
            <ScrollArea orientation="horizontal" className="pb-4 -mx-1">
              <div className="flex space-x-3 px-1">
                {cuisineCategories.map((category, index) => (
                  <CuisineCategoryChip
                    key={`${category.slug}-${index}`}
                    name={category.name}
                    slug={category.slug}
                    icon={category.icon}
                    className="flex-shrink-0"
                  />
                ))}
              </div>
            </ScrollArea>
          </section>

          {/* Section 3: Featured Restaurants (Carousel) */}
          <section aria-labelledby="featured-restaurants-heading">
            <h2 id="featured-restaurants-heading" className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Featured Restaurants</h2>
            <Carousel 
              opts={{ align: "start", loop: true }} 
              className="w-full -mx-2" // Negative margin to visually align with grid below if cards have padding
            >
              <CarouselContent className="px-2"> {/* Padding to ensure shadows/outlines aren't clipped */}
                {featuredRestaurants.map((restaurant) => (
                  <CarouselItem key={restaurant.id} className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 p-2"> {/* Responsive item width and padding */}
                    <RestaurantCard {...restaurant} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 ml-2 hidden md:flex" />
              <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 mr-2 hidden md:flex" />
            </Carousel>
          </section>

          {/* Section 4: Popular Restaurants (Grid) */}
          <section aria-labelledby="popular-restaurants-heading">
            <h2 id="popular-restaurants-heading" className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Popular Near You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {popularRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} {...restaurant} />
              ))}
            </div>
          </section>

          {/* Section 5: Promotions */}
          <section aria-labelledby="promotions-heading">
            <h2 id="promotions-heading" className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Today's Deals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-teal-500 dark:bg-teal-600 text-white p-6 rounded-lg shadow-lg overflow-hidden relative">
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full"></div>
                <CardHeader className="p-0 mb-3">
                  <CardTitle className="text-2xl font-semibold">Midweek Munchies!</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="mb-4">Get 20% off on all orders over $30. Use code: <span className="font-bold bg-white/20 px-1 py-0.5 rounded">MUNCH20</span></p>
                  <Button variant="secondary" size="lg" className="bg-white text-teal-600 hover:bg-gray-100" asChild>
                     <Link to="/restaurant-listing?promo=MUNCH20">Order Now</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-purple-500 dark:bg-purple-600 text-white p-6 rounded-lg shadow-lg overflow-hidden relative">
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/10 rounded-full"></div>
                <CardHeader className="p-0 mb-3">
                  <CardTitle className="text-2xl font-semibold">Free Delivery Fiesta</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="mb-4">Enjoy complimentary delivery on your first two orders this month. No code needed!</p>
                  <Button variant="secondary" size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
                    <Link to="/restaurant-listing">Explore Restaurants</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

        </main>
      </ScrollArea>
      <Footer />
    </div>
  );
};

export default Homepage;