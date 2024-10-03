import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { usePluginStore } from "react-pluggable";
import { toast } from "../../ui/use-toast";


const PaymentMethods = () => {
  const pluginStore = usePluginStore();
  const [plugins,setPlugins] = useState(pluginStore.executeFunction(`PaymentMethods.getPlugins`));

  function handlePluginChange(id: number, enabled: boolean) {
    if (!enabled) {
      const pluginsEnabled = plugins.reduce((sum, plug) => plug.enabled ? sum + 1 : sum, 0);
      if (pluginsEnabled <= 1) {
        toast({
          variant: "destructive",
          description: "Atleast one payment method is required",
        });
        return;
      }
    }
    // Todo: call a mutation to change the plugin on the server
    setPlugins(plugins => plugins.map(plugin => plugin.id === id ? {...plugin, enabled} : plugin));
  }

  return (
    <div className="w-full p-5">
      <Card className="space-y-5 p-10">
        <h1 className="font-semibold text-xl">Payment Methods</h1>
        <Separator />
        {plugins.map(plugin => (
          <div className="w-full flex justify-between bg-secondary p-5 rounded-2xl">
            <Label htmlFor={""+plugin.id}>{plugin.name}</Label> 
            <Switch id={""+plugin.id} checked={plugin.enabled} onCheckedChange={enabled => handlePluginChange(plugin.id, enabled)} /> 
          </div>
        ))} 

        <p className="text-gray-400 text-center">For more payment method options you can search and install a plugin from <a className="text-blue-500 underline hover:text-blue-700">FitnFi Marketplace</a></p>
      </Card>
    </div>
  );
};

export default PaymentMethods;
