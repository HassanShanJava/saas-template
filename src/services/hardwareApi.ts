import { hardwareIntegrationInput } from "@/app/types";
import {
  HardwareIntegrationInput,
  HardwareIntegrationRow,
  HardwareTable,
} from "@/app/types/hardware-integration";
import { apiSlice } from "@/features/api/apiSlice";

interface HardwareQuery {
  query: string;
  org_id: number;
}

interface ResponseModal {
  status_code: number;
  id: number;
  message: string;
}

interface updateResponse {
  status: number;
  detail: string;
}
export const Foods = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      getAllHardware: builder.query<HardwareTable, HardwareQuery>({
        query: (searchCretiria) => ({
          url: `/hardware?${searchCretiria.query}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          providesTags: ["Hardware"],
        }),
      }),
      addHardware: builder.mutation<ResponseModal, HardwareIntegrationInput>({
        query: (hardwareData) => ({
          url: `/hardware`,
          method: "POST",
          body: hardwareData,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
        invalidatesTags: ["Hardware"],
      }),
      updateHardware: builder.mutation<
        updateResponse,
        HardwareIntegrationRow & { id: number }
      >({
        query: ({ id, ...hardwaredata }) => ({
          url: `/hardware/${id}`,
          method: "PUT",
          body: hardwaredata,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
        invalidatesTags: ["Hardware"],
      }),
      deleteHardware: builder.mutation<updateResponse, number>({
        query: (hardware_id) => ({
          url: `/hardware/${hardware_id}`,
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Hardware"],
      }),
      getHardwareById: builder.query<HardwareIntegrationRow, number>({
        query: (hardware_id) => ({
          url: `/hardware/${hardware_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Hardware"],
      }),
    };
  },
});

export const {
  useGetHardwareByIdQuery,
  useGetAllHardwareQuery,
  useAddHardwareMutation,
  useUpdateHardwareMutation,
  useDeleteHardwareMutation,
} = Foods;
