import { Card } from "@/components/ui/card";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";

import { RootState } from "@/app/store";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { useNavigate } from "react-router-dom";

import { useParams } from "react-router-dom";

const ExerciseForm = () => {
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
    register,
    trigger,
    watch,
  } = useForm({
    mode: "onChange",
  });
  return (
    <div className="p-6">
      <Card className="size-full rounded-lg  ">
        <h1 className="font-semibold text-[#2D374] text-xl">
          Basic Information
        </h1>

        <div className="grid grid-cols-3 gap-3 w-full h-full">
          <FloatingLabelInput
            id="exercise_name"
            label="Exercise Name*"
            // {...register("exercise_name", { required: "Name is Required" })}
          />
          
          <FloatingLabelInput
            id="video_male"
            label="Vidoe Male*"
            // {...register("video_male", { required: "Name is Required" })}
          />
          <FloatingLabelInput
            id="video_female"
            label="Video Female*"
            // {...register("video_female", { required: "Name is Required" })}
          />
          {/* <FloatingLabelInput
            id="youtube_male"
            label="Youtube Male"                                                                                                                                                                                                                                                                                                          male*"
            // {...register("youtube_male", { required: "Name is Required" })}
          />
          <FloatingLabelInput
            id="youtube_male"
            label="Youtube Male"                                                                                                                                                                                                                                                                                                          male*"
            // {...register("youtube_female", { required: "Name is Required" })}
          /> */}

        </div>
      </Card>
    </div>
  );
};

export default ExerciseForm;
