"use client";

import * as React from "react";
import { Clock } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeOperatorSelectorProps {
  name: string;
  label: string;
  value: { operator: string; time: string };
  options: { value: string; label: string }[];
  onChange: (value: { operator: string; time: string }) => void;
}

// Generate time options with 30-minute intervals
const generateTimeOptions = () => {
  return Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2)
      .toString()
      .padStart(2, "0");
    const minutes = (i % 2 === 0 ? 0 : 30).toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  });
};

export function TimeOperatorSelector({
  name,
  label,
  value,
  onChange,
  options
}: TimeOperatorSelectorProps) {
  const [operatorState, setOperatorState] = React.useState(value.operator || "");

  const timeOptions = React.useMemo(() => generateTimeOptions(), []);

  const handleOperatorChange = (newOperator: string) => {
    setOperatorState(newOperator); // Update local state

    // Update filterData with formatted key like "ticket_end_time_gt:10:00"
    const filterKey = `${name}_${newOperator}`;
  };

  // Handle Time Change and propagate to parent state
  const handleTimeChange = (newTime: string) => {
    // Update filterData with formatted key like "ticket_end_time_gt:10:00"
    const filterKey = `${name}_${value.operator}`;
    onChange({ time: newTime, operator: operatorState });
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        {/* Operator Selector */}
        <Select value={operatorState} onValueChange={handleOperatorChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select operator" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Time Selector */}
        <Select value={value.time} onValueChange={handleTimeChange}>
          <SelectTrigger className="w-full">
            <Clock className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
