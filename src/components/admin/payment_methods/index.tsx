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
  const pluginStore = usePluginStore();
  const [plugins, setPlugins] = useState<PaymentMethodPlugin[]>();
  const [updatePaymentMethod] = useUpdatePaymentMethodMutation();

  useEffect(() => {
    (async () => 
      setPlugins(await pluginStore.executeFunction(`PaymentMethods.getPlugins`))
    )();
  }, [pluginStore]);

  async function handlePluginChange(id: number, payment_method_id: number, enabled: boolean) {
    if (!plugins)
      return 
    if (!enabled) {
      const pluginsEnabled = plugins.reduce((sum, plug) => plug.status ? sum + 1 : sum, 0);
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
    })
    if (resp.error) {
      toast({
          variant: "destructive",
          title: "Failed to update payment method",
      });
      console.error(resp.error);
      return
    }

    setPlugins(plugins => plugins && plugins.map(plugin => plugin.id === id ? { ...plugin, status: enabled } : plugin));
  }

  return (
    <div className="w-full p-5">
      <Card className="space-y-2 px-5 py-4">
        <h1 className="font-semibold text-xl">Payment Methods</h1>
        <Separator />
        {plugins && plugins.map(plugin => (
          <div className="w-full flex justify-between items-center bg-secondary py-3 px-5 rounded-2xl">
            <Label htmlFor={"" + plugin.id}>{plugin.name}</Label>
            <Switch id={"" + plugin.id} checked={plugin.status} onCheckedChange={enabled => handlePluginChange(plugin.id, plugin.payment_method_id, enabled)} />
          </div>
        ))}

        <div className="pt-10">
          <p className="text-gray-400 text-center">For more payment method options <br/> you can search and install a plugin from <a className="text-blue-500 underline hover:text-blue-700">FitnFi Marketplace</a></p>
        </div>
      </Card>
    </div>
  );
};

export default PaymentMethods;
