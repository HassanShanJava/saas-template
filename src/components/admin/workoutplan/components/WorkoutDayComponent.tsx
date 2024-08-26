import { Button } from "@/components/ui/button";
import { FloatingLabel, FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
	onDelete?: () => void;
	onUpdate: (id: number, day_name: string) => void;
}
export default function WorkoutDayComponent({day, onSave, onDelete, onUpdate}: WorkoutDayProps) {
	const [edit, setEdit] = useState<boolean>(false);
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const [editName, setEditName] = useState<string>(day.day_name||'');
	const [name, setName] = useState<string>(day.day_name||'');

	useEffect(() => {setEditName(day.day_name||'');setName(day.day_name||'')}, [day]);

  const setRef = (node: HTMLInputElement | null) => {
    if (node) {
      if (isFocused) {
        node.focus();
      }
    }
  };

	if (edit) {
		return (
		<div className={cn("border border-black/25 rounded-lg p-2",
			isFocused && "outline-none ring-2 ring-primary ring-offset-2 ring-offset-[#EEE]")}>
			<div className="flex justify-between items-center relative space-x-1">
				<div className="flex gap-1 w-4/5">
					<span className="max-w-[30%] text-sm truncate">Day {day.day}: </span>
						<input
							ref={setRef}
							id="search"
							placeholder="Enter day name"
							onChange={(event) => setEditName(event.target.value)}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							className="bg-transparent text-sm outline-none max-w-[70%]"
							value={editName}
						/>
				</div>
				<div className="flex gap-x-1 align-center">
					<Button
						onClick={()=> {setEdit(false);setIsFocused(false);return day.id ? onUpdate(day.id,editName) : onSave(editName)}}
						className="h-auto p-0" variant="ghost"
						>
						<i className="fa-regular fa-floppy-disk h-4 w-4"></i>
					</Button>
					<Button 
						onClick={() => {setEdit(false);setIsFocused(false);setEditName(name)}}
						className="h-auto p-0" variant="ghost"
					>
						<i className="fa-solid fa-x h-4 w-4"></i>
					</Button>
				</div>
			</div>
		</div>
		);
	}
	return (
		day.id ?
		<div className={cn("border border-black/25 rounded-lg p-2",
			isFocused && "outline-none ring-2 ring-primary ring-offset-2 ring-offset-[#EEE]")}>
			<div className="flex justify-between items-center relative space-x-1">
				<div className="flex gap-1 w-4/5">
					<span className="max-w-[30%] text-sm truncate">Day {day.day}: </span>
						<span className="max-w-[70%] text-sm truncate">{editName ?? day.day_name}</span>
				</div>
				<div className="flex gap-x-1 align-center">
					<Button 
						onClick={() => {setEdit(true);setIsFocused(true)}} 
						className="h-auto p-0" variant="ghost"
					>
						<Pencil className="h-4 w-4" />
					</Button>
					<Button 
						onClick={onDelete}
						className="h-auto p-0" variant="ghost"
					>
						<i className="fa-regular fa-trash-can h-4 w-4"></i>
					</Button>
				</div>
			</div>
		</div> 
		: <div className={cn("flex justify-center border-dashed border border-2 border-black/25 rounded-lg p-2",
			isFocused && "outline-none ring-2 ring-primary ring-offset-2 ring-offset-[#EEE]")}>
				<Button 
					onClick={() => {setEdit(true);setIsFocused(true)}}
					className="font-normal h-auto p-0 hover:bg-transparent" variant="ghost"
				>
					<i className="text-gray-500">
					<i className="fa fa-plus text-primary mr-2"></i>
					Add workout. 
					</i>
				</Button>
		</div>
	);
}
