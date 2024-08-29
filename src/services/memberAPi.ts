import {
  CountryTypes,
  BusinessTypes,
  CoachTypes,
  sourceTypes,
  MemberInputTypes,
  MemberResponseTypes,
  MemberTabletypes,
  deleteMemberTypes,
  MemberTableResponseDatatypes,
  MemberTableDatatypes,
  MemberTableResponsetypes,
} from "../app/types";
import { apiSlice } from "@/features/api/apiSlice";
interface memberInput {
  query: string;
  org_id: number;
}

export const MemberAPi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMemberCount: builder.query<{ total_members: number }, number>({
      query: (org_id) => ({
        url: `/member/count/${org_id}`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
      providesTags: ["Members"],
    }),
    getCountries: builder.query<CountryTypes[], void>({
      query: () => ({
        url: "/countries",
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
    }),
    getAllSource: builder.query<sourceTypes[], void>({
      query: () => ({
        url: "/sources",
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
    }),
    getAllBusinesses: builder.query<BusinessTypes[], number>({
      query: (org_id) => ({
        url: `/member/business/${org_id}`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
    }),
    getAllMember: builder.query<MemberTabletypes, memberInput>({
      query: (searchCretiria) => ({
        url: `/member?org_id=${searchCretiria.org_id}&${searchCretiria.query}`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
      transformResponse: (
        response: MemberTableResponsetypes
      ): MemberTabletypes => ({
        ...response,
        data: response.data.map((record) => ({
          ...record,
          coaches: record.coaches.map((coach) => ({
            id: coach.id,
            name: coach.coach_name, // Rename 'coach_name' to 'name'
          })),
        })),
      }),
      providesTags: ["Members"],
    }),
    getMemberById: builder.query<MemberInputTypes, {org_id:number,id:number}>({
      query: (member) => ({
        url: `/member/${member.id}??org_id=${member.org_id}`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
      providesTags: ["Members"],
    }),
    AddMember: builder.mutation<MemberResponseTypes, MemberInputTypes>({
      query: (memberdata) => ({
        url: "/member",
        method: "POST",
        body: memberdata,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Members"],
    }),
    updateMember: builder.mutation<
      MemberResponseTypes,
      MemberInputTypes & { id: number }
    >({
      query: (memberdata) => ({
        url: `/member`,
        method: "PUT",
        body: memberdata,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Members"],
    }),
    deleteMember: builder.mutation<MemberResponseTypes, {org_id:number,id:number}>({
      query: (member) => ({
        url: `/member/${member.id}?org_id=${member.org_id}`,
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Members"],
    }),
    getMembersList: builder.query<{ value: number; label: string }[], number>({
      query: (org_id) => ({
        url: `/member/list/${org_id}`,
        headers: {
          Accept: "application/json",
        },
        providesTags: ["Members"],
      }),
      transformResponse: (response: { id: number; name: string }[]) =>
        response.map((item: any) => ({ value: item.id, label: item.name })),
    }),
    getMembersAutoFill: builder.query<MemberTableDatatypes, {org_id:number,email:string}>({
      query: (member) => ({
        url: `/member/${member.email}/?org_id=${member.org_id}`,
        method:"GET",
        headers: {
          Accept: "application/json",
        },
        providesTags: ["Members"],
      }),
    }),
  }),
});

export const {
  useGetMemberCountQuery,
  useGetCountriesQuery,
  useGetAllSourceQuery,
  useGetAllBusinessesQuery,
  useGetAllMemberQuery,
  useGetMembersListQuery,
  useGetMemberByIdQuery,
  useAddMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
  useGetMembersAutoFillQuery,
} = MemberAPi;
