import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input'; // Though description says "search icon OR bar", I'll start with icon
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // For potential mobile menu
import { Package, MapPin, Search, ShoppingCart, User, Menu } from 'lucide-react';

interface HeaderProps {
  currentLocation?: string;
  cartItemCount?: number;
  isLoggedIn?: boolean; // Placeholder, can be expanded
  userName?: string; // Placeholder
}

const Header: React.FC<HeaderProps> = ({
  currentLocation = "Your Location",
  cartItemCount = 0,
  isLoggedIn = false, // Default to not logged in for placeholder
  userName = "Guest",
}) => {
  console.log('Header loaded');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        {/* Left Section: Logo and Location */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Package className="h-6 w-6 text-primary" />
            <span className="font-bold hidden sm:inline-block">FoodDash</span>
          </Link>
          <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{currentLocation}</span>
          </div>
        </div>

        {/* Center Section: Search (optional, can be expanded) */}
        {/* For now, search icon is on the right. This space could be used for a full search bar on larger screens if needed later. */}
        {/* Example: <div className="hidden md:flex flex-1 max-w-md"> <Input placeholder="Search restaurants or cuisines..." /> </div> */}


        {/* Right Section: Actions & Mobile Menu */}
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex" asChild>
            <Link to="/restaurant-listing" aria-label="Search restaurants">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/cart" aria-label="View shopping cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 min-w-fit p-0.5 text-xs flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </Badge>
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to={isLoggedIn ? "/user-profile" : "/user-profile"} aria-label={isLoggedIn ? `View ${userName}'s profile` : "Login or Sign Up"}>
              <User className="h-5 w-5" />
            </Link>
          </Button>

          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 pt-8">
                <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
                  <Package className="h-6 w-6 text-primary" />
                  FoodDash
                </Link>
                <div className="flex items-center gap-1 text-sm text-muted-foreground border-b pb-4 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{currentLocation}</span>
                </div>
                <Link to="/restaurant-listing" className="flex items-center gap-2 hover:text-primary">
                  <Search className="h-5 w-5" /> Search Restaurants
                </Link>
                <Link to="/user-profile" className="flex items-center gap-2 hover:text-primary">
                  <User className="h-5 w-5" /> {isLoggedIn ? `${userName}'s Profile` : "Login / Sign Up"}
                </Link>
                {/* Add other links as needed for mobile, e.g., Order Tracking */}
                <Link to="/order-tracking" className="flex items-center gap-2 hover:text-primary">
                  <Package className="h-5 w-5" /> Track Orders
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;