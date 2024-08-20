import { Workout } from "@/app/types";
import { useFormContext } from "react-hook-form";
import WorkoutDay from "../components/WorkoutDay";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";

const WorkoutStep2: React.FC = () => {
	const {getValues} = useFormContext<Workout>();
	return (
		<div className="mt-4 space-y-4 mb-20">
			<p className="text-black/80 text-[1.37em] font-bold">
				{" "}
				Training & Exercise Details
			</p>
			<div className="w-full flex gap-5">
				<div className="flex-1 h-[26rem] bg-[#EEE] rounded-xl p-3 space-y-3">
					<div className="flex justify-between">
						<span className="font-semibold">Week 1</span>
						<span><i className="fa fa-plus"></i></span>
					</div>
					<span className="text-sm">Days</span>
					<WorkoutDay />
				</div>
				<div className="flex-1 h-[26rem] bg-[#EEE] rounded-xl p-3">
					<div className="flex justify-between">
						<span className="font-semibold">Exercise</span>
					</div>
					<span className="text-sm">Filter Exercises</span>
				</div>
				<div className="flex-1 h-[26rem] bg-[#EEE] rounded-xl p-3"></div>
			</div>
		</div>
	);
}
export default WorkoutStep2;
