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
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

interface group {
  name: string;
  value: string;
}

const BasicInfoForm = () => {
  const {
    control,
    formState: { errors },
    register,
    trigger,
  } = useFormContext<StepperFormValues>();

  const [groups, setGroups] = useState<group[]>([]);
  const [isAddGroup, setAddGroup] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<any>({});

  const addGroup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    setGroups((prev) => [
      ...prev,
      {
        name: inputValue,
        value: inputValue,
      },
    ]);

    setInputValue("");
    setAddGroup(false);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="text-black h-full">
      <h1 className="font-semibold text-[#2D374]">Basic Information</h1>
      <div className="grid grid-cols-3 gap-4 items-start mt-3">
        <div className="flex flex-col gap-4 col-span-1">
          <FloatingLabelInput
            id="membership_name"
            label="Name*"
            {...register("membership_name", { required: "Name is Required" })}
            error={errors.membership_name?.message}
          />
          <Controller
            name="membership_group"
            rules={{ required: "Group Name is Required" }}
            control={control}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { invalid, error },
            }) => (
              <div>
                <Select
                  onValueChange={(value) => {
                    onChange(value === "true");
                    trigger([
                      "membership_name",
                      "membership_group",
                      "description",
                      "status",
                    ]);
                  }}
                  value={value}
                >
                  <SelectTrigger name="membership_group" floatingLabel="Group*">
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  {invalid && (
                    <span className="text-destructive block !mt-[5px] text-[12px]">
                      {error?.message}
                    </span>
                  )}
                  <SelectContent>
                    {groups?.length > 0 &&
                      groups.map((item, i) => (
                        <SelectItem value={item?.value} key={i}>
                          {item?.name}
                        </SelectItem>
                      ))}
                    <Separator className=" h-[3px] font-thin" />
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
                        />
                        <button
                          type="submit"
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
            label="Description*"
            type="textarea"
            rows={4}
            className="col-span-2"
            {...register("description", { required: "Required" })}
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
          }) => (
            <div>
              <Select
                onValueChange={(value) => {
                  onChange(value === "true");
                  trigger([
                    "membership_name",
                    "membership_group",
                    "description",
                    "status",
                  ]);
                }}
                value={value + ""}
                // value={true}
              >
                <SelectTrigger name="status" floatingLabel="Status*">
                  <SelectValue placeholder="Select status">
                    <span className="flex gap-2 items-center">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          value ? "bg-green-500" : "bg-blue-500"
                        }`}
                      ></span>
                      {value ? "Active" : "Inactive"}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                {invalid && (
                  <span className="text-destructive block !mt-[5px] text-[12px]">
                    {error?.message}
                  </span>
                )}
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;
