import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Minus, Plus, ShoppingCart } from 'lucide-react';

interface MenuItemCardProps {
  id: string | number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  onAddToCart: (itemId: string | number, quantity: number, itemName: string) => void;
  currencySymbol?: string;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  onAddToCart,
  currencySymbol = '$',
}) => {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  console.log(`MenuItemCard loaded for: ${name}`);

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    } else if (event.target.value === '') {
      // Allow clearing the input, but treat as 1 for add to cart logic if left empty
      setQuantity(1); // Or handle as an error/disable button
    }
  };

  const handleAddToCartClick = () => {
    onAddToCart(id, quantity, name);
    toast({
      title: "Item Added to Cart",
      description: `${quantity} x ${name} added to your cart.`,
    });
  };

  return (
    <Card className="w-full flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      {imageUrl && (
        <CardHeader className="p-0">
          <AspectRatio ratio={16 / 9}>
            <img
              src={imageUrl}
              alt={name}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
        </CardHeader>
      )}
      <CardContent className={`p-4 flex-grow ${!imageUrl ? 'pt-6' : ''}`}>
        <CardTitle className="text-lg font-semibold mb-1">{name}</CardTitle>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{description}</p>
        <p className="text-lg font-bold text-primary">{currencySymbol}{price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 border-t bg-slate-50 dark:bg-slate-800/30">
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleDecrement} aria-label="Decrease quantity">
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-16 text-center"
              min="1"
              aria-label="Item quantity"
            />
            <Button variant="outline" size="icon" onClick={handleIncrement} aria-label="Increase quantity">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleAddToCartClick} className="flex-1 sm:mt-0 mt-2 w-full sm:w-auto">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;