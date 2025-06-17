import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils'; // Assuming utils.ts with cn function exists

interface CuisineCategoryChipProps {
  /** The display name of the category (e.g., "Italian Food", "Sushi") */
  name: string;
  /** The URL-friendly slug for the category (e.g., "italian-food", "sushi"), used in the link query. */
  slug: string;
  /** Optional icon element to display next to the name. Example: <PizzaIcon className="h-4 w-4" /> */
  icon?: React.ReactNode;
  /** Whether the chip represents the currently active/selected category. Defaults to false. */
  isActive?: boolean;
  /** Optional additional class names to apply to the Link wrapper for layout (e.g., margins). */
  className?: string;
}

const CuisineCategoryChip: React.FC<CuisineCategoryChipProps> = ({
  name,
  slug,
  icon,
  isActive = false,
  className,
}) => {
  console.log(`CuisineCategoryChip loaded for: ${name}, slug: ${slug}, isActive: ${isActive}`);

  return (
    <Link
      to={`/restaurant-listing?category=${slug}`}
      className={cn(
        "inline-block rounded-full transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      aria-label={`View ${name} restaurants`}
      // Adding role="button" can enhance semantics for links styled as interactive controls
      // but ensure it doesn't conflict with screen reader interpretation of a link.
      // For simple navigation, aria-label is often sufficient.
    >
      <Badge
        variant={isActive ? 'default' : 'secondary'}
        className={cn(
          "flex cursor-pointer items-center whitespace-nowrap px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm",
          icon ? "gap-x-1.5 sm:gap-x-2" : "", // Conditional gap if icon exists
        )}
      >
        {icon}
        <span>{name}</span>
      </Badge>
    </Link>
  );
};

export default CuisineCategoryChip;