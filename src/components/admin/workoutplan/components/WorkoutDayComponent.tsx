import { Button } from "@/components/ui/button";
import { FloatingLabel, FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { useState } from "react";

export interface WorkoutDay {
	id: number;
	week: number;
	day: number;
	day_name: string;
}
export interface WorkoutDayOptional {
	id?: number;
	week?: number;
	day?: number;
	day_name?: string;
}
interface WorkoutDayProps {
	day: WorkoutDay;
	dayNo: number;
	add: ((week: number) => void) | null;
	onDelete: (id: number) => void;
	onUpdate: (id: number, updatedDay: WorkoutDayOptional) => void;
}
export default function WorkoutDayComponent({day, dayNo, add, onDelete, onUpdate}: WorkoutDayProps) {
	const [edit, setEdit] = useState<boolean>(false);
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const [name, setName] = useState<string>(day.day_name);
	return (
		<div className={cn("border border-black/25 rounded-lg p-2",isFocused && "outline-none ring-2 ring-primary ring-offset-2 ring-offset-[#EEE]")}>
			<div className="flex justify-between items-center relative space-x-1">
				<div className="flex gap-1 w-4/5">
					<span className="max-w-[30%] text-sm truncate">Day {day.day}: </span>
					{!edit ? 
						<span className="max-w-[70%] text-sm truncate">{name}</span>
						:
						<input
							id="search"
							placeholder="Enter day name"
							onChange={(event) => {onUpdate(day.id, {day_name: event.target.value});setName(event.target.value)}}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							className="bg-transparent text-sm outline-none max-w-[70%]"
							value={name}
						/>
					}
				</div>
				<div className="flex gap-x-1 align-center">
					{edit ? 
						<Button
							onClick={()=> {setEdit(false);setIsFocused(false)}}
							className="h-auto p-0" variant="ghost"
							>
							<i className="fa-regular fa-floppy-disk"></i>
						</Button> :
						<Button 
							onClick={() => {setEdit(true);setIsFocused(true)}} 
							className="h-auto p-0" variant="ghost"
						>
							<Pencil className="h-4 w-4" />
						</Button>
					}
					<Button 
						onClick={() => onDelete(day.id)}
						className="h-auto p-0" variant="ghost"
					>
						<i className="fa-regular fa-trash-can"></i>
					</Button>
					{add && <Button 
						onClick={() => add(day.week)}
						className="h-auto p-0" variant="ghost"
					>
						<i className="fa fa-plus"></i>
					</Button>}
				</div>
			</div>
		</div>
	);
}
