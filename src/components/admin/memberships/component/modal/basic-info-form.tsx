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

const status = [
  { value: "active", label: "Active", color: "bg-green-500" },
  { value: "inactive", label: "Inactive", color: "bg-blue-500" },
];

interface groupList {
  label: string;
  value: number;
}

const daysOrder = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

interface limitedAccessDaysTypes {
  id: number;
  day: string;
  from: string;
  to: string;
}

const BasicInfoForm = () => {
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
    register,
    trigger,
    watch,
  } = useFormContext<StepperFormValues>();
  const { toast } = useToast();

  const [isAddGroup, setAddGroup] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<any>("");
  const [access, setAccess] = useState<string | undefined>("");
  const [groupList, setGroupList] = useState<groupList[]>([]);

  const [limitedAccessDays, setLimitedAccessDays] = useState<
    limitedAccessDaysTypes[]
  >(
    (getValues("limited_access_data") as limitedAccessDaysTypes[]).length > 0
      ? (getValues("limited_access_data") as limitedAccessDaysTypes[])
      : [
          { id: 1, day: "monday", from: "", to: "" },
          { id: 2, day: "tuesday", from: "", to: "" },
          { id: 3, day: "wednesday", from: "", to: "" },
          { id: 4, day: "thursday", from: "", to: "" },
          { id: 5, day: "friday", from: "", to: "" },
          { id: 6, day: "saturday", from: "", to: "" },
          { id: 7, day: "sunday", from: "", to: "" },
        ]
  );

  // useEffect(() => {
  //   const initialData = getValues();
  //   if (initialData) {
  //     setValue("name", initialData.name);
  //     setValue("group_id", initialData.group_id);
  //     setValue("description", initialData.description);
  //     setValue("status", initialData.status);
  //     setValue("access_type", initialData.access_type);
  //     setValue("limited_access_data", initialData.limited_access_data);
  //     setLimitedAccessDays(
  //       (initialData.limited_access_data as limitedAccessDaysTypes[]) ||
  //         limitedAccessDays
  //     );
  //   }
  // }, [getValues, setValue]);

  console.log({ limitedAccessDays });

  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const { data: groupData, isFetching } = useGetGroupQuery(orgId);
  const [createGroups, { isLoading: groupCreateLoading, isUninitialized }] =
  useCreateGroupMutation();

  const handleAdd = (day: string) => {
    setLimitedAccessDays((prev) => [
      ...prev,
      { id: Date.now(), day, from: "", to: "" },
    ]);
  };

  const handleDelete = (id: number) => {
    setLimitedAccessDays((prev) => {
      const entryToDelete = prev.find((entry) => entry.id === id);
      const sameDayEntries = prev.filter(
        (entry) => entry.day === entryToDelete?.day
      );

      if (sameDayEntries.length > 1) {
        return prev.filter((entry) => entry.id !== id);
      } else {
        return prev.map((entry) =>
          entry.id === id ? { ...entry, from: "", to: "" } : entry
        );
      }
    });
  };

  const isValidTimeRange = (from: string, to: string) => {
    return from < to;
  };

  const isConflictingTime = (
    day: string,
    from: string,
    to: string,
    id: number | undefined = undefined
  ) => {
    const dayEntries = limitedAccessDays.filter(
      (entry) => entry.day === day && entry.id !== id
    );
    return dayEntries.some((entry) => from < entry.to && to > entry.from);
  };

  console.log({ access });

  const handleTimeChange = (id: number, type: string, value: string) => {
    setLimitedAccessDays((prev) => {
      const updatedEntries = prev.map((entry) => {
        if (entry.id === id) {
          const updatedEntry = { ...entry, [type]: value };
          if (
            !isValidTimeRange(updatedEntry.from, updatedEntry.to) &&
            updatedEntry.to != "" &&
            updatedEntry.from != ""
          ) {
            toast({
              variant: "destructive",
              title: "Enter valid time range",
            });
            return entry;
          } else if (
            isConflictingTime(
              updatedEntry.day,
              updatedEntry.from,
              updatedEntry.to,
              id
            )
          ) {
            toast({
              variant: "destructive",
              title: "Time slot conflicts on the same day.",
            });
            return entry;
          } else {
            return updatedEntry;
          }
        }
        return entry;
      });
      return updatedEntries;
    });
  };

  const sortedDays = limitedAccessDays.sort(
    (a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day)
  );

  useEffect(() => {
    const subscription = watch((value) => {
      setAccess(value?.access_type);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (limitedAccessDays) {
      setValue("limited_access_data", limitedAccessDays);
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

    try {
      const payload = {
        org_id: orgId,
        name: inputValue,
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

  return (
    <div className="text-black h-full">
      <h1 className="font-semibold text-[#2D374] text-xl">Basic Information</h1>
      <div className="grid grid-cols-3 gap-4 items-start my-3">
        <div className="flex flex-col gap-4 col-span-1">
          <FloatingLabelInput
            id="membership_name"
            label="Name*"
            {...register("name", { required: "Name is Required" })}
            error={errors.name?.message}
          />
          <Controller
            name="group_id"
            rules={{ required: "Group Name is Required" }}
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
                  <SelectTrigger name="group_id" floatingLabel="Group*">
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  {invalid && (
                    <span className="text-destructive block !mt-[5px] text-[12px]">
                      {error?.message}
                    </span>
                  )}
                  <SelectContent>
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
                          className="px-2 py-4"
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
            customPercentage={[3,2]}
            className="col-span-2"
            {...register("description")}
            error={errors.description?.message}
          />
        </div>
        <Controller
          name="status"
          rules={{ required: "Status is Required" }}
          control={control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { invalid, error },
          }) => {
            console.log({ value, error });
            const statusLabel = status.filter((r) => r.value == value)[0];
            return (
              <Select
                onValueChange={(value) => onChange(value)}
                defaultValue={value}
              >
                <SelectTrigger floatingLabel="Status*">
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
          <Label className="font-semibold ">Access times*</Label>
          <Controller
            name="access_type"
            rules={{ required: "Access is Required" }}
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
                      value="no-restriction"
                      id="no-restriction"
                    />
                    <Label htmlFor="no-restriction">No Restriction</Label>
                  </div>
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem
                      value="limited-access"
                      id="limited-access"
                    />
                    <Label htmlFor="limited-access">Limited Access</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          />
        </div>
        <div className="flex items-center gap-4">
          <Label className="font-semibold">Duration*</Label>
          <Controller
            name="duration_type"
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
                  <SelectTrigger name="duration_type">
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
                    <SelectItem value={"weekly"}>week</SelectItem>
                    <SelectItem value={"monthly"}>Month</SelectItem>
                    <SelectItem value={"quarterly"}>Quarter</SelectItem>
                    <SelectItem value={"bi_annually"}>Bi-Annual</SelectItem>
                    <SelectItem value={"yearly"}>Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />
          <FloatingLabelInput
            id="duration_no"
            type="number"
            className="w-20 "
            {...register("duration_no", { required: "Required" })}
            error={errors.duration_no?.message}
          />
        </div>
      </div>
      {access == "limited-access" && (
        <div className="bg-gray-200 px-3 py-2 w-fit h-full text-sm rounded-lg max-h-[264px]  custom-scrollbar ">
          <p className="font-semibold text-base">Limited Access</p>
          {sortedDays.map(({ id, day, from, to }) => (
            <div
              key={id}
              className="grid grid-cols-3 items-center gap-3 space-y-1"
            >
              <div className="flex col-span-1  gap-3">
                <i
                  className="text-base text-primary fa fa-plus cursor-pointer"
                  onClick={() => handleAdd(day)}
                ></i>
                <p className="my-auto capitalize">{day}</p>
              </div>
              <div className="flex col-span-2 items-center gap-2 ">
                <Input
                  type="time"
                  value={from}
                  onChange={(e) => handleTimeChange(id, "from", e.target.value)}
                  id="time"
                  aria-label="Choose time"
                  className="w-full h-7 "
                />
                <p>till</p>
                <Input
                  type="time"
                  value={to}
                  onChange={(e) => handleTimeChange(id, "to", e.target.value)}
                  id="time"
                  aria-label="Choose time"
                  className="w-full h-7 "
                />
                <i
                  className="fa-regular fa-trash-can cursor-pointer"
                  onClick={() => handleDelete(id)}
                ></i>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BasicInfoForm;
