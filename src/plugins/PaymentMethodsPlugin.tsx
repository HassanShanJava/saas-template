import { PaymentMethodPlugin } from "@/app/types";
import { IPlugin, PluginStore } from "react-pluggable";

class PaymentMethodsPlugin implements IPlugin {
  namespace = "PaymentMethods";
  pluginStore: PluginStore;
  plugins = [
    {
      id: 1,
      name: "Cash",
      enabled: true
    },
    {
      id: 2,
      name: "Card Payments",
      enabled: false
    },
    {
      id: 3,
      name: "Pay Fast",
      enabled: false
    }
  ]

  getPlugins(): PaymentMethodPlugin[] {
    return this.plugins;
  }

  getPluginName(): string {
    return `${this.namespace}@1.0.0`;
  }

  getDependencies(): string[] {
    return [];
  }

  init(pluginStore: PluginStore) {
    this.pluginStore = pluginStore;
  }

  activate() {
    this.pluginStore.addFunction(`${this.namespace}.getPlugins`, this.getPlugins.bind(this));
  }

  deactivate() {
    this.pluginStore.removeFunction(`${this.namespace}.getPlugins`);
  }
}

export default PaymentMethodsPlugin;
