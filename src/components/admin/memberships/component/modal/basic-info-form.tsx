import { Controller, useFormContext } from "react-hook-form";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { StepperFormValues } from "@/types/hook-stepper";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  useCreateGroupsMutation,
  useGetGroupsQuery,
} from "@/services/groupsApis";
import { Value } from "@radix-ui/react-select";

const status = [
  { value: "true", label: "Active", color: "bg-green-500" },
  { value: "false", label: "Inactive", color: "bg-blue-500" },
];

interface groupList {
  label: string;
  value: number;
}

const BasicInfoForm = () => {
  const {
    control,
    formState: { errors },
    register,
    trigger,
    watch,
  } = useFormContext<StepperFormValues>();

  const [isAddGroup, setAddGroup] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<any>("");
  const [access, setAccess] = useState<string | undefined>("");
  const [groupList, setGroupList] = useState<groupList[]>([]);

  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const { data: groupData } = useGetGroupsQuery(orgId);
  const [createGroups, { isLoading: groupCreateLoading, isUninitialized }] =
    useCreateGroupsMutation();

  useEffect(() => {
    const subscription = watch((value) => {
      setAccess(value?.access);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

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

  console.log(errors,"basic form")

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
                  value={value+""}
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
                      groupList.map((item, i) => (
                        <SelectItem value={item?.value + ""} key={item?.value}>
                          {item?.label}
                        </SelectItem>
                      ))}
                    <Separator className=" h-[1px] font-thin rounded-full" />
                    <div
                      className="flex items-center gap-2 p-2 cursor-pointer"
                      onClick={() => setAddGroup(true)}
                    >
                      <i className="fa fa-plus text-primary"></i>
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
                          <i className=" fa-regular fa-floppy-disk text-lg "></i>
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
            const statusLabel = status.filter((r) => r.value == value)[0]
            return (
              <Select
                onValueChange={(value)=>onChange(value)}
              >
                <SelectTrigger floatingLabel="Status*">
                  <SelectValue placeholder="Select status" className="text-gray-400">
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
                    <SelectItem key={item.value + ""} value={item.value + ""}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }}
        />
      </div>

      <h1 className="font-semibold text-[#2D374] text-2xl">Membership Scope</h1>
      <div className="flex items-center gap-6  my-3">
        <div className="flex items-center gap-4">
          <Label className="font-semibold ">Access times*</Label>
          <Controller
            name="access"
            rules={{ required: "Access is Required" }}
            control={control}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { invalid, error },
            }) => (
              <div>
                <RadioGroup
                  defaultValue=""
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
                    <SelectValue placeholder="Month" defaultValue={undefined} />
                  </SelectTrigger>
                  {invalid && (
                    <span className="text-destructive block !mt-[5px] text-[12px]">
                      {error?.message}
                    </span>
                  )}
                  <SelectContent>
                    <SelectItem value={"weekly"}>Week</SelectItem>
                    <SelectItem value={"monthly"}>Month</SelectItem>
                    <SelectItem value={"yearly"}>Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />
          <FloatingLabelInput
            id="duration_no"
            type="number"
            className="w-20 number-input"
            {...register("duration_no", { required: "Required" })}
            error={errors.duration_no?.message}
          />
        </div>
      </div>
      {access == "limited-access" && (
        <div className="bg-gray-200 p-3 w-fit h-fit text-sm rounded-lg">
          <p className="font-semibold text-base">Limited Access</p>
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thrusday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day, i) => (
            <div key={i} className="grid grid-cols-3 items-center gap-3 py-0.5">
              <div className="flex col-span-1 items-center gap-3">
                <i className="text-base text-primary fa fa-plus cursor-pointer"></i>
                <p className="my-auto">{day}</p>
              </div>
              {/* time */}
              <div className="flex col-span-2 items-center gap-2">
                <div>
                  <Select>
                    <SelectTrigger className="!bg-white ">
                      <SelectValue placeholder="00" defaultValue={"0"} />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                        16, 17, 18, 19, 20, 21, 22, 23,
                      ].map((hour, i) => (
                        <SelectItem
                          value={hour.toString()}
                          className="w-fit !p-0"
                        >{`${hour <= 9 ? "0" : ""}${hour} `}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select>
                    <SelectTrigger className="!bg-white">
                      <SelectValue placeholder="00" defaultValue={"0"} />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map(
                        (minute, i) => (
                          <SelectItem value={minute.toString()}>
                            {`${minute < 10 ? "0" : ""}${minute}`}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <p>till</p>

                <div>
                  <Select>
                    <SelectTrigger className="!bg-white">
                      <SelectValue placeholder="00" defaultValue={"0"} />
                    </SelectTrigger>
                    <SelectContent className="w-fit ">
                      {[
                        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                        16, 17, 18, 19, 20, 21, 22, 23,
                      ].map((hour, i) => (
                        <SelectItem
                          value={hour.toString()}
                          className=""
                        >{`${hour <= 9 ? "0" : ""}${hour}`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select>
                    <SelectTrigger className="!bg-white">
                      <SelectValue placeholder="00" defaultValue={"0"} />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map(
                        (minute, i) => (
                          <SelectItem value={minute.toString()}>
                            {`${minute < 10 ? "0" : ""}${minute}`}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <i className="fa-regular fa-trash-can cursor-pointer"></i>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BasicInfoForm;
