import { HardwareIntegrationInput } from "@/app/types/hardware-integration";
import CustomCollapsible from "@/components/ui/collapsibleCard/collapsible-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useGetCreditsQuery } from "@/services/creditsApi";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";

interface HardwareDetailsSectionProp {
  control: Control<HardwareIntegrationInput>;
  errors: FieldErrors<HardwareIntegrationInput>;
  watch: UseFormWatch<HardwareIntegrationInput>;
}

const HardwareDetailsSection = ({
  control,
  errors,
  watch,
}: HardwareDetailsSectionProp) => {
  const watcher = watch();
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const {
    data: facilitiesData,
    isLoading,
    refetch: refetchforcredits,
  } = useGetCreditsQuery({ org_id: orgId, query: "" });
  return (
    <div className="h-[30%] w-[95%] rounded-2xl bg-white">
      <CustomCollapsible title="Hardware Details">
        <div className="flex flex-row gap-5 justify-start items-center">
          {/* Name Field */}
          <div className="w-[30%]">
            <p className="text-base font-normal">
              Name <span className="text-red-500">*</span>
            </p>
            <Controller
              control={control}
              name="name"
              rules={{
                required: "Name is required",
                maxLength: {
                  value: 40,
                  message: "Name cannot exceed 40 characters",
                },
                validate: (value) =>
                  value.trim() !== "" || "Name cannot be empty or only spaces",
              }}
              render={({ field }) => (
                <Input className="w-full" placeholder="Enter Name" {...field} />
              )}
            />
            {errors.name?.message && (
              <p className="text-red-500 text-xs mt-[5px] ">
                {errors.name.message.toString()}
              </p>
            )}
          </div>

          {/* Connection Key Field */}
          <div className="w-[45%]">
            <p className="text-base font-normal">
              Connection Key <span className="text-red-500">*</span>
            </p>
            <Controller
              control={control}
              name="connection_key"
              rules={{
                required: "Connection Key is required",
                maxLength: {
                  value: 100,
                  message: "Connection Key cannot exceed 100 characters",
                },
                validate: (value) =>
                  value.trim() !== "" || "Name cannot be empty or only spaces",
              }}
              render={({ field }) => (
                <div className="w-full gap-5 flex flex-row justify-center items-center">
                  <Input
                    className="w-full"
                    placeholder="Enter Connection Key"
                    {...field}
                  />
                  <Controller
                    control={control}
                    name="use_facility"
                    render={({ field }) => (
                      <div className="flex gap-2 h-full">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <span className="text-nowrap">Use Facility</span>
                      </div>
                    )}
                  />
                </div>
              )}
            />

            {errors.connection_key?.message && (
              <p className=" text-red-500 text-xs mt-[5px]">
                {errors.connection_key.message.toString()}
              </p>
            )}
          </div>
        </div>
        <div className="mt-3 flex flex-row gap-3">
          <div className="w-[50%]">
            <div>
              <p className="text-base font-normal">Description</p>
            </div>
            <Controller
              control={control}
              name="description"
              rules={{
                maxLength: {
                  value: 200,
                  message: "Description cannot exceed 200 characters",
                },
              }}
              render={({ field }) => (
                <Textarea
                  placeholder="Type your Description here"
                  className="resize-none"
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
          </div>
          {watcher.use_facility && (
            // <div className="w-[30%]">
            //   <Controller
            //     name="facility_id"
            //     rules={{ required: watcher.use_facility ? "Required" : false }}
            //     control={control}
            //     render={({
            //       field: { onChange, value },
            //       fieldState: { error },
            //     }) => (
            //       <>
            //         <div>
            //           <div>
            //             <p className="text-base font-normal">
            //               Facility{" "}
            //               {watcher.use_facility && (
            //                 <span className="text-red-500">*</span>
            //               )}
            //             </p>
            //           </div>
            //         </div>

            //         {error && (
            //           <span className="text-red-500 text-xs mt-[5px]">
            //             {error.message}
            //           </span>
            //         )}
            //       </>
            //     )}
            //   />
            // </div>

            <div className="w-[30%]">
              <Controller
                name="facility_id"
                rules={{ required: "Facility is required" }}
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <>
                    <div>
                      <div>
                        <p className="text-base font-semibold">
                          Facility <span className="text-red-500">*</span>
                        </p>
                      </div>
                      <Select
                        onValueChange={(value) => onChange(value)}
                        defaultValue={value ? value.toString() : undefined}
                        disabled={watcher.use_facility === false}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Facility" />
                        </SelectTrigger>
                        <SelectContent>
                          {facilitiesData?.data?.map(
                            (facility: { id: number; name: string }) => (
                              <SelectItem
                                key={facility.id}
                                value={String(facility.id)}
                              >
                                {facility.name}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    {error && (
                      <span className="text-red-500 text-xs mt-[5px]">
                        {error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
          )}
        </div>
      </CustomCollapsible>
    </div>
  );
};

export default HardwareDetailsSection;
