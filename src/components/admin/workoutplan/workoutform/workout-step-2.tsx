import {
  ExerciseResponseServerViewType,
  ExerciseTypeEnum,
  IntensityEnum,
  Workout,
  WorkoutIntensityEnum,
  createExerciseInputTypes,
  difficultyEnum,
  getWorkoutdayExerciseResponse,
} from "@/app/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import {
  FloatingInput,
  FloatingLabelInput,
} from "@/components/ui/floatinglable/floating";
import {
  createdByOptions,
  difficultyOptions,
  workout_day_data,
} from "@/lib/constants/workout";

import { useGetAllWorkoutDayQuery } from "@/constants/workout/index";
import React, { useEffect, useState } from "react";
import WorkoutDayComponent, {
  WorkoutDay,
  WorkoutDayOptional,
} from "../components/WorkoutDayComponent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  useGetAllCategoryQuery,
  useGetAllEquipmentsQuery,
  useGetAllExercisesQuery,
  useGetAllJointsQuery,
  useGetAllMetQuery,
  useGetAllMuscleQuery,
} from "@/services/exerciseApi";
import { MultiSelect } from "@/components/ui/multiselect/multiselectCheckbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExerciseItem, exerciseTypeOptions } from "@/constants/exercise";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import WorkoutDayExerciseComponent, {
  Exercise,
} from "../components/WorkoutDayExerciseComponent";
import { Label } from "@/components/ui/label";
import expandTop from "@/assets/expand-top.svg";
import filterRemove from "@/assets/filter-remove.svg";
import { useOutletContext, useParams } from "react-router-dom";
import { ContextProps } from "./workout-form";
import { useSelector } from "react-redux";
import { Spinner } from "@/components/ui/spinner/spinner";
import { RootState } from "@/app/store";
const { VITE_VIEW_S3_URL } = import.meta.env;

interface SelectedDay {
  id?: number;
  week: number;
  day: number;
  day_name?: string;
}

import {
  useAddWorkoutDayMutation,
  useDeleteWorkoutDayMutation,
  useGetAllExerciseForWorkoutQuery,
  useUpdateWorkoutDayMutation,
  useAddExerciseInWorkoutMutation,
  useGetExerciseByWorkoutDayIdQuery,
  useDeleteExerciseInWorkoutdayMutation,
  useUpdateExerciseInWorkoutMutation,
} from "@/services/workoutService";
import { useDebounce } from "@/hooks/use-debounce";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";

export interface WorkoutWeek {
  week: number;
  days: WorkoutDay[];
}
interface LoadingState {
  isAdding: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  currentAddingDay: number | null;
  currentUpdatingDay: number | null;
  currentDeletingDay: number | null;
}
export interface ExerciseForm {
  exercise_type: string;
  seconds_per_set: number[];
  rest_between_set: number[];
  repetitions_per_set: number[];
  speed: number | null;
  distance: number | null;
  met_id: number | null;
  exercise_intensity: IntensityEnum | null;
  intensity_value: number | null;
  gif_url?: string;
  notes: string;
}

interface ExerciseFilter {
  primary_muscle?: number[];
  category?: number;
  difficulty?: difficultyEnum;
  equipments?: number[];
  primary_joints?: number[];
  search_key?: string;
}

