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
interface memberInput {
	query: string,
	org_id: number
}

export const MemberAPi = apiSlice.injectEndpoints({
	endpoints: builder => ({
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
			providesTags: ["Members"],
		}),
		getMemberById: builder.query<MemberInputTypes, number>({
			query: (member_id) => ({
				url: `/member/${member_id}`,
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
		updateMember: builder.mutation<MemberResponseTypes, MemberInputTypes & { id: number }>({
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
		deleteMember: builder.mutation<MemberResponseTypes, number>({
			query: (member_id) => ({
				url: `/member/${member_id}`,
				method: "DELETE",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
			invalidatesTags: ["Members"],
		}),
		getMembersList: builder.query<{ id: number; name: string }[], number>({
			query: (org_id) => ({
				url: `/member/list/${org_id}`,
				headers: {
					Accept: "application/json",
				},
			}),
			providesTags: ["Members"],
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

} = MemberAPi;
