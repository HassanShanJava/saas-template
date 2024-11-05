import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterBadgesProps {
  filters: { label: string; value: string }[];
  onRemoveFilter: (value: string) => void;
  onClearAll: () => void;
  categoryOptions?: { label: number; value: string }[]; // Add this line
}

export const FilterBadges: React.FC<FilterBadgesProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
  categoryOptions,
}) => {
  // Convert categoryOptions IDs to strings for mapping
  const categoryMap = new Map(
    categoryOptions?.map((option) => [option.value.toString(), option.label])
  );

  return (
    <div className="flex items-center space-x-2 py-2">
      {filters.length > 0 && (
        <Button variant="ghost" size="sm" onClick={onClearAll}>
          Clear All
        </Button>
      )}
      {filters.map((filter) => (
        <Badge
          key={filter.value}
          variant="secondary"
          className="flex items-center space-x-1"
        >
          {categoryMap.has(filter.value)
            ? categoryMap.get(filter.value)
            : filter.label}
          <XIcon
            className="ml-1 h-3 w-3 cursor-pointer"
            onClick={() => onRemoveFilter(filter.value)}
          />
        </Badge>
      ))}
    </div>
  );
};
