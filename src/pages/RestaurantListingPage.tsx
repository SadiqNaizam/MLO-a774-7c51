import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Custom Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RestaurantCard from '@/components/RestaurantCard';

// Shadcn/ui Components
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Icons
import { Search, SlidersHorizontal, ListFilter } from 'lucide-react';

interface Restaurant {
  id: string;
  imageUrl: string;
  name: string;
  cuisineTypes: string[];
  rating: number;
  deliveryTime: string; // e.g., "25-35 min"
  promotionalTag?: string; // e.g., "20% OFF"
  distance?: string; // e.g., "0.8 km"
  priceRange?: '$' | '$$' | '$$$' | '$$$$'; // Example for filtering later
}

const ALL_RESTAURANTS: Restaurant[] = [
  { id: '1', name: 'Pizza Heaven', cuisineTypes: ['Italian', 'Pizza'], rating: 4.5, deliveryTime: '25-35 min', imageUrl: 'https://source.unsplash.com/random/400x225/?pizza,restaurant&sig=1', promotionalTag: '15% Off', distance: '1.2 km', priceRange: '$$' },
  { id: '2', name: 'Burger Queen', cuisineTypes: ['American', 'Burgers'], rating: 4.2, deliveryTime: '20-30 min', imageUrl: 'https://source.unsplash.com/random/400x225/?burger,restaurant&sig=2', distance: '0.5 km', priceRange: '$$' },
  { id: '3', name: 'Sushi World', cuisineTypes: ['Japanese', 'Sushi'], rating: 4.8, deliveryTime: '30-40 min', imageUrl: 'https://source.unsplash.com/random/400x225/?sushi,restaurant&sig=3', promotionalTag: 'Free Edamame', distance: '2.5 km', priceRange: '$$$' },
  { id: '4', name: 'Taco Fiesta', cuisineTypes: ['Mexican', 'Tacos'], rating: 4.3, deliveryTime: '20-25 min', imageUrl: 'https://source.unsplash.com/random/400x225/?taco,restaurant&sig=4', distance: '0.8 km', priceRange: '$' },
  { id: '5', name: 'Curry House', cuisineTypes: ['Indian', 'Curry'], rating: 4.6, deliveryTime: '35-45 min', imageUrl: 'https://source.unsplash.com/random/400x225/?curry,restaurant&sig=5', distance: '3.1 km', priceRange: '$$' },
  { id: '6', name: 'Pasta Palace', cuisineTypes: ['Italian', 'Pasta'], rating: 4.0, deliveryTime: '25-35 min', imageUrl: 'https://source.unsplash.com/random/400x225/?pasta,restaurant&sig=6', promotionalTag: 'Save $5', distance: '1.5 km', priceRange: '$$' },
  { id: '7', name: 'Vegan Delight', cuisineTypes: ['Vegan', 'Healthy'], rating: 4.9, deliveryTime: '30-40 min', imageUrl: 'https://source.unsplash.com/random/400x225/?vegan,food&sig=7', distance: '2.0 km', priceRange: '$$$' },
  { id: '8', name: 'Steakhouse Supreme', cuisineTypes: ['Steak', 'American'], rating: 4.7, deliveryTime: '40-50 min', imageUrl: 'https://source.unsplash.com/random/400x225/?steak,restaurant&sig=8', promotionalTag: 'Dinner Special', distance: '4.0 km', priceRange: '$$$$' },
  { id: '9', name: 'Breakfast Nook', cuisineTypes: ['Breakfast', 'Cafe'], rating: 4.4, deliveryTime: '15-25 min', imageUrl: 'https://source.unsplash.com/random/400x225/?breakfast,cafe&sig=9', distance: '0.3 km', priceRange: '$' },
  { id: '10', name: 'Seafood Shack', cuisineTypes: ['Seafood', 'Grill'], rating: 4.1, deliveryTime: '30-40 min', imageUrl: 'https://source.unsplash.com/random/400x225/?seafood,restaurant&sig=10', distance: '2.8 km', priceRange: '$$$' },
];

const ITEMS_PER_PAGE = 6;

