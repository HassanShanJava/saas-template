import store from "@/app/store";
import { PaymentMethodPlugin } from "@/app/types";
import { paymentMethodsResponse } from "@/lib/constants/payment_methods";
import { PaymentMethodsApi } from "@/services/paymentMethodsApi";
import { IPlugin, PluginStore } from "react-pluggable";

class PaymentMethodsPlugin implements IPlugin {
  namespace = "PaymentMethods";
  pluginStore: PluginStore;
  plugins: PaymentMethodPlugin[] = [];

  async getPlugins(): Promise<PaymentMethodPlugin[]> {
    if(this.plugins.length === 0) {
      const promise = store.dispatch(PaymentMethodsApi.endpoints.getAllEnabledPaymentMethods.initiate({}));
      const { refetch } = promise;
      const {data: paymentMethods, error, isLoading} = await promise;
        if (!paymentMethods)
          return []
        this.plugins = paymentMethods;
    }
    return this.plugins
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
