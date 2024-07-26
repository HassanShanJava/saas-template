import {
  CountryTypes,
  BusinessTypes,
  CoachTypes,
  sourceTypes,
  MemberInputTypes,
  MemberResponseTypes,
  MemberTabletypes,
  deleteMemberTypes,
} from "../app/types";
import { apiSlice } from "@/features/api/apiSlice";





export const MemberAPi = apiSlice.injectEndpoints({
  endpoints: builder => ({
		getMemberCount: builder.query<{ total_clients: number }, number>({
			query: (org_id) => ({
				url: `/member/getTotalMembers?org_id=${org_id}`,
				method:"GET",
				headers: {
					Accept: "application/json",
				},
			}),
		}),
		getCountries: builder.query<CountryTypes[], void>({
			query: () => ({
				url: "/get_all_countries/",
				method:"GET",
				headers: {
					Accept: "application/json",
				},
			}),
		}),
		getCoaches: builder.query<CoachTypes[], number>({
			query: (org_id) => ({
				url: `/coach/coaches?org_id=${org_id}`,
				method:"GET",
				headers: {	
					Accept: "application/json",
				},
			}),
		}),
		getAllSource: builder.query<sourceTypes[], void>({
			query: () => ({
				url: "/get_all_sources/",
				method:"GET",
				headers: {
					Accept: "application/json",
				},
			}),
		}),
		getAllBusinesses: builder.query<BusinessTypes[], number>({
			query: (org_id) => ({
				url: `/member/business?org_id=${org_id}`,
				method:"GET",
				headers: {
					Accept: "application/json",
				},
			}),
		}),
		getAllMember: builder.query<MemberTabletypes[], number>({
			query: (org_id) => ({
				url: `/member/filter?org_id=${org_id}`,
				method:"GET",
				headers: {
					Accept: "application/json",
				},
			}),
		}),
		getMemberById: builder.query<MemberInputTypes, number>({
			query: (member_id) => ({
				url: `/member/members?client_id=${member_id}`,
				method:"GET",
				headers: {
					Accept: "application/json",
				},
			}),
		}),
		AddMember: builder.mutation<MemberResponseTypes, MemberInputTypes>({
			query: (memberdata) => ({
				url: "/member/register",
				method: "POST",
				body: memberdata,
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
		}),
		updateMember: builder.mutation<MemberResponseTypes, MemberInputTypes & {id:number}>({
			query: (memberdata) => ({
				url: `/member/members`,
				method: "PUT",
				body: memberdata,
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
		}),
		deleteMember: builder.mutation<MemberResponseTypes, deleteMemberTypes>({
			query: (member_id) => ({
				url: `/member/members`,
				method: "DELETE",
				body:member_id,
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
		}),
  }),
});

export const {
  useGetMemberCountQuery,
  useGetCountriesQuery,
  useGetCoachesQuery,
  useGetAllSourceQuery,
  useGetAllBusinessesQuery,
  useGetAllMemberQuery,
  useGetMemberByIdQuery,
  useAddMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,

} = MemberAPi;
