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
import {
  useGetCountriesQuery,
  useGetMembersListQuery,
} from "@/services/memberAPi";
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
  const dropzone = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    multiple: true,
    maxFiles: 1,
    maxSize: 1 * 1024 * 1024,
  } satisfies DropzoneOptions;
  const { form } = useOutletContext<ContextProps>();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: countries } = useGetCountriesQuery();
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const { data: memberList } = useGetMembersListQuery(orgId);
  const [files, setFiles] = useState<File[] | null>([]);
  const {
    control,
    formState: { errors },
    register,
    watch,
  } = form;
  console.log("errors", errors);
  const fileWatcher = watch("img_url"); // Watch for profile_img field value
  const watcher = watch();
  const { trigger } = form;
  return (
    <FormProvider {...form}>
      <div className="mt-4 space-y-4">
        <p className="text-black/80 text-[1.37em] font-bold">
          {" "}
          Plan information and Details
        </p>
        <div className="grid grid-cols-3 grid-rows-4 grid-flow-col gap-4">
          {/* <!-- Column 1: Name and Description --> \*/}
          <div className="h-min">
            <FloatingLabelInput
              id="name"
              label="Name*"
              error={errors.workout_name?.message}
              maxLength={41}
              {...register("workout_name", {
                required: "Required",
                maxLength: {
                  value: 40,
                  message: "Name cannot exceed 40 characters",
                },
              })}
            />
          </div>
          <div className="row-span-2">
            <FloatingLabelInput
              id="description"
              label="Description"
              type="textarea"
              rows={4}
              className="col-span-2"
              {...register("description")}
              error={errors.description?.message}
            />
            {/*<AutosizeTextarea
								placeholder="description"
								id="description"
								minHeight={94}
								maxHeight={600}
								className="h-full"
							/>*/}
          </div>
          <div className="h-min">
            <Controller
              name="member_ids"
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
                  defaultValue={value}
                >
                  <SelectTrigger floatingLabel="Goal*" name="goals">
                    <SelectValue placeholder="Select Goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {workoutGoals.map((st: any, index: number) => (
                      <SelectItem key={index} value={st.value}>
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
                  defaultValue={value}
                >
                  <SelectTrigger floatingLabel="Level*" name="level">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {workoutLevels.map((st: any, index: number) => (
                      <SelectItem key={index} value={st.value}>
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
                  defaultValue={value}
                >
                  <SelectTrigger floatingLabel="Visible For*" name="visiblefor">
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
              rules={{ required: "Required" }}
              control={control}
              render={({
                field: { onChange, value, onBlur },
                fieldState: { invalid, error },
              }) => (
                <Select
                  onValueChange={(value) => onChange(Number(value))}
                  defaultValue={
                    (value ? String(value) : value) as string | undefined
                  }
                >
                  <SelectTrigger floatingLabel="Weeks*" name="weeks">
                    <SelectValue placeholder="Weeks" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 20 }, (_, i) => ({
                      label: String(i + 1),
                      value: String(i + 1),
                    })).map((st: any, index: number) => (
                      <SelectItem key={index} value={st.value}>
                        {st.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.weeks?.message && (
              <span className="text-red-500 text-xs mt-[5px]">
                {errors.weeks?.message}
              </span>
            )}
          </div>
          {/*<div className="p-4">
						<div className="mb-4">
							<div className="justify-center items-center flex flex-col">
								<div className="flex flex-col items-center justify-center p-4 border rounded h-52 w-52">
									{selectedImage ? (
										<img
											src={URL.createObjectURL(selectedImage)}
											alt="Selected"
											className="h-full w-full object-cover"
										/>
									) : (
										<ImageIcon className="w-12 h-12 text-gray-400" />
									)}
								</div>
								<input
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									className="hidden"
									id="image-upload"
								/>
								<label htmlFor="image-upload">
									<Button
										variant="ghost"
										className="mt-2 gap-2 border-dashed border-2 text-xs"
									>
										<FiUpload className="text-primary w-5 h-5" /> Image
									</Button>
								</label>
							</div>
						</div>
					</div>*/}
          <div className="row-span-4 h-min">
            <div className="p-4">
              <div className="mb-4">
                <Controller
                  name={"img_url"}
                  control={control}
                  render={({
                    field: { onChange, value, onBlur },
                    fieldState: { invalid, error },
                  }) => (
                    <div className="">
                      <FileUploader
                        value={files}
                        onValueChange={setFiles}
                        dropzoneOptions={dropzone}
                      >
                        {files &&
                          files?.map((file, i) => (
                            <div className="h-[180px] ">
                              <FileUploaderContent className="flex items-center  justify-center  flex-row gap-2 bg-gray-100 ">
                                <FileUploaderItem
                                  key={i}
                                  index={i}
                                  className="h-[180px] w-full p-0 rounded-md overflow-hidden relative bg-gray-100 flex items-center justify-center" // Ensure the background doesn't shrink
                                  aria-roledescription={`file ${i + 1} containing ${file.name}`}
                                >
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="object-contain max-h-[180px] max-w-full mx-auto" // Ensures the image stays within the container and is centered
                                  />
                                </FileUploaderItem>
                              </FileUploaderContent>
                            </div>
                          ))}

                        <FileInput className="flex flex-col gap-2  ">
                          {files?.length == 0 && watcher?.img_url == null ? (
                            <div className="flex items-center justify-center h-[180px] w-full border bg-background rounded-md bg-gray-100">
                              <i className="text-gray-400 fa-regular fa-image text-2xl"></i>
                            </div>
                          ) : (
                            files?.length == 0 &&
                            watcher?.img_url && (
                              <div className="flex items-center justify-center h-[180px] w-full border bg-background rounded-md bg-gray-100">
                                <img
                                  src={
                                    watcher?.img_url !== "" && watcher?.img_url
                                      ? VITE_VIEW_S3_URL +
                                        "/" +
                                        watcher?.img_url
                                      : ""
                                  }
                                  loading="lazy"
                                  className="object-contain max-h-[180px] "
                                />
                              </div>
                            )
                          )}
                          <div className="flex items-center  justify-center gap-1 w-full border-dashed border-2 border-gray-200 rounded-md px-2 py-1">
                            <img src={uploadimg} className="size-10" />
                            <span className="text-sm">
                              {watcher.img_url
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
            <div></div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
export default WorkoutStep1;
