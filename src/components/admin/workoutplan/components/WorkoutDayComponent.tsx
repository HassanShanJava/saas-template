import { Button } from "@/components/ui/button";
import {
  FloatingLabel,
  FloatingLabelInput,
} from "@/components/ui/floatinglable/floating";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface WorkoutDay {
  id?: number;
  week: number;
  day: number;
  day_name?: string;
}
export interface WorkoutDayOptional {
  id?: number;
  week?: number;
  day?: number;
  day_name?: string;
}
interface WorkoutDayProps {
  day: WorkoutDay;
  onSave: (day_name: string) => void;
  onDelete?: (id: number) => void;
  onUpdate: (id: number, day_name: string) => void;
  onSelect?: (day: WorkoutDay) => void;
  isSelected?: boolean;
  isCreating?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
}
export default function WorkoutDayComponent({
  day,
  onSave,
  onDelete,
  onUpdate,
  onSelect,
  isSelected,
  isCreating,
  isDeleting,
  isUpdating,
}: WorkoutDayProps) {
  const [edit, setEdit] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(day.day_name || "");
  const [name, setName] = useState<string>(day.day_name || "");

  useEffect(() => {
    setEditName(day.day_name || "");
    setName(day.day_name || "");
  }, [day]);

  const setRef = (node: HTMLInputElement | null) => {
    if (node) {
      if (isFocused) {
        node.focus();
      }
    }
  };

  const isLoading = isCreating || isUpdating || isDeleting;

  if (edit) {
    return (
      <div
        className={cn(
          "border border-black/25 rounded-lg p-2",
          isFocused &&
            "outline-none ring-2 ring-primary ring-offset-2 ring-offset-[#EEE]"
        )}
      >
        <div className="flex justify-between items-center relative space-x-1">
          <div className="flex gap-1 w-4/5">
            <span className="max-w-[30%] text-sm truncate">
              Day {day.day}:{" "}
            </span>
            <input
              ref={setRef}
              id="search"
              placeholder="Enter day name"
              maxLength={41}
              onChange={(event) => setEditName(event.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="bg-transparent text-sm outline-none max-w-[70%]"
              value={editName}
            />
          </div>
          <div className="flex gap-x-1 align-center">
            <Button
              onClick={() => {
                setEdit(false);
                setIsFocused(false);
                return day.id ? onUpdate(day.id, editName) : onSave(editName);
              }}
              className="h-auto p-0"
              variant="ghost"
            >
              {isCreating || isUpdating ? (
                <></>
              ) : (
                <i className="fa-regular fa-floppy-disk h-4 w-4"></i>
              )}
            </Button>
            <Button
              onClick={() => {
                setEdit(false);
                setIsFocused(false);
                setEditName(name);
              }}
              className="h-auto p-0"
              variant="ghost"
            >
              <i className="fa-solid fa-x h-4 w-4"></i>
            </Button>
          </div>
        </div>
        {editName.length >= 40 && (
          <span className="text-destructive font-poppins block !mt-[5px] text-xs">
            Day name cannot exceed 40 characters
          </span>
        )}
      </div>
    );
  }
  return day.id ? (
    <div
      className={cn(
        "border border-black/25 rounded-lg p-2 cursor-pointer transition-all duration-200",
        isSelected && "bg-blue-100 ring-2 ring-primary ring-offset-2",
        isFocused &&
          "outline-none ring-2 ring-primary ring-offset-2 ring-offset-[#EEE]"
      )}
      onClick={() => onSelect && onSelect(day)}
    >
      <div className="flex justify-between items-center relative space-x-1">
        <div className="flex gap-1 w-4/5">
          <span className="max-w-[30%] text-sm truncate">Day {day.day}: </span>
          <span className="max-w-[70%] text-sm ">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="max-w-[100%] truncate">
                  {editName ?? day.day_name}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{editName ?? day.day_name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
        </div>
        <div className="flex gap-x-1 align-center">
          <Button
            onClick={(e) => {
              setEdit(true);
              setIsFocused(true);
              e.stopPropagation();
              // clicking(isCreatingId?.day);
            }}
            className="h-auto p-0"
            variant="ghost"
          >
            {isUpdating ? (
              <>
                <button
                  className="bg-transparent outline-none flex flex-row text-sm text-gray-500"
                  disabled
                >
                  <svg
                    className="animate-spin h-5 w-5 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                </button>
              </>
            ) : (
              <Pencil className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              if (day.id && onDelete) {
                onDelete(day.id); // Pass the day.id to the delete function
              }
            }}
            className="h-auto p-0"
            variant="ghost"
          >
            {isDeleting ? (
              <button
                className="bg-transparent outline-none flex flex-row text-sm text-gray-500"
                disabled
              >
                <svg
                  className="animate-spin h-5 w-5 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              </button>
            ) : (
              <i className="fa-solid fa-trash h-4 w-4"></i>
            )}
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <div
      className={cn(
        "flex justify-center border-dashed  border-2 border-black/25 rounded-lg p-2",
        isSelected && "bg-blue-100 ring-2 ring-primary ring-offset-2",
        isFocused &&
          "outline-none ring-2 ring-primary ring-offset-2 ring-offset-[#EEE]"
      )}
      onClick={() => onSelect && onSelect(day)}
    >
      <Button
        onClick={() => {
          setEdit(true);
          setIsFocused(true);
        }}
        className="font-normal h-auto p-0 hover:bg-transparent"
        variant="ghost"
      >
        {isCreating ? (
          <>
            <button
              className="bg-transparent outline-none flex flex-row text-sm text-gray-500"
              disabled
            >
              <svg
                className="animate-spin h-5 w-5 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Adding workout day
            </button>
          </>
        ) : (
          <>
            <i className="text-gray-500">
              <i className="fa fa-plus text-primary mr-2"></i>
              Add workout day.
            </i>
          </>
        )}
      </Button>
    </div>
  );
}
