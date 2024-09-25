import {
  ExerciseResponseServerViewType,
  IntensityEnum,
  Workout,
  WorkoutIntensityEnum,
  createExerciseInputTypes,
  difficultyEnum,
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
} from "@/services/workoutService";
import { useDebounce } from "@/hooks/use-debounce";

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
  const [exercises, setExercises] = useState<Exercise[]>([] as Exercise[]);
  // workout_day_exercise_data as Exercise[]
  const [exerciseFilterOpen, setExerciseFilterOpen] = useState<boolean>(true);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>();
  const [currExercise, setCurrExercise] = useState<Exercise | null>(null);
  const [inputRef, setInputRef] = useState<HTMLDivElement | null>(null);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [filterData, setFilter] = useState<ExerciseFilter>({});
  const [uid, setUid] = useState<number>(1e4);

  const { data: WorkoutDays } = useGetAllWorkoutDayQuery(workoutId as string);
  const { data: CategoryData } = useGetAllCategoryQuery();
  const { data: EquipmentData } = useGetAllEquipmentsQuery();
  const { data: MuscleData } = useGetAllMuscleQuery();
  const { data: JointsData } = useGetAllJointsQuery();
  const { data: MetsData } = useGetAllMetQuery();
  const { data: Exercises, isLoading } = useGetAllExerciseForWorkoutQuery({
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
      });
  }

  function handleUpdate(idx: number, id: number, day_name: string) {
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
      });
  }

  function handleExerciseDuplicate(id: number) {
    const exercise = exercises.find((e) => e.id === id);
    if (exercise) setExercises((exercises) => [...exercises, exercise]);
  }

  function handleExerciseAdd(exercise: Exercise) {
    setExercises((exercises) => [...exercises, exercise]);
  }

  function handleExerciseDelete(index: number, id: number) {
    setExercises((exercises) => exercises.filter((_, i) => i !== index));
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

  function onSubmit(data: any) {
    const idx = selectedExerciseIndex;
    setExercises((exercises) =>
      exercises.map((exercise, i) => (i === idx ? { ...data } : exercise))
    );
    form.reset(data);
  }
  const isLastSet =
    formValues.seconds_per_set?.length === 1 ||
    formValues.rest_between_set?.length === 1 ||
    formValues.repetitions_per_set?.length === 1;

  return (
    <div className="mt-4 space-y-4 mb-20">
      <p className="text-black/80 text-[1.37em] font-bold">
        {" "}
        Training & Exercise Details
      </p>
      <div className="w-full flex gap-5">
        <div className="w-[40%] h-[32rem] bg-[#EEE] rounded-xl space-y-2 custom-scrollbar overflow-hidden">
          {!showSearchResults ? (
            <div className="p-3">
              {[...Array(noOfWeeks).keys()].map((week: any, i: number) => (
                <Accordion type="single" defaultValue="item-1" collapsible>
                  <AccordionItem value="item-1" className="!border-none">
                    <AccordionTrigger className="h-0 !no-underline !bg-transparent">
                      <span className="font-semibold">Week {i + 1}</span>
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
              <div className="sticky z-40 top-0 p-3 bg-[#EEE] space-y-2 custom-scrollbar">
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
                {isLoading ? (
                  <Spinner />
                ) : (
                  Exercises?.data.map((e) => {
                    const exercise: ExerciseResponseServerViewType =
                      e as unknown as ExerciseResponseServerViewType;
                    return (
                      <div
                        onClick={() => {
                          handleExerciseAdd(
                            exercise as unknown as ExerciseResponseServerViewType
                          );
                        }}
                        className="border border-black/25 rounded-lg p-2 hover:border-primary cursor-pointer"
                      >
                        <div className="flex justify-between items-center relative space-x-1 ">
                          <div className="flex gap-1 w-full">
                            <img
                              id="avatar"
                              src={
                                exercise.gif_url
                                  ? `${VITE_VIEW_S3_URL}/${exercise.gif_url}`
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
                          </div>
                        </div>
                      </div>
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
                <span className="text-sm text-gray-500 italic">
                  Select a day to add exercises
                </span>
              )}
            </div>
            {/* {selectedDay && (
              <div className="text-sm text-gray-600 bg-primary/20 p-2 rounded-md">
                Selected: Week {selectedDay.week}, Day {selectedDay.day} -{" "}
                {selectedDay.day_name?.slice(0, 8) + "..."}
                {/* (ID: {selectedDay.id}) */}
            {/* </div> */}
            {/* )} */}
            {selectedDay && (
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
            )}
            <div className="space-y-2">
              {exercises.map((exercise, i) => (
                <WorkoutDayExerciseComponent
                  key={i}
                  exercise={exercise}
                  selected={i === selectedExerciseIndex}
                  onDuplicate={handleExerciseDuplicate}
                  onDelete={(id) => handleExerciseDelete(i, id)}
                  onClick={() => {
                    if (isDirty) {
                      toast({
                        variant: "destructive",
                        title: "Exercise not saved",
                        description:
                          "You have changed the exercise, save before switching to the next exercise",
                      });
                      console.log(
                        "form.formState.dirtyFields",
                        form.formState.dirtyFields
                      );
                    } else {
                      setCurrExercise(exercise);
                      form.reset(exercise);
                      setSelectedExerciseIndex(i);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="w-[30%] h-[32rem] bg-[#EEE] rounded-xl p-3 space-y-2 custom-scrollbar flex flex-col">
          <FormProvider {...form}>
            <form
              noValidate
              className="pb-4 space-y-3"
              onSubmit={handleSubmit(onSubmit)}
              action="#"
            >
              <div className="flex justify-between">
                <span className="font-semibold">Exercise Details</span>
                {isDirty && (
                  <Button
                    type="submit"
                    onClick={() => {
                      return;
                    }}
                    className="h-auto p-0"
                    variant="ghost"
                  >
                    <i className="fa-regular fa-floppy-disk h-4 w-4"></i>
                  </Button>
                )}
              </div>
              {currExercise !== null ? (
                <>
                  <div className="flex justify-center">
                    <img
                      id="avatar"
                      src={
                        formValues.gif_url
                          ? `${VITE_VIEW_S3_URL}/${formValues.gif_url}`
                          : `${VITE_VIEW_S3_URL}/download.png`
                      }
                      alt="Exercise Image"
                      className="w-4/5 object-contain relative"
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
                              if (!isLastSet) {
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
                            disabled={isLastSet}
                            className={`text-red-500 hover:text-red-700 ${isLastSet ? "opacity-50 cursor-not-allowed" : ""}`}
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
                      <FloatingInput
                        id="notes"
                        type="textarea"
                        rows={1}
                        placeholder="Notes"
                        {...register("notes")}
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
                  No exercise selected
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
