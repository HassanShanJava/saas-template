import { RootState } from "@/app/store";
import { CountryTypes, ErrorType, Workout } from "@/app/types";
import { AutosizeTextarea } from "@/components/ui/autosizetextarea/autosizetextarea";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multiselect/multiselect";
import { MultiSelect } from "@/components/ui/multiselect/multiselectCheckbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import {
  visibleFor,
  workoutGoals,
  workoutLevels,
} from "@/lib/constants/workout";
import { cn } from "@/lib/utils";
import { useGetMembersListQuery } from "@/services/memberAPi";
import { Check, ChevronDownIcon, ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { FiUpload } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { ContextProps } from "./workout-form";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/ui/file-uploader"; // Assuming you have these components
import { DropzoneOptions } from "react-dropzone";
const { VITE_VIEW_S3_URL } = import.meta.env;
import uploadimg from "@/assets/upload.svg";

const WorkoutStep1: React.FC = () => {
  const dropzoneOptions = {
    accept: {
      "image/": [".jpg", ".jpeg", ".png"],
    },
    multiple: true,
    maxFiles: 1,
    maxSize: 1 * 1024 * 1024,
  } satisfies DropzoneOptions;
  const { form } = useOutletContext<ContextProps>();
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const { data: memberList } = useGetMembersListQuery({ id: Number(orgId), query: "" });
  const fileInput = form.getValues("file");
  const [files, setFiles] = useState<File[] | null>(fileInput ?? []);

  const {
    control,
    formState: { errors },
    register,
    watch,
    setValue,
  } = form;
  const watcher = watch();
  const { trigger } = form;
  const onFileChange = (value: File[] | null) => {
    const fileArray = value ?? []; // Ensure it's an array
    setFiles(fileArray);
    setValue("file", fileArray);
  };
  return (
    <FormProvider {...form}>
      <div className="mt-4 space-y-4">
        <p className="text-black/80 text-[1.37em] font-bold">
          {" "}
          Plan information and Details
        </p>
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-x-8 gap-y-4">
          {/* <!-- Column 1: Name and Description --> \*/}
          <div className="space-y-4">
            <div className="h-min">
              <FloatingLabelInput
                id="name"
                label="Name"
                text="*"
                error={errors.workout_name?.message}
                maxLength={41}
                {...register("workout_name", {
                  required: "Required",
                  maxLength: {
                    value: 40,
                    message: "Name cannot exceed 40 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z0-9\s'-]+$/,
                    message: "Name contains invalid characters",
                  },
                  validate: (value) => {
                    if (/[<>&%$#@,/|~^()\[\]{}*+=`]/.test(value)) {
                      return "Name contains disallowed special characters";
                    }
                    return true;
                  },
                })}
              />
            </div>
            <div className="row-span-2">
              <FloatingLabelInput
                id="description"
                label="description"
                type="textarea"
                rows={4}
                maxLength={351}
                className="col-span-2"
                {...register("description", {
                  maxLength: {
                    value: 350,
                    message: "Description cannot exceed 350 characters.",
                  },
                  validate: {
                    patternCheck: (value) =>
                      value === "" ||
                      /^[A-Za-z0-9\s.,\-_]+$/.test(value as string) ||
                      "Description contains invalid characters",
                    customCheck: (value) =>
                      value === "" ||
                      !/[<>&%$#@/|~^()\[\]{}*+=:`]/.test(value || "") ||
                      "Description contains disallowed special characters",
                  },
                })}
                error={errors.description?.message}
              />
            </div>
            <div className="h-min">
              <Controller
                name="members"
                control={control}
                render={({
                  field: { onChange, value, onBlur },
                  fieldState: { invalid, error },
                }) => (
                  <MultiSelect
                    floatingLabel="Assign Members"
                    key="Assign Members"
                    options={memberList || []}
                    defaultValue={value || []} // Ensure defaultValue is always an array
                    onValueChange={(selectedValues) => onChange(selectedValues)}
                    placeholder="Assign Members"
                    variant="inverted"
                    maxCount={1}
                    className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  />
                )}
              />
            </div>
          </div>
          <div className="space-y-4">
            {/* <!-- Column 2: Visibility and Repetition --> */}
            <div className="h-min">
              <Controller
                name="goals"
                rules={{ required: "Required" }}
                control={control}
                render={({
                  field: { onChange, value, onBlur },
                  fieldState: { invalid, error },
                }) => (
                  <Select
                    onValueChange={(value) => onChange(value)}
                    value={value}
                  >
                    <SelectTrigger floatingLabel="Goal" text="*" name="goals">
                      <SelectValue placeholder="Select Goal" />
                    </SelectTrigger>
                    <SelectContent>
                      {workoutGoals.map((st: any, index: number) => (
                        <SelectItem key={index} value={st.label}>
                          {st.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.goals?.message && (
                <span className="text-red-500 text-xs mt-[5px]">
                  {errors.goals?.message}
                </span>
              )}
            </div>
            <div className="h-min">
              <Controller
                name="level"
                rules={{ required: "Required" }}
                control={control}
                render={({
                  field: { onChange, value, onBlur },
                  fieldState: { invalid, error },
                }) => (
                  <Select
                    onValueChange={(value) => onChange(value)}
                    value={value}
                  >
                    <SelectTrigger floatingLabel="Level" text="*" name="level">
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {workoutLevels.map((st: any, index: number) => (
                        <SelectItem key={index} value={st.label}>
                          {st.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.level?.message && (
                <span className="text-red-500 text-xs mt-[5px]">
                  {errors.level?.message}
                </span>
              )}
            </div>
            <div className="h-min">
              <Controller
                name="visible_for"
                rules={{ required: "Required" }}
                control={control}
                render={({
                  field: { onChange, value, onBlur },
                  fieldState: { invalid, error },
                }) => (
                  <Select
                    onValueChange={(value) => onChange(value)}
                    value={value}
                  >
                    <SelectTrigger
                      floatingLabel="Visible For"
                      text="*"
                      name="visible_for"
                    >
                      <SelectValue placeholder="Select Visible For" />
                    </SelectTrigger>
                    <SelectContent>
                      {visibleFor.map((st: any, index: number) => (
                        <SelectItem key={index} value={st.value}>
                          {st.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.visible_for?.message && (
                <span className="text-red-500 text-xs mt-[5px]">
                  {errors.visible_for?.message}
                </span>
              )}
            </div>
            <div className="h-min">
              <Controller
                name="weeks"
                control={control}
                rules={{
                  required: "Required",
                  min: {
                    value: 1,
                    message: "Minimum 1 week",
                  },
                  max: {
                    value: 20,
                    message: "Maximum 20 weeks",
                  },
                }}
                render={({ field: { onChange, value, ref } }) => (
                  <FloatingLabelInput
                    id="weeks"
                    label="Weeks"
                    text="*"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={20}
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value, 10))}
                    error={errors.weeks?.message}
                    ref={ref}
                  />
                )}
              />
            </div>
          </div>
          <div className="space-y-4">
            <Controller
              name={"file"}
              control={control}
              render={({ field }) => (
                <div className="">
                  <FileUploader
                    value={files}
                    onValueChange={onFileChange}
                    dropzoneOptions={dropzoneOptions}
                  >
                    {files &&
                      files?.map((file, i) => (
                        <div className="h-[145px] ">
                          <FileUploaderContent className="flex items-center  justify-center  flex-row gap-2 bg-gray-100 ">
                            <FileUploaderItem
                              key={i}
                              index={i}
                              className="h-[145px] w-full p-0 rounded-md overflow-hidden relative bg-gray-100 flex items-center justify-center" // Ensure the background doesn't shrink
                              aria-roledescription={`file ${i + 1} containing ${file.name}`}
                            >
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="object-contain max-h-[145px] max-w-full mx-auto" // Ensures the image stays within the container and is centered
                              />
                            </FileUploaderItem>
                          </FileUploaderContent>
                        </div>
                      ))}

                    <FileInput className="flex flex-col gap-2  ">
                      {files?.length == 0 && watcher?.img_url == null ? (
                        <div className="flex items-center justify-center h-[145px] w-full border bg-background rounded-md ">
                          <i className="text-gray-400 fa-regular fa-image text-2xl"></i>
                        </div>
                      ) : (
                        files?.length == 0 &&
                        watcher?.img_url && (
                          <div className="flex items-center justify-center h-[145px] w-full border bg-background rounded-md ">
                            <img
                              src={
                                watcher?.img_url !== "" && watcher?.img_url
                                  ? watcher?.img_url.includes(VITE_VIEW_S3_URL)
                                    ? watcher?.img_url
                                    : `${VITE_VIEW_S3_URL}/${watcher?.img_url}`
                                  : watcher.img_url
                              }
                              loading="lazy"
                              className="object-contain max-h-[145px] m-5 border-t border-b"
                            />
                          </div>
                        )
                      )}
                      <div className="flex items-center  justify-center gap-1 w-full border-dashed border-2 border-gray-200 rounded-md px-2 py-1">
                        <img src={uploadimg} className="size-10" />
                        <span className="text-sm">
                          {watcher.img_url || files?.length
                            ? "Change Image"
                            : "Upload Image"}
                        </span>
                      </div>
                    </FileInput>
                  </FileUploader>

                  {errors.img_url?.message && files?.length == 0 && (
                    <span className="text-red-500 text-xs mt-[5px]">
                      {errors.img_url?.message}
                    </span>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
export default WorkoutStep1;
