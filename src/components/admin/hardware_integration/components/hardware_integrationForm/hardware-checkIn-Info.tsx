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

interface HardwareCheckInInfoProp {
  control: Control<HardwareIntegrationInput>;
  errors: FieldErrors<HardwareIntegrationInput>;
  watch: UseFormWatch<HardwareIntegrationInput>;
}

const HardwareCheckInSection = ({
  control,
  errors,
  watch,
}: HardwareCheckInInfoProp) => {
  const watcher = watch();
  const isOpen =
    watcher.settings?.show_remaining_credits_enabled ||
    watcher.settings?.show_outstanding_invoices_enabled ||
    watcher.settings?.show_end_of_contract_enabled;
  return (
    <div className="h-[30%] w-[95%] rounded-2xl bg-white justify-center items-center flex">
      <CustomCollapsible title="Check-In Info" isOpenDefault={isOpen}>
        <div className="flex flex-col gap-5">
          <div className="shadow-sm rounded-md p-4 border flex flex-col justify-between items-center">
            <div className="flex flex-row justify-between items-center w-full">
              {" "}
              <span className="text-sm">Show remaining credits</span>
              <Controller
                control={control}
                name="settings.show_remaining_credits_enabled"
                render={({ field }) => (
                  <div className="flex gap-2 h-full">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />
            </div>
            {watcher.settings.show_remaining_credits_enabled && (
              <div className="w-full mt-3 ">
                <div className="flex justify-start text-sm items-center gap-3 p-2 border-t">
                  <span className="text-nowrap text-sm">
                    when member has less than
                  </span>
                  <Controller
                    control={control}
                    name="settings.remaining_credits_threshold"
                    rules={{
                      required: "Required",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Numbers only",
                      },
                      min: {
                        value: 1,
                        message: "Value must be at least 1",
                      },
                      max: {
                        value: 1000,
                        message: "Value must be 1000 or less",
                      },
                    }}
                    render={({ field }) => (
                      <div className="h-full w-[10%]">
                        <Input className="w-[100%]" {...field} />
                        {errors.settings?.remaining_credits_threshold
                          ?.message && (
                          <p className="text-red-500 text-xs pt-2">
                            {errors.settings?.remaining_credits_threshold.message.toString()}
                          </p>
                        )}
                      </div>
                    )}
                  />
                  credits left
                </div>
              </div>
            )}
          </div>

          <div className="shadow-sm rounded-md p-4 border flex flex-col justify-between items-center">
            <div className="flex flex-row justify-between items-center w-full">
              {" "}
              <span className="text-sm">Show outstanding invoices</span>
              <Controller
                control={control}
                name="settings.show_outstanding_invoices_enabled"
                render={({ field }) => (
                  <div className="flex gap-2 h-full">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />
            </div>
            {watcher.settings.show_outstanding_invoices_enabled && (
              <div className="w-full mt-3 ">
                <div className="flex justify-start text-sm items-center gap-3 p-2 border-t">
                  <span className="text-nowrap text-sm">
                    when invoice is older than
                  </span>
                  <Controller
                    control={control}
                    name="settings.outstanding_invoice_days"
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
                        {errors.settings?.outstanding_invoice_days?.message && (
                          <p className="text-red-500 text-xs pt-2">
                            {errors.settings?.outstanding_invoice_days.message.toString()}
                          </p>
                        )}
                      </div>
                    )}
                  />
                  days
                </div>
              </div>
            )}
          </div>

          <div className="shadow-sm rounded-md p-4 border flex flex-col justify-between items-center">
            <div className="flex flex-row justify-between items-center w-full">
              {" "}
              <span className="text-sm">Show end of contract</span>
              <Controller
                control={control}
                name="settings.show_end_of_contract_enabled"
                render={({ field }) => (
                  <div className="flex gap-2 h-full">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />
            </div>
            {watcher.settings.show_end_of_contract_enabled && (
              <div className="w-full mt-3 ">
                <div className="flex justify-start text-sm items-center gap-3 p-2 border-t">
                  <span className="text-nowrap text-sm">
                    when contract end date is less than
                  </span>
                  <Controller
                    control={control}
                    name="settings.end_of_contract_days"
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
                        {errors.settings?.end_of_contract_days?.message && (
                          <p className="text-red-500 text-xs pt-2">
                            {errors.settings?.end_of_contract_days.message.toString()}
                          </p>
                        )}
                      </div>
                    )}
                  />
                  days
                </div>
              </div>
            )}
          </div>
        </div>
      </CustomCollapsible>
    </div>
  );
};

export default HardwareCheckInSection;
