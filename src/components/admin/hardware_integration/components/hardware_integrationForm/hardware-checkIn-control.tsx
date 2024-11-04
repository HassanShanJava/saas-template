import { HardwareIntegrationInput } from "@/app/types/hardware-integration";
import CustomCollapsible from "@/components/ui/collapsibleCard/collapsible-card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormWatch,
} from "react-hook-form";

interface HardwareCheckInControlProp {
  control: Control<HardwareIntegrationInput>;
  errors: FieldErrors<HardwareIntegrationInput>;
  watch: UseFormWatch<HardwareIntegrationInput>;
}

const HardwareCheckInControlSection = ({
  control,
  errors,
  watch,
}: HardwareCheckInControlProp) => {
  const watcher = watch();

  const isOpen =
    watcher.settings?.has_no_active_membership ||
    watcher.settings?.has_no_required_credits ||
    // watcher.settings?.min_credits_required ||
    watcher.settings?.has_outstanding_invoices_enabled ||
    watcher.settings?.membership_expiry_enabled;
  return (
    <div className="h-[30%] w-[95%] rounded-2xl bg-white justify-center items-center flex">
      <CustomCollapsible title="Check-In Control" isOpenDefault={isOpen}>
        <div className="flex flex-col gap-5">
          <div className="shadow-sm rounded-md p-4 border flex flex-col justify-between items-center">
            <div className="flex flex-row justify-between items-center w-full">
              {" "}
              <span className="text-sm">Member has no active Membership</span>
              <Controller
                control={control}
                name="settings.has_no_active_membership"
                render={({ field }) => (
                  <div className="flex gap-2 h-full justify-center items-center">
                    <>
                      <span
                        className={`text-xs ${watcher.settings?.has_no_active_membership ? "text-red-500" : "text-gray-500"}`}
                      >
                        {watcher.settings?.has_no_active_membership
                          ? "Deny check-in"
                          : "No Check"}
                      </span>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </>
                  </div>
                )}
              />
            </div>
          </div>

          <div className="shadow-sm rounded-md p-4 border flex flex-col justify-between items-center">
            <div className="flex flex-row text-sm justify-between items-center w-full">
              {" "}
              <span className="text-sm">
                Member does not have required credits
              </span>
              <Controller
                control={control}
                name="settings.has_no_required_credits"
                render={({ field }) => (
                  <div className="flex gap-2 h-full justify-center items-center">
                    <>
                      <span
                        className={`text-xs ${watcher.settings?.has_no_required_credits ? "text-red-500" : "text-gray-500"}`}
                      >
                        {watcher.settings?.has_no_required_credits
                          ? "Deny check-in"
                          : "No Check"}
                      </span>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </>
                  </div>
                )}
              />
            </div>
          </div>
          <div className="shadow-sm rounded-md p-4 border flex flex-row justify-between items-center">
            <div className="flex justify-start text-sm items-center gap-3 ">
              <span className="text-nowrap text-sm">
                Member has outstanding invoices older than{" "}
              </span>
              <Controller
                control={control}
                name="settings.outstanding_invoices_days_threshold"
                disabled={
                  watcher.settings?.has_outstanding_invoices_enabled === false
                }
                rules={{
                  required: "Required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "positive Numbers only",
                  },
                  min: {
                    value: 1,
                    message: "Value must be at least 1",
                  },
                  max: {
                    value: 365,
                    message: "Value must be 365 or less",
                  },
                }}
                render={({ field }) => (
                  <div className="h-full w-[10%]">
                    <Input className="w-[100%]" {...field} />
                    {errors.settings?.outstanding_invoices_days_threshold
                      ?.message && (
                      <p className="text-red-500 text-xs pt-2">
                        {errors.settings?.outstanding_invoices_days_threshold.message.toString()}
                      </p>
                    )}
                  </div>
                )}
              />
              days
            </div>
            <Controller
              control={control}
              name="settings.has_outstanding_invoices_enabled"
              render={({ field }) => (
                <div className="flex gap-2 h-full justify-center items-center">
                  <>
                    <span
                      className={`text-xs ${watcher.settings?.has_outstanding_invoices_enabled ? "text-red-500" : "text-gray-500"}`}
                    >
                      {watcher.settings?.has_outstanding_invoices_enabled
                        ? "Deny check-in"
                        : "No Check"}
                    </span>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </>
                </div>
              )}
            />
          </div>
          <div className="shadow-sm rounded-md p-4 border flex flex-row justify-between items-center">
            <div className="flex justify-start text-sm items-center gap-3 ">
              <span className="text-nowrap text-sm">
                Member has membership that ends in less than{" "}
              </span>
              <Controller
                control={control}
                name="settings.membership_ends_in_days"
                disabled={watcher.settings?.membership_expiry_enabled === false}
                rules={{
                  required: "Required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "positive Numbers only",
                  },
                  min: {
                    value: 1,
                    message: "Value must be at least 1",
                  },
                  max: {
                    value: 365,
                    message: "Value must be 365 or less",
                  },
                }}
                render={({ field }) => (
                  <div className="h-full w-[10%]">
                    <Input className="w-[100%]" {...field} />
                    {errors.settings?.membership_ends_in_days?.message && (
                      <p className="text-red-500 text-xs pt-2">
                        {errors.settings?.membership_ends_in_days.message.toString()}
                      </p>
                    )}
                  </div>
                )}
              />
              days
            </div>
            <Controller
              control={control}
              name="settings.membership_expiry_enabled"
              render={({ field }) => (
                <div className="flex gap-2 h-full justify-center items-center">
                  <>
                    <span
                      className={`text-xs ${watcher.settings?.membership_expiry_enabled ? "text-red-500" : "text-gray-500"}`}
                    >
                      {watcher.settings?.membership_expiry_enabled
                        ? "Deny check-in"
                        : "No Check"}
                    </span>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </>
                </div>
              )}
            />
          </div>
        </div>
      </CustomCollapsible>
    </div>
  );
};

export default HardwareCheckInControlSection;