const RestaurantListingPage: React.FC = () => {
  console.log('RestaurantListingPage loaded');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || '';


  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('relevance'); // 'relevance', 'rating', 'deliveryTime'
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory); // For pre-filtering if coming from category click


  useEffect(() => {
    // If URL has a category, set it as active and potentially pre-fill search or apply filter
    const categoryFromUrl = queryParams.get('category');
    if (categoryFromUrl) {
      setActiveCategory(categoryFromUrl);
      // Optionally, set search term if category implies a search, e.g., setSearchTerm(categoryFromUrl.replace('-', ' '));
    }
  }, [location.search]);


  const filteredAndSortedRestaurants = useMemo(() => {
    let restaurants = [...ALL_RESTAURANTS];

    // Filter by active category (if any)
    if (activeCategory) {
      restaurants = restaurants.filter(r => 
        r.cuisineTypes.some(cuisine => cuisine.toLowerCase().includes(activeCategory.replace('-', ' ').toLowerCase()))
      );
    }

    // Filter by search term
    if (searchTerm) {
      restaurants = restaurants.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cuisineTypes.some(cuisine => cuisine.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort
    if (sortOption === 'rating') {
      restaurants.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'deliveryTime') {
      restaurants.sort((a, b) => {
        const timeA = parseInt(a.deliveryTime.split('-')[0]);
        const timeB = parseInt(b.deliveryTime.split('-')[0]);
        return timeA - timeB;
      });
    }
    // 'relevance' (default) means no specific sort beyond initial + filters

    return restaurants;
  }, [searchTerm, sortOption, activeCategory]);

  const totalPages = Math.ceil(filteredAndSortedRestaurants.length / ITEMS_PER_PAGE);
  const currentRestaurants = filteredAndSortedRestaurants.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0); // Scroll to top on page change
    }
  };
  
  // For Pagination display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Max number of direct page links to show
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= halfMaxPages + 1) {
        for (let i = 1; i <= maxPagesToShow -1 ; i++) pageNumbers.push(i);
        pageNumbers.push('ellipsis-end');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - halfMaxPages) {
        pageNumbers.push(1);
        pageNumbers.push('ellipsis-start');
        for (let i = totalPages - maxPagesToShow + 2; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1);
        pageNumbers.push('ellipsis-start');
        for (let i = currentPage - halfMaxPages +1; i <= currentPage + halfMaxPages -1; i++) pageNumbers.push(i);
        pageNumbers.push('ellipsis-end');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header cartItemCount={3} isLoggedIn={true} userName="Jane Doe" currentLocation="Springfield, IL" />
      
      <ScrollArea className="flex-1">
        <main className="container mx-auto px-4 py-8">
          <section aria-labelledby="restaurant-listing-title" className="mb-8">
            <h1 id="restaurant-listing-title" className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
              Restaurants Near You
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {activeCategory ? `Showing results for "${activeCategory.replace('-', ' ')}"` : "Discover a variety of cuisines and dishes."}
            </p>
             {activeCategory && (
                 <Button variant="link" onClick={() => { setActiveCategory(''); setSearchTerm(''); }} className="p-0 h-auto text-primary hover:underline">
                    Clear category filter
                 </Button>
            )}
          </section>

          {/* Search and Filter Controls */}
          <Card className="p-4 sm:p-6 mb-8 sticky top-16 md:top-20 bg-background/80 backdrop-blur-sm z-40 shadow">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-grow w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search by restaurant or cuisine..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1);}}
                  className="pl-10 pr-4 py-2 w-full text-base"
                  aria-label="Search restaurants"
                />
              </div>
              <div className="flex gap-4 w-full sm:w-auto">
                <Select value={sortOption} onValueChange={(value) => {setSortOption(value); setCurrentPage(1);}}>
                  <SelectTrigger className="w-full sm:w-[180px] text-base" aria-label="Sort restaurants by">
                    <ListFilter className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="rating">Rating (High to Low)</SelectItem>
                    <SelectItem value="deliveryTime">Delivery Time (Fastest)</SelectItem>
                  </SelectContent>
                </Select>
                {/* Placeholder for more advanced filters */}
                <Button variant="outline" className="w-full sm:w-auto text-base" onClick={() => alert("Advanced filter options would open here.")}>
                  <SlidersHorizontal className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                  Filters
                </Button>
              </div>
            </div>
          </Card>

          {/* Restaurant Grid */}
          {currentRestaurants.length > 0 ? (
            <section aria-label="List of available restaurants">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} {...restaurant} />
                ))}
              </div>
            </section>
          ) : (
            <div className="text-center py-12">
              <img src="https://illustrations.popsy.co/gray/search-engine.svg" alt="No results found" className="mx-auto h-40 w-40 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Restaurants Found</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filters.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-12">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                    aria-disabled={currentPage === 1}
                  />
                </PaginationItem>
                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {typeof page === 'number' ? (
                      <PaginationLink
                        href="#"
                        onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    ) : (
                      <PaginationEllipsis />
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                    aria-disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </main>
      </ScrollArea>
      <Footer />
    </div>
  );
};

export default RestaurantListingPage;