import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { usePluginStore } from "react-pluggable";
import { toast } from "../../ui/use-toast";
import { PaymentMethodPlugin } from "@/app/types";
import { useUpdatePaymentMethodMutation } from "@/services/paymentMethodsApi";

const PaymentMethods = () => {
  const [updatingPluginId, setUpdatingPluginId] = useState<number | null>(null);

  const payments = (() => {
    try {
      return (
        JSON.parse(localStorage.getItem("accessLevels") as string).payment ??
        "no_access"
      );
    } catch {
      return "no_access";
    }
  })();
  const pluginStore = usePluginStore();
  const [plugins, setPlugins] = useState<PaymentMethodPlugin[]>();
  const [updatePaymentMethod, { isLoading: pluginUpdateLoader }] =
    useUpdatePaymentMethodMutation();

  useEffect(() => {
    (async () =>
      setPlugins(
        await pluginStore.executeFunction(`PaymentMethods.getPlugins`)
      ))();
  }, [pluginStore]);

  async function handlePluginChange(
    id: number,
    payment_method_id: number,
    enabled: boolean
  ) {
    setUpdatingPluginId(id); // Set loading for the current plugin
    if (!plugins) return;

    if (!enabled) {
      const pluginsEnabled = plugins.reduce(
        (sum, plug) => (plug.status ? sum + 1 : sum),
        0
      );
      if (pluginsEnabled <= 1) {
        toast({
          variant: "destructive",
          description: "Atleast one payment method is required",
        });
        return;
      }
    }

    const resp = await updatePaymentMethod({
      id,
      data: { payment_method_id, status: enabled },
    });
    setUpdatingPluginId(null); // Set loading for the current plugin
    if (resp.error) {
      toast({
        variant: "destructive",
        title: "Failed to update payment method",
      });
      console.error(resp.error);
      return;
    }

    setPlugins(
      (plugins) =>
        plugins &&
        plugins.map((plugin) =>
          plugin.id === id ? { ...plugin, status: enabled } : plugin
        )
    );
  }

  return (
    <div className="w-full p-5">
      <Card className="space-y-2 px-5 py-4">
        <h1 className="font-semibold text-xl">Payment Methods</h1>
        <Separator />
        {plugins &&
          plugins.map((plugin) => (
            <div className="w-full flex justify-between items-center bg-secondary py-3 px-5 rounded-2xl">
              <Label htmlFor={"" + plugin.id}>{plugin.name}</Label>
              <div className="flex gap-2 justify-center items-center">
                {updatingPluginId === plugin.id && (
                  <div>
                    <svg
                      aria-hidden="true"
                      className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-primary"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                )}{" "}
                <Switch
                  disabled={payments == "read" || pluginUpdateLoader}
                  id={"" + plugin.id}
                  checked={plugin.status}
                  onCheckedChange={(enabled) =>
                    handlePluginChange(
                      plugin.id,
                      plugin.payment_method_id,
                      enabled
                    )
                  }
                />
              </div>
            </div>
          ))}

        <div className="pt-10">
          <p className="text-gray-400 text-center">
            For more payment method options <br /> you can search and install a
            plugin from{" "}
            <a className="text-blue-500 underline hover:text-blue-700">
              FitnFi Marketplace
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PaymentMethods;
