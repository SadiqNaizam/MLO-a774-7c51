import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Star, Clock3, MapPin, Percent } from 'lucide-react';

interface RestaurantCardProps {
  id: string;
  imageUrl: string;
  name: string;
  cuisineTypes: string[];
  rating: number;
  deliveryTime: string; // e.g., "25-35 min"
  promotionalTag?: string; // e.g., "20% OFF"
  distance?: string; // e.g., "0.8 km"
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  imageUrl,
  name,
  cuisineTypes,
  rating,
  deliveryTime,
  promotionalTag,
  distance,
}) => {
  console.log('RestaurantCard loaded for:', name, id);

  return (
    <Link to={`/restaurant-menu?restaurantId=${id}`} className="block group outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg">
      <Card className="w-full overflow-hidden transition-all duration-200 group-hover:shadow-xl group-focus-visible:shadow-xl">
        <div className="overflow-hidden">
          <AspectRatio ratio={16 / 9}>
            <img
              src={imageUrl || 'https://via.placeholder.com/400x225?text=Restaurant'}
              alt={`Image of ${name}`}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </AspectRatio>
        </div>
        <CardContent className="p-4 space-y-2">
          <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-primary">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {cuisineTypes.join(', ')}
          </p>
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
              <span>{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <Clock3 className="h-4 w-4 mr-1" />
              <span>{deliveryTime}</span>
            </div>
            {distance && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{distance}</span>
              </div>
            )}
          </div>
          {promotionalTag && (
            <Badge variant="secondary" className="mt-2 inline-flex items-center text-xs">
              <Percent className="h-3 w-3 mr-1" />
              {promotionalTag}
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default RestaurantCard;