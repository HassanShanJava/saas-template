import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  value: { start_date: Date | undefined; end_date: Date | undefined };
  onValueChange: (value: {
    start_date: Date | undefined;
    end_date: Date | undefined;
  }) => void;
  label?: string;
}

export function DatePickerWithRange({
  name,
  value,
  onValueChange,
  label = "Pick a date",
  className,
}: DatePickerWithRangeProps) {
  const [open, setOpen] = React.useState(false);

  const handleDateChange = (range: DateRange | undefined) => {
    onValueChange({
      start_date: range?.from,
      end_date: range?.to,
    });

    if (range?.from && range?.to) {
      setOpen(false);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={name}
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal"
              // !value.start_date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value.start_date ? (
              value.end_date ? (
                <>
                  {format(value.start_date, "LLL dd, y")} -{" "}
                  {format(value.end_date, "LLL dd, y")}
                </>
              ) : (
                format(value.start_date, "LLL dd, y")
              )
            ) : (
              <span>{label}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value.start_date}
            selected={{ from: value.start_date, to: value.end_date }}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