const WorkoutStep2: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<SelectedDay | null>(null);
  const {
    data: exercises,
    isLoading: exerciseLoadingforday,
    refetch: refetchDayExercise,
  } = useGetExerciseByWorkoutDayIdQuery(selectedDay?.id ?? 0);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isAdding: false,
    isUpdating: false,
    isDeleting: false,
    currentAddingDay: null,
    currentUpdatingDay: null,
    currentDeletingDay: null,
  });
  const { workoutId } = useParams<{ workoutId: string }>(); // Extract workoutId
  const { form: form1 } = useOutletContext<ContextProps>();
  const noOfWeeks = form1.getValues("weeks");
  const [days, setDays] = useState(() =>
    [...Array(noOfWeeks * 7).keys()].map((_, i) => ({
      week: Math.floor(i / 7) + 1,
      day: (i % 7) + 1,
    }))
  );
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [query, setQuery] = useState<string>("");
  const [exerciseFilterOpen, setExerciseFilterOpen] = useState<boolean>(true);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>();
  const [currExercise, setCurrExercise] = useState<Exercise | null>(null);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [filterData, setFilter] = useState<ExerciseFilter>({});
  const [uid, setUid] = useState<number>(1e4);

  const { data: WorkoutDays } = useGetAllWorkoutDayQuery(workoutId as string);
  const { data: CategoryData } = useGetAllCategoryQuery();
  const { data: EquipmentData } = useGetAllEquipmentsQuery();
  const { data: MuscleData } = useGetAllMuscleQuery();
  const { data: JointsData } = useGetAllJointsQuery();
  const { data: MetsData } = useGetAllMetQuery();
  const { data: Exercises, isLoading: isWorkoutQueryLoading } =
    useGetAllExerciseForWorkoutQuery({
      org_id: orgId,
      query: query,
    });

  const [addWorkoutDay, { isLoading: addDayLoading, isError: addDayError }] =
    useAddWorkoutDayMutation();
  const [
    updateWorkoutDay,
    { isLoading: updateDayLoading, isError: updateDayError },
  ] = useUpdateWorkoutDayMutation();
  const [
    deleteWorkoutDay,
    { isLoading: deleteDayLoading, isError: deleteDayError },
  ] = useDeleteWorkoutDayMutation();

  const [
    addExerciseInWorkout,
    { isLoading: addExerciseLoading, isError: addExerciseError },
  ] = useAddExerciseInWorkoutMutation();
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [deleteExercise, { isLoading: deleteExerciseLoading }] =
    useDeleteExerciseInWorkoutdayMutation();
  const [updateExercise, { isLoading: updateExerciseLoading }] =
    useUpdateExerciseInWorkoutMutation();

  useEffect(() => {
    if (WorkoutDays) {
      console.log("eGetAllWorkoutDayQueryetsData:", WorkoutDays);
      WorkoutDays.map((dbDay) => {
        const idx = (dbDay.week - 1) * 7 + (dbDay.day - 1);
        setDays((days) =>
          days.map((day, i) => (i == idx ? { ...day, ...dbDay } : day))
        );
      });
    }
  }, [WorkoutDays]);

  useEffect(() => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filterData)) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((val) => {
            params.append(key, val);
          });
        } else {
          params.append(key, value);
        }
      }
    }
    if (debouncedSearchTerm) {
      params.append("search_key", debouncedSearchTerm);
    }
    const newQuery = params.toString();
    setQuery(newQuery);
  }, [filterData, debouncedSearchTerm]);

  console.log("Workout id", workoutId);
  const Exercise_info: ExerciseItem[] = [
    {
      type: "multiselect",
      name: "primary_muscle",
      label: "Primary Muscle*",
      required: true,
      options: MuscleData,
    },
    {
      type: "multiselect",
      name: "category",
      label: "Category",
      required: true,
      options: CategoryData,
    },
    {
      type: "select",
      name: "difficulty",
      label: "Difficulty",
      required: true,
      options: difficultyOptions,
    },
    {
      type: "multiselect",
      name: "equipments",
      label: "Equipments*",
      required: true,
      options: EquipmentData,
    },
    {
      type: "multiselect",
      name: "primary_joints",
      label: "Primary Joints*",
      required: true,
      options: JointsData,
    },
  ];

  const form = useForm<ExerciseForm>({
    defaultValues: currExercise as ExerciseForm,
    mode: "all",
  });
  const {
    register,
    control,
    formState: { errors, isDirty },
    watch,
    handleSubmit,
  } = form;
  const formValues = watch();

  function handleAddDay(idx: number, day_name: string) {
    if (day_name.length === 0) {
      toast({
        variant: "destructive",
        description: "Cannot Add day without a name.",
      });
      return;
    }
    setLoadingState((prevState) => ({
      ...prevState,
      isAdding: true,
      currentAddingDay: idx,
    }));
    const newDay = {
      day_name: day_name,
      week: Math.floor(idx / 7) + 1,
      day: (idx % 7) + 1,
      workout_id: Number(workoutId) || 0,
    };
    console.log("onSave", day_name, newDay);

    addWorkoutDay(newDay)
      .unwrap()
      .then(() => {
        setDays((days) =>
          days.map((day, i) =>
            i === idx ? { ...day, day_name: day_name, id: uid } : day
          )
        );
        setUid((uid) => uid + 1);
        toast({
          variant: "success",
          description: "Workout Day Added",
        });
        setLoadingState((prevState) => ({
          ...prevState,
          isAdding: false,
          currentAddingDay: null,
        }));
      })
      .catch((error) => {
        console.error("Failed to add workout day:", error);
        toast({
          variant: "destructive",
          description: "Failed to Add Workout Day",
        });
      })
      .finally(() => {
        setLoadingState((prevState) => ({
          ...prevState,
          isAdding: false,
          currentAddingDay: null,
        }));
      });
  }

  function handleDelete(idx: number, id: number) {
    setLoadingState((prevState) => ({
      ...prevState,
      isDeleting: true,
      currentDeletingDay: idx,
    }));

    if (!id) {
      return;
    }
    deleteWorkoutDay(Number(id))
      .unwrap()
      .then(() => {
        setDays((days) =>
          days.map((day, i) =>
            i === idx ? { week: Math.floor(i / 7) + 1, day: (i % 7) + 1 } : day
          )
        );
        toast({
          variant: "success",
          description: "Workout Day Deleted",
        });
        setLoadingState((prevState) => ({
          ...prevState,
          isDeleting: false,
          currentDeletingDay: null,
        }));
      })
      .catch(() => {
        toast({
          variant: "destructive",
          description: "Failed to delete the day",
        });
      })
      .finally(() => {
        setLoadingState((prevState) => ({
          ...prevState,
          isDeleting: false,
          currentDeletingDay: null,
        }));
      });
  }

  function handleUpdate(idx: number, id: number, day_name: string) {
    if (day_name.length === 0) {
      toast({
        variant: "destructive",
        description: "Cannot Update day without a name.",
      });
      return;
    }
    setLoadingState((prevState) => ({
      ...prevState,
      isUpdating: true,
      currentUpdatingDay: idx,
    }));

    const updatedDay = {
      id: id,
      day_name: day_name,
      week: Math.floor(idx / 7) + 1,
      day: (idx % 7) + 1,
      workout_id: Number(workoutId) || 0,
    };

    updateWorkoutDay(updatedDay)
      .unwrap()
      .then(() => {
        setDays((days) =>
          days.map((day, i) =>
            i === idx ? { ...day, day_name: day_name } : day
          )
        );
        toast({
          variant: "success",
          description: "Workout Day Updated",
        });
        setLoadingState((prevState) => ({
          ...prevState,
          isUpdating: false,
          currentUpdatingDay: null,
        }));
      })
      .catch((error) => {
        console.error("Failed to update workout day:", error);
        toast({
          variant: "destructive",
          description: "Failed to update Workout Day",
        });
      })
      .finally(() => {
        setLoadingState((prevState) => ({
          ...prevState,
          isUpdating: false,
          currentUpdatingDay: null,
        }));
      });
  }

  const handleExerciseDuplicate = async (exercise: Exercise, index: number) => {
    try {
      console.log("exercise", exercise);
      setIsAddingExercise(true);

      const response = await addExerciseInWorkout({
        ...exercise,
        exercise_type: exercise.exercise_type || ExerciseTypeEnum.time_based,
      }).unwrap();
      if (response) {
        toast({
          variant: "success",
          title: "Exercise duplicated",
          description: "The exercise has been successfully duplicated.",
        });
      }
    } catch (error) {
      console.error("Failed to duplicate exercise:", error);
      toast({
        variant: "destructive",
        title: "Duplication failed",
        description: "There was an error duplicating the exercise.",
      });
    } finally {
      setIsAddingExercise(false);
      refetchDayExercise();
    }
  };

  function handleExerciseAdd(exercise: Exercise) {
    if (!selectedDay?.id) {
      toast({
        variant: "destructive",
        description: "Please select a day before adding an exercise.",
      });
      return;
    }
    console.log("exercise", exercise);
    setIsAddingExercise(true);

    const exerciseData = {
      exercise_id: exercise.id,
      workout_day_id: selectedDay?.id,
      exercise_type: exercise.exercise_type,
      sets: exercise.sets,
      seconds_per_set: exercise.seconds_per_set,
      repetitions_per_set: exercise.repetitions_per_set,
      rest_between_set: exercise.rest_between_set,
      exercise_intensity:
        exercise.exercise_intensity ?? IntensityEnum.max_intensity,
      intensity_value: exercise.intensity_value ?? null,
      notes: "",
      distance: exercise.distance,
      speed: exercise.speed,
      met_id: exercise.met_id,
    };

    addExerciseInWorkout({
      ...exerciseData,
      exercise_type: exerciseData.exercise_type ?? ExerciseTypeEnum.time_based,
    })
      .unwrap()
      .then((response: getWorkoutdayExerciseResponse) => {
        const newExercise: Exercise = {
          ...response,
          intensity_value: response.intensity_value ?? null,
          exercise_type: response.exercise_type || ExerciseTypeEnum.time_based, // Provide a default value
        };
        toast({
          variant: "success",
          description: "Exercise added successfully.",
        });
      })
      .catch((error) => {
        console.error("Failed to add exercise:", error);
        toast({
          variant: "destructive",
          description: "Failed to add exercise. Please try again.",
        });
      })
      .finally(() => {
        setIsAddingExercise(false);
        refetchDayExercise();
      });
  }

  function handleFilterChange(field: string, value: any) {
    setFilter((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleDaySelect(day: WorkoutDay) {
    if (day.id) {
      setSelectedDay((prevDay) => (prevDay?.id === day.id ? null : day));
    }
  }

  function onSubmit(data: Exercise) {
    const processedExercise = processExercise(data);
    // Your submit logic here, using processedExercise
    console.log(processedExercise);
  }
  const secondsPerSet = useWatch({
    control: form.control,
    name: "seconds_per_set",
  });
  const isOnlyOneSet = secondsPerSet?.length === 1;
  function processExercise(dataexercise: Exercise) {
    console.log("dataexercise", dataexercise);
    // Remove unwanted properties
    const { ...cleanedExercise } = dataexercise;

    // Convert distance and speed to numbers, default to 0 if not present
    cleanedExercise.distance = parseFloat(String(dataexercise.distance)) || 0;
    cleanedExercise.speed = parseFloat(String(dataexercise.speed)) || 0;

    // Process based on exercise_type
    if (dataexercise.exercise_type === ExerciseTypeEnum.repetition_based) {
      cleanedExercise.rest_between_set =
        dataexercise.rest_between_set?.map(Number);
      cleanedExercise.repetitions_per_set =
        dataexercise.repetitions_per_set?.map(Number);
      cleanedExercise.seconds_per_set = [];
      cleanedExercise.met_id = null;
      cleanedExercise.speed = 0;
      cleanedExercise.distance = 0;
    } else if (dataexercise.exercise_type === ExerciseTypeEnum.time_based) {
      cleanedExercise.repetitions_per_set = [];
      cleanedExercise.rest_between_set =
        dataexercise.rest_between_set?.map(Number);
      cleanedExercise.seconds_per_set =
        dataexercise.seconds_per_set?.map(Number);
      cleanedExercise.exercise_intensity = IntensityEnum.max_intensity;
      cleanedExercise.intensity_value = 0;
    }
    if (cleanedExercise.exercise_intensity === IntensityEnum.max_intensity) {
      cleanedExercise.intensity_value = 0;
    }
    // Return the modified object with only the required fields
    console.log({
      id: cleanedExercise.id || 0,
      exercise_type: cleanedExercise.exercise_type || "Time Based",
      sets: cleanedExercise.sets || 0,
      seconds_per_set: cleanedExercise.seconds_per_set || [0],
      repetitions_per_set: cleanedExercise.repetitions_per_set || [0],
      rest_between_set: cleanedExercise.rest_between_set || [0],
      exercise_intensity: cleanedExercise.exercise_intensity || "irm",
      intensity_value: cleanedExercise.intensity_value || 0,
      notes: cleanedExercise.notes || "",
      exercise_id: cleanedExercise.exercise_id || 0,
    });

    const exerciseDatapayloadupdate = {
      id: cleanedExercise.id || 0,
      exercise_type:
        cleanedExercise.exercise_type || ExerciseTypeEnum.time_based,
      seconds_per_set: cleanedExercise.seconds_per_set || [0],
      repetitions_per_set: cleanedExercise.repetitions_per_set || [0],
      rest_between_set: cleanedExercise.rest_between_set || [0],
      exercise_intensity:
        cleanedExercise.exercise_intensity || IntensityEnum.max_intensity,
      intensity_value: cleanedExercise.intensity_value || 0,
      notes: cleanedExercise.notes || "",
      exercise_id: cleanedExercise.exercise_id || 0,
      sets: cleanedExercise.rest_between_set?.length ?? 0,
      distance: cleanedExercise.distance,
      speed: cleanedExercise.speed,
      met_id: cleanedExercise.met_id,
    };

    console.log("Exercise api", exerciseDatapayloadupdate);
    updateExercise(exerciseDatapayloadupdate)
      .unwrap()
      .then((response) => {
        toast({
          variant: "success",
          description: "Exercise Updated successfully.",
        });
      })
      .catch((error) => {
        console.error("Failed to update exercise:", error);
        toast({
          variant: "destructive",
          description: "Failed to update exercise. Please try again.",
        });
      })
      .finally(() => {
        setCurrExercise(null);
        setSelectedExerciseIndex(undefined);
        refetchDayExercise();
      });
  }
  const watcher = watch();
  console.log(
    "form values check log",
    formValues?.seconds_per_set?.length <= 1,
    formValues.seconds_per_set,
    watcher
  );
  return (
    <div className="mt-4 space-y-4 mb-20">
      <p className="text-black/80 text-[1.37em] font-bold">
        {" "}
        Training & Exercise Details
      </p>
      <div className="w-full flex gap-5">
        <div className="w-[35%] h-[32rem] bg-[#EEE] rounded-xl space-y-2 custom-scrollbar overflow-hidden">
          {!showSearchResults ? (
            <div className="p-3">
              {[...Array(noOfWeeks).keys()].map((week: any, i: number) => (
                <Accordion type="single" defaultValue="item-1" collapsible>
                  <AccordionItem value="item-1" className="!border-none">
                    <AccordionTrigger className="h-0 !no-underline !bg-transparent">
                      <span className="font-semibold flex gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help">
                                <i className="fa-solid fa-circle-info text-gray-500"></i>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>To add more weeks, go to the previous step.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        Week {i + 1}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <span className="text-sm">Days</span>
                      {[...Array(7).keys()].map((_, j: number) => {
                        const index = i * 7 + j; // Calculate the index for the current day

                        const isCreating =
                          loadingState.isAdding &&
                          loadingState.currentAddingDay === index;
                        const isUpdating =
                          loadingState.isUpdating &&
                          loadingState.currentUpdatingDay === index;
                        const isDeleting =
                          loadingState.isDeleting &&
                          loadingState.currentDeletingDay === index;

                        return (
                          <div className="space-y-2 px-1">
                            <WorkoutDayComponent
                              key={i * 7 + j}
                              day={days[i * 7 + j]}
                              onSave={(day_name) =>
                                handleAddDay(i * 7 + j, day_name)
                              }
                              onDelete={(id) => handleDelete(i * 7 + j, id)}
                              onUpdate={(id, day_name) =>
                                handleUpdate(i * 7 + j, id, day_name)
                              }
                              onSelect={(day) => handleDaySelect(day)}
                              isSelected={
                                selectedDay?.week === days[i * 7 + j].week &&
                                selectedDay?.day === days[i * 7 + j].day
                              }
                              isCreating={isCreating}
                              isUpdating={isUpdating}
                              isDeleting={isDeleting}
                            />
                          </div>
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          ) : (
            <>
              <div className="sticky z-30 top-0 p-3 bg-[#EEE] space-y-2 custom-scrollbar">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Search Exercise</span>
                  <Button
                    onClick={() => setShowSearchResults(false)}
                    variant="ghost"
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    <i className="fa-regular fa-x font-semibold text-sm"></i>
                  </Button>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Filters</span>
                  <Button
                    onClick={() => setExerciseFilterOpen((prev) => !prev)}
                    variant="ghost"
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    <img
                      src={expandTop}
                      className={cn(
                        "w-5 h-5 transition-transform duration-200",
                        !exerciseFilterOpen && "rotate-180"
                      )}
                      alt="show/hide"
                    />
                  </Button>
                </div>
                {exerciseFilterOpen && (
                  <div className="grid grid-cols-2 gap-2">
                    {Exercise_info.map((element) => {
                      if (element.type == "select") {
                        return (
                          <Select
                            key={element.label}
                            name={element.label}
                            value={(() => {
                              return filterData[element.name as "category"]
                                ? String(filterData[element.name as "category"])
                                : "";
                            })()}
                            onValueChange={(value) => {
                              handleFilterChange(element.name, value);
                            }}
                          >
                            <SelectTrigger className="[&_span]:text-xs border border-black/25">
                              <SelectValue
                                placeholder={element.label
                                  .replace(/_/g, " ") // Replace underscores with spaces
                                  .toLowerCase() // Convert to lowercase
                                  .replace(/(?:^|\s)\S/g, (match: string) =>
                                    match.toUpperCase()
                                  )}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {element.options?.map(
                                (st: any, index: number) => (
                                  <SelectItem
                                    key={index}
                                    value={String(st.value)}
                                  >
                                    {st.label}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        );
                      }

                      if (element.type === "multiselect") {
                        return (
                          <MultiSelect
                            key={element.label}
                            options={element.options ?? []}
                            dotruncate={true}
                            defaultValue={(() => {
                              return (
                                filterData[
                                  element.name as
                                    | "primary_muscle"
                                    | "primary_joints"
                                    | "equipments"
                                ] || []
                              );
                            })()}
                            onValueChange={(selectedValues) => {
                              console.log("Selected Values: ", selectedValues);
                              handleFilterChange(element.name, selectedValues);
                            }}
                            placeholder={element.label.replace(/_/g, " ")}
                            variant="inverted"
                            maxCount={1}
                            className="border border-black/25 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 [&_span]:text-xs [&_span]:mx-0 [&_svg]:mx-0"
                          />
                        );
                      }
                    })}
                  </div>
                )}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <FloatingLabelInput
                      id="search"
                      placeholder="Search by Exercise Name"
                      onChange={(event) => setSearchTerm(event.target.value)}
                      value={searchTerm}
                      className="text-black bg-transparent border border-black/25"
                    />
                  </div>
                  <Button
                    onClick={() => setFilter({})}
                    variant="ghost"
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    <img
                      src={filterRemove}
                      className="w-5 h-5 transition-transform duration-200"
                      alt="show/hide"
                    />
                  </Button>
                </div>
              </div>
              <div className="px-3 pb-6 space-y-3">
                {isWorkoutQueryLoading ? (
                  <Spinner />
                ) : (
                  Exercises?.data.map((e) => {
                    const exercise: ExerciseResponseServerViewType =
                      e as unknown as ExerciseResponseServerViewType;
                    return (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="w-full">
                            <div
                              onClick={() => {
                                handleExerciseAdd(
                                  exercise as unknown as ExerciseResponseServerViewType
                                );
                              }}
                              className="border border-black/25 rounded-lg p-2 hover:border-primary cursor-pointer"
                            >
                              <div className="flex justify-between items-center relative space-x-1 ">
                                <div className="flex gap-3 w-full">
                                  <img
                                    id="avatar"
                                    src={
                                      exercise.gif_url
                                        ? exercise.gif_url.includes(
                                            VITE_VIEW_S3_URL
                                          )
                                          ? exercise.gif_url
                                          : `${VITE_VIEW_S3_URL}/${exercise.gif_url}`
                                        : `${VITE_VIEW_S3_URL}/download.png`
                                    }
                                    alt="Exercise Image"
                                    className="h-[20px] w-12 object-contain relative"
                                  />
                                  <span className="text-sm truncate">
                                    {exercise.exercise_name} -{" "}
                                    {exercise.equipments
                                      .map((e) => e.name)
                                      .join(", ")}
                                  </span>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="cursor-help">
                                          <i className="fa-solid fa-circle-info text-gray-500"></i>
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          click to add exercise in workout day.
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </div>
                            </div>
                          </TooltipTrigger>
                          {/* <TooltipContent>
                            <p>click to add exercise in workout day.</p>
                          </TooltipContent> */}
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })
                  // <></>
                )}
              </div>
            </>
          )}
        </div>
        <div className="w-[30%] h-[32rem] bg-[#EEE] rounded-xl p-3 relative custom-scrollbar">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Exercise</span>
              {selectedDay ? (
                <Button
                  onClick={() => setShowSearchResults(true)}
                  className="font-normal h-auto p-0 hover:bg-transparent gap-2"
                  variant="ghost"
                >
                  <i className="fa fa-plus "></i>
                  Add Exercise
                </Button>
              ) : (
                <></>
              )}
            </div>
            {/* {selectedDay && (
              <div className="text-sm text-gray-600 bg-primary/20 p-2 rounded-md">
                Selected: Week {selectedDay.week}, Day {selectedDay.day} -{" "}
                {selectedDay.day_name && selectedDay.day_name.length > 8 ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {selectedDay.day_name.slice(0, 8) + "..."}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{selectedDay.day_name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  selectedDay.day_name
                )}
              </div>
            )} */}
            <div className="space-y-2">
              {addExerciseLoading && (
                <span className="flex items-center gap-2 justify-center text-sm">
                  <Spinner /> Adding Exercise
                </span>
              )}
              {selectedDay != null && exerciseLoadingforday && (
                <span className="flex items-center gap-2 justify-center text-sm">
                  <Spinner /> Loading Exercises
                </span>
              )}
              {exercises && exercises.length > 0 ? (
                exercises.map((exercise: Exercise, i: number) => (
                  <WorkoutDayExerciseComponent
                    key={i}
                    exercise={exercise}
                    selected={i === selectedExerciseIndex}
                    onDuplicate={() => handleExerciseDuplicate(exercise, i)}
                    onDelete={() => {
                      setCurrExercise(null);
                      setSelectedExerciseIndex(undefined);
                      if (exercise.id !== undefined) {
                        deleteExercise(exercise.id);
                      }
                    }}
                    onClick={() => {
                      setCurrExercise(exercise);
                      form.reset(exercise);
                      setSelectedExerciseIndex(i);
                    }}
                    isDeleteLoading={deleteExerciseLoading}
                  />
                ))
              ) : (
                <div className="text-center text-gray-500 mt-4">
                  {selectedDay
                    ? "No exercise found for this workout day"
                    : "Select a day to add exercises"}
                </div>
              )}{" "}
            </div>
          </div>
        </div>
        <div className="w-[35%] h-[32rem] bg-[#EEE] rounded-xl p-3 space-y-2 custom-scrollbar flex flex-col">
          <FormProvider {...form}>
            <form noValidate className="pb-4 space-y-3" action="#">
              <div className="flex justify-between">
                <span className="font-semibold">Exercise Details</span>
                <div className="flex gap-2">
                  {/* <button
                    className="text-red-500"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrExercise(null);
                      setSelectedExerciseIndex(undefined);
                    }}
                  >
                    <i
                      className={`fa-solid fa-trash-can ${currExercise === null ? "opacity-50 cursor-not-allowed" : ""}`}
                    ></i>
                  </button> */}

                  {
                    <LoadingButton
                      type="submit"
                      onClick={handleSubmit((data: ExerciseForm) =>
                        onSubmit(data as Exercise)
                      )}
                      disabled={selectedExerciseIndex === undefined}
                      className={`h-auto p-1  gap-1 justify-center items-center flex ${selectedExerciseIndex === undefined ? "cursor-not-allowed" : ""}`}
                      variant="ghost"
                      loading={updateExerciseLoading}
                    >
                      <i className={`fa-regular fa-floppy-disk text-lg`}></i>
                    </LoadingButton>
                  }
                </div>
              </div>
              {currExercise !== null ? (
                <>
                  <div className="flex justify-center">
                    <img
                      id="avatar"
                      src={
                        formValues.gif_url
                          ? formValues.gif_url.includes(VITE_VIEW_S3_URL)
                            ? formValues.gif_url
                            : `${VITE_VIEW_S3_URL}/${formValues.gif_url}`
                          : `${VITE_VIEW_S3_URL}/download.png`
                      }
                      alt="Exercise Image"
                      className="w-4/5 object-contain relative h-[130px]"
                    />
                  </div>
                  <div className="relative">
                    <Controller
                      name="exercise_type"
                      rules={{ required: "Required" }}
                      control={control}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <div className="flex justify-center">
                          <RadioGroup
                            onValueChange={(e) => {
                              console.log("exercise_type c", e);
                              onChange(e);
                              setTimeout(
                                () => console.log(form.getValues(), formValues),
                                1000
                              );
                            }}
                            defaultValue={(() => {
                              console.log(
                                "exercise_type v",
                                value != null ? String(value) : undefined
                              );
                              return value != null ? String(value) : undefined;
                            })()}
                            value={(() => {
                              console.log(
                                "exercise_type v",
                                value != null ? String(value) : undefined
                              );
                              return value != null ? String(value) : undefined;
                            })()}
                            className="flex flex-row space-x-4"
                          >
                            {exerciseTypeOptions?.map(
                              (option: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex justify-start items-center space-x-3"
                                >
                                  <RadioGroupItem
                                    id={option.value}
                                    value={String(option.value)}
                                  />
                                  <Label htmlFor={option.value}>
                                    {option.label}
                                  </Label>
                                </div>
                              )
                            )}
                          </RadioGroup>
                        </div>
                      )}
                    />
                    {errors["exercise_type"]?.message && (
                      <span className="text-red-500 text-xs mt-[5px]">
                        {errors["exercise_type"]?.message}
                      </span>
                    )}
                  </div>
                  <div className="gap-2 grid grid-cols-[repeat(20,1fr)] items-center">
                    <span className="col-span-9">
                      {formValues.exercise_type === "Time Based"
                        ? "Time(s)"
                        : "Rep(x)"}
                    </span>
                    <span className="col-span-9">Rest(s)</span>
                  </div>
                  <div className="gap-2 grid grid-cols-[repeat(20,1fr)] items-center">
                    {[
                      ...Array(
                        Math.max(
                          formValues.repetitions_per_set.length,
                          formValues.seconds_per_set.length,
                          formValues.rest_between_set.length
                        )
                      ).keys(),
                    ].map((_, i) => {
                      console.log("Map ran again");
                      return (
                        <React.Fragment key={i}>
                          {formValues.exercise_type === "Time Based" ? (
                            <div className="col-span-9">
                              <FloatingLabelInput
                                value={
                                  formValues.seconds_per_set[i] === undefined
                                    ? 0
                                    : formValues.seconds_per_set[i]
                                }
                                type="number"
                                {...register(`seconds_per_set.${i}`, {
                                  required: "Required",
                                  max: {
                                    value: 3600,
                                    message:
                                      "The accepted values are between 10 to 3600",
                                  },
                                  min: {
                                    value: 10,
                                    message:
                                      "The accepted values are between 10 to 3600",
                                  },
                                  setValueAs: (v) => {
                                    console.log("distance value", v);
                                    return v;
                                  },
                                  validate: (v) =>
                                    v === null ||
                                    isNaN(v) ||
                                    v >= 0 ||
                                    "Only non negative numbers",
                                })}
                                className={cn(
                                  "bg-transparent border border-black/25",
                                  errors?.seconds_per_set?.[i]
                                    ? "border-red-500"
                                    : ""
                                )}
                                min="10"
                              />
                              {errors?.seconds_per_set?.[i] && (
                                <p className="text-xs leading-snug  pt-3 text-red-500 mr-4">
                                  {errors?.seconds_per_set?.[i]?.message}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="col-span-9">
                              <FloatingLabelInput
                                type="number"
                                value={
                                  formValues.repetitions_per_set[i] ===
                                  undefined
                                    ? 0
                                    : formValues.repetitions_per_set[i]
                                }
                                {...register(`repetitions_per_set.${i}`, {
                                  required: "Required",
                                  max: {
                                    value: 100,
                                    message:
                                      "The accepted values are between 1 to 100",
                                  },
                                  min: {
                                    value: 1,
                                    message:
                                      "The accepted values are between 1 to 100",
                                  },
                                  setValueAs: (v) => {
                                    console.log("distance value", v);
                                    return v;
                                  },
                                  validate: (v) =>
                                    v === null ||
                                    isNaN(v) ||
                                    v >= 0 ||
                                    "Only non negative numbers",
                                })}
                                className={cn(
                                  "bg-transparent border border-black/25",
                                  errors?.repetitions_per_set?.[i]
                                    ? "border-red-500"
                                    : ""
                                )}
                                min="0"
                                max="100"
                              />
                              {errors?.repetitions_per_set?.[i] && (
                                <p className="text-xs leading-snug  pt-3 text-red-500 mr-4">
                                  {errors?.repetitions_per_set?.[i]?.message}
                                </p>
                              )}
                            </div>
                          )}

                          <div className="col-span-9">
                            <FloatingLabelInput
                              type="number"
                              {...register(`rest_between_set.${i}`, {
                                max: {
                                  value: 3600,
                                  message:
                                    "The accepted values are between 0 to 3600",
                                },
                                min: {
                                  value: 0,
                                  message:
                                    "The accepted values are between 0 to 3600",
                                },
                                required: "Required",
                                valueAsNumber: true,
                              })}
                              className={`bg-transparent border border-black/25 ${
                                errors?.rest_between_set?.[i]
                                  ? "border-red-500"
                                  : ""
                              }`}
                              min="0"
                            />
                            {errors?.rest_between_set?.[i] && (
                              <p className="text-xs leading-snug pt-3 text-red-500 mr-4">
                                {errors?.rest_between_set?.[i]?.message}
                              </p>
                            )}
                          </div>

                          <Button
                            type="button"
                            variant={"ghost"}
                            onClick={() => {
                              if (!isOnlyOneSet) {
                                form.setValue(
                                  "seconds_per_set",
                                  formValues.seconds_per_set.filter(
                                    (_, index) => index !== i
                                  )
                                );
                                form.setValue(
                                  "rest_between_set",
                                  formValues.rest_between_set.filter(
                                    (_, index) => index !== i
                                  )
                                );
                                form.setValue(
                                  "repetitions_per_set",
                                  formValues.repetitions_per_set.filter(
                                    (_, index) => index !== i
                                  )
                                );
                              }
                            }}
                            disabled={formValues?.rest_between_set?.length <= 1}
                            className={`text-red-500 hover:text-red-700 ${isOnlyOneSet ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <i className="fa-regular fa-trash-can text-red-500" />
                          </Button>
                        </React.Fragment>
                      );
                    })}
                  </div>
                  <Button
                    variant={"ghost"}
                    type="button"
                    onClick={() => {
                      form.setValue("seconds_per_set", [
                        ...formValues.seconds_per_set,
                        0,
                      ]);
                      form.setValue("rest_between_set", [
                        ...formValues.rest_between_set,
                        0,
                      ]);
                      form.setValue("repetitions_per_set", [
                        ...formValues.repetitions_per_set,
                        0,
                      ]);
                    }}
                    className="gap-2 items-center justify-center px-4 py-2 rounded hover:bg-primary"
                  >
                    <i className="fa-solid fa-plus"></i> Add
                  </Button>
                  {formValues.exercise_type === "Time Based" ? (
                    <div className="grid grid-cols-3 gap-2 ">
                      <div>
                        <Controller
                          name="met_id"
                          // rules={{ required: "Required" }}
                          control={control}
                          render={({
                            field: { onChange, value, onBlur },
                            fieldState: { invalid, error },
                          }) => (
                            <Select
                              onValueChange={(value) => onChange(+value)}
                              defaultValue={value ? String(value) : undefined}
                            >
                              <SelectTrigger
                                className="border border-black/25"
                                floatingLabel="MET"
                                labelClassname="bg-[#EEE]"
                                name="goals"
                              >
                                <SelectValue placeholder="MET" />
                              </SelectTrigger>
                              <SelectContent>
                                {MetsData?.map((st: any, index: number) => (
                                  <SelectItem
                                    key={index}
                                    value={String(st.value)}
                                  >
                                    {st.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.met_id?.message && (
                          <span className="text-red-500 text-xs mt-[5px]">
                            {errors.met_id?.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <FloatingLabelInput
                          {...register("distance", {
                            setValueAs: (v) => {
                              console.log("distance value", v);
                              return v;
                            },
                            validate: (v) =>
                              v === null ||
                              isNaN(v) ||
                              v >= 0 ||
                              "Only non negative numbers",
                          })}
                          type="number"
                          id="distance"
                          label="Distance(KM)"
                          labelClassname="bg-[#EEE] text-xs"
                          className=" border border-black/25 bg-transparent"
                        />
                        {errors.distance?.message && (
                          <span className="text-red-500 text-xs mt-[5px]">
                            {errors.distance?.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <FloatingLabelInput
                          {...register("speed", {
                            setValueAs: (v) => {
                              console.log("speed value", v);
                              return v;
                            },
                            validate: (v) =>
                              v === null ||
                              isNaN(v) ||
                              v >= 0 ||
                              "Only non negative numbers",
                          })}
                          id="speed"
                          type="number"
                          label="Speed(KM/H)"
                          labelClassname="bg-[#EEE] text-xs"
                          className=" border border-black/25 bg-transparent"
                        />
                        {errors.speed?.message && (
                          <span className="text-red-500 text-xs mt-[5px]">
                            {errors.speed?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <Controller
                          name="exercise_intensity"
                          rules={{ required: "Required" }}
                          control={control}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <div className="flex justify-center">
                              <RadioGroup
                                onValueChange={(e) => {
                                  console.log(e);
                                  onChange(e);
                                  setTimeout(
                                    () =>
                                      console.log(form.getValues(), formValues),
                                    1000
                                  );
                                }}
                                defaultValue={(() => {
                                  console.log(
                                    value != null ? String(value) : undefined
                                  );
                                  return value != null
                                    ? String(value)
                                    : undefined;
                                })()}
                                className="flex flex-row space-x-4"
                              >
                                <div className="flex justify-start items-center space-x-3">
                                  <RadioGroupItem
                                    id="Max Intensity"
                                    value="Max Intensity"
                                  />
                                  <Label htmlFor="Max Intensity">
                                    Max Intensity
                                  </Label>
                                </div>
                                <div className="flex justify-start items-center space-x-3">
                                  <RadioGroupItem id="irm" value="irm" />
                                  <div>
                                    <FloatingLabelInput
                                      {...register("intensity_value", {
                                        setValueAs: (v) => {
                                          console.log("speed value", v);
                                          return v;
                                        },
                                        validate: (v) =>
                                          v === null ||
                                          isNaN(v) ||
                                          v >= 0 ||
                                          "Only non negative numbers",
                                      })}
                                      id="speed"
                                      type="number"
                                      className="w-16 bg-transparent"
                                    />
                                    {errors.speed?.message && (
                                      <span className="text-red-500 text-xs mt-[5px]">
                                        {errors.speed?.message}
                                      </span>
                                    )}
                                  </div>
                                  <Label htmlFor="irm">%1RM</Label>
                                </div>
                              </RadioGroup>
                            </div>
                          )}
                        />
                        {errors["exercise_type"]?.message && (
                          <span className="text-red-500 text-xs mt-[5px]">
                            {errors["exercise_type"]?.message}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                  <div className="font-poppins">
                    <div className="relative">
                      <FloatingLabelInput
                        id="notes"
                        type="textarea"
                        rows={1}
                        placeholder="Notes"
                        {...register("notes", {
                          maxLength: {
                            value: 100,
                            message: "Notes cannot exceed 100 characters",
                          },
                        })}
                        className="bg-transparent border border-black/25"
                      />
                    </div>
                    {errors.notes?.message && (
                      <span className="text-destructive font-poppins block !mt-[5px] text-xs">
                        {errors.notes?.message}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <span className="flex flex-grow justify-center items-center">
                  <div className="text-center">No exercise Selected</div>
                </span>
              )}
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};
export default WorkoutStep2;
