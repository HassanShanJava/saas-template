import { Controller, useFormContext } from "react-hook-form";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { StepperFormValues } from "@/types/hook-stepper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  useCreateGroupMutation,
  useGetGroupQuery,
} from "@/services/groupsApis";
import { useToast } from "@/components/ui/use-toast";
import { DayOfWeek, LimitedAccessTime } from "@/app/types";
import { daysOrder } from "@/utils/helper";
import { initialDaysOfWeek } from "@/constants/membership";
import { status } from "@/constants/global";

interface groupList {
  label: string;
  value: number;
}

const BasicInfoForm = () => {
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
    register,
    watch,
  } = useFormContext<StepperFormValues>();
  const { toast } = useToast();

  const [isAddGroup, setAddGroup] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [access, setAccess] = useState<string | undefined>("");
  const [groupList, setGroupList] = useState<groupList[]>([]);

  const [limitedAccessDays, setLimitedAccessDays] = useState<LimitedAccessTime>(
    Object.keys(getValues("limited_access_time") as LimitedAccessTime).length >
      0
      ? (getValues("limited_access_time") as LimitedAccessTime)
      : initialDaysOfWeek
  );

  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const { data: groupData, isFetching } = useGetGroupQuery(orgId);
  const [createGroups, { isLoading: groupCreateLoading, isUninitialized }] =
    useCreateGroupMutation();

  const handleAdd = (day: string) => {
    const dayIntervals = limitedAccessDays[day as string] || [];
    
    setLimitedAccessDays((prev) => ({
      ...prev,
      [day]: [...dayIntervals, { from_time: "", to_time: "" }],
    }));
  };

  const handleDelete = (day: string, index: number) => {
    setLimitedAccessDays((prev) => {
      const dayIntervals = prev[day] || [];

      // If there's only one interval, clear its fields instead of deleting
      if (dayIntervals.length === 1) {
        return {
          ...prev,
          [day]: [{ from_time: "", to_time: "" }],
        };
      }

      // Otherwise, delete the interval at the specified index
      return {
        ...prev,
        [day]: dayIntervals.filter((_, i) => i !== index),
      };
    });
  };

  const handleTimeChange = (
    day: string,
    index: number,
    field: "from_time" | "to_time",
    value: string
  ) => {
    setLimitedAccessDays((prev) => ({
      ...prev,
      [day]: prev[day].map((interval, i) =>
        i === index ? { ...interval, [field]: value } : interval
      ),
    }));
  };

  const sortedDays = Object.keys(limitedAccessDays).sort(
    (a, b) =>
      daysOrder.indexOf(a as DayOfWeek) - daysOrder.indexOf(b as DayOfWeek)
  );

  useEffect(() => {
    const subscription = watch((value) => {
      setAccess(value?.access_type);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (limitedAccessDays) {
      setValue("limited_access_time", limitedAccessDays);
    }
  }, [limitedAccessDays]);

  useEffect(() => {
    if (groupData) {
      setGroupList(groupData);
    }
  }, [groupData]);

  const addGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    if (inputValue.length > 15) {
      toast({
        variant: "destructive",
        title: "Group name cannot be too large",
      });
      return;
    }

    try {
      const payload = {
        org_id: orgId,
        name: inputValue.toLowerCase(),
      };

      const resp = await createGroups(payload).unwrap();
      if (resp) {
        const response = {
          value: resp.id,
          label: resp.name,
        };
        setGroupList((prev) => [...prev, response]);
      }
    } catch (error) {
      console.error({ error });
    }

    setInputValue("");
    setAddGroup(false);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  console.log({ access, limitedAccessDays });

  return (
    <div className="text-black h-full">
      <h1 className="font-semibold text-[#2D374] text-xl">Basic Information</h1>
      <div className="grid grid-cols-3 gap-4 items-start my-3">
        <div className="flex flex-col gap-4 col-span-1">
          <FloatingLabelInput
            id="membership_name"
            label="Name"
            text="*"
            {...register("name", {
              required: "Required",
              setValueAs: (value) => value.toLowerCase(),
              maxLength: {
                value: 40,
                message: "Name must be 40 characters or less",
              },
            })}
            error={errors.name?.message}
            className="capitalize"
          />
          <Controller
            name="group_id"
            rules={{ required: "Required" }}
            control={control}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { invalid, error },
            }) => (
              <div>
                <Select
                  onValueChange={(value) => {
                    onChange(value);
                  }}
                  defaultValue={value ? value + "" : undefined}
                  disabled={isFetching}
                >
                  <SelectTrigger
                    name="group_id"
                    className="capitalize"
                    floatingLabel="Group"
                    text="*"
                  >
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  {invalid && (
                    <span className="text-destructive block !mt-[5px] text-[12px]">
                      {error?.message}
                    </span>
                  )}
                  <SelectContent className="capitalize custom-scrollbar max-h-64">
                    {groupList &&
                      groupList.length > 0 &&
                      groupList.map((item) => (
                        <SelectItem value={item?.value + ""} key={item?.value}>
                          {item?.label}
                        </SelectItem>
                      ))}
                    <Separator className=" h-[1px] font-thin rounded-full" />
                    <div
                      className="flex items-center gap-2 p-2 cursor-pointer text-sm"
                      onClick={() => setAddGroup(true)}
                    >
                      <i className="fa fa-plus text-primary "></i>
                      Add Group
                    </div>
                    {isAddGroup && (
                      <form
                        className="p-2 relative flex items-center"
                        onSubmit={addGroup}
                      >
                        <Input
                          type="text"
                          name="group"
                          className="px-2 py-4 capitalize"
                          placeholder="Enter group name"
                          value={inputValue}
                          onChange={handleOnChange}
                          disabled={groupCreateLoading}
                        />
                        <button
                          type="submit"
                          disabled={!isUninitialized}
                          className="absolute right-3 bg-primary text-black font-semibold rounded-lg  px-1.5 "
                        >
                          {groupCreateLoading ? (
                            <i className=" fa fa-circle-notch animate-spin text-base p-0.5 "></i>
                          ) : (
                            <i className=" fa-regular fa-floppy-disk text-lg "></i>
                          )}
                        </button>
                      </form>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        </div>
        <div className="col-span-2">
          <FloatingLabelInput
            id="description"
            label="Description"
            type="textarea"
            rows={4}
            className="custom-scrollbar col-span-2 peer-placeholder-shown:top-[10%]"
            {...register("description", {
              maxLength: {
                value: 350,
                message: "Description should not exceed 350 characters",
              },
            })}
            error={errors.description?.message}
          />
        </div>
        <Controller
          name="status"
          rules={{ required: "Required" }}
          control={control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { invalid, error },
          }) => {
            const statusLabel = status.filter((r) => r.value == value)[0];
            return (
              <Select
                onValueChange={(value) => onChange(value)}
                defaultValue={value}
              >
                <SelectTrigger floatingLabel="Status" text="*">
                  <SelectValue
                    placeholder="Select status"
                    className="text-gray-400"
                  >
                    <span className="flex gap-2 items-center">
                      <span
                        className={`${statusLabel?.color} rounded-[50%] w-4 h-4`}
                      ></span>
                      <span>{statusLabel?.label}</span>
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {status.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }}
        />
      </div>

      <h1 className="font-semibold text-[#2D374] text-xl">Membership Scope</h1>
      <div className="flex items-center gap-6  ">
        <div className="flex items-center gap-4">
          <Label className="font-semibold ">
            Access times<span className="text-red-500">*</span>
          </Label>
          <Controller
            name="access_type"
            rules={{ required: "Required" }}
            control={control}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { invalid, error },
            }) => (
              <div>
                <RadioGroup
                  defaultValue={value}
                  className="flex items-center gap-4"
                  onValueChange={onChange}
                >
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem
                      value="no_restriction"
                      id="no_restriction"
                    />
                    <Label htmlFor="no_restriction">No Restriction</Label>
                  </div>
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="limited" id="limited" />
                    <Label htmlFor="limited">Limited Access</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          />
        </div>
        <div className="flex items-center gap-4">
          <Label className="font-semibold">
            Duration<span className="text-red-500">*</span>
          </Label>
          <Controller
            name="duration_period"
            rules={{ required: "Required" }}
            control={control}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { invalid, error },
            }) => (
              <div>
                <Select
                  onValueChange={(value) => {
                    onChange(value);
                  }}
                  value={value}
                >
                  <SelectTrigger name="duration_period">
                    <SelectValue
                      placeholder="Select duration"
                      defaultValue={undefined}
                    />
                  </SelectTrigger>
                  {invalid && (
                    <span className="text-destructive block !mt-[5px] text-[12px]">
                      {error?.message}
                    </span>
                  )}
                  <SelectContent>
                    <SelectItem value={"week"}>Week</SelectItem>
                    <SelectItem value={"month"}>Month</SelectItem>
                    <SelectItem value={"quarter"}>Quarter</SelectItem>
                    {/* <SelectItem value={"bi_annual"}>Bi-Annual</SelectItem> */}
                    <SelectItem value={"year"}>Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />
          <FloatingLabelInput
            id="duration"
            type="number"
            className="w-20 "
            {...register("duration", {
              required: "Required",
              min: {
                value: 1,
                message: "Duration must be between 1 and 12.",
              },
              max: {
                value: 12,
                message: "Duration must be between 1 and 12.",
              },
            })}
            error={errors.duration?.message}
          />
        </div>
      </div>
      {access == "limited" && (
        <div className="bg-gray-200 px-3 py-2 w-fit  text-sm rounded-lg  ">
          <p className="font-semibold text-base">Limited Access</p>
          {sortedDays.map((day) => (
            <div key={day} className="">
              {limitedAccessDays[day].map(({ from_time, to_time }, index) => (
                <div
                  key={index}
                  className="space-y-1 grid grid-cols-3 items-center gap-3 "
                >
                  <div className="flex items-center gap-3">
                    <i
                      className="text-base text-primary fa fa-plus cursor-pointer"
                      onClick={() => handleAdd(day)}
                    ></i>
                    <p className="my-auto capitalize">{day}</p>
                  </div>

                  <div className="flex col-span-2 items-center gap-2">
                    <Input
                      type="time"
                      value={from_time}
                      onChange={(e) =>
                        handleTimeChange(
                          day,
                          index,
                          "from_time",
                          e.target.value
                        )
                      }
                      aria-label="Choose from time"
                      className="w-full h-7"
                    />
                    <p>till</p>
                    <Input
                      type="time"
                      value={to_time}
                      onChange={(e) =>
                        handleTimeChange(day, index, "to_time", e.target.value)
                      }
                      aria-label="Choose to time"
                      className="w-full h-7"
                    />
                    <i
                      className="fa-regular fa-trash-can cursor-pointer"
                      onClick={() => handleDelete(day, index)}
                    ></i>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BasicInfoForm;
