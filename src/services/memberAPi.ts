import {
  CountryTypes,
  BusinessTypes,
  CoachTypes,
  sourceTypes,
  membershipplanTypes,
  MemberInputTypes,
  MemberResponseTypes,
  MemberTabletypes,
} from "../app/types";
import { apiSlice } from "@/features/api/apiSlice";


export const MemberAPi = apiSlice.injectEndpoints({
  endpoints: builder => ({
		getMemberCount: builder.query<{ total_clients: number }, number>({
			query: (org_id) => ({
				url: `/client/getTotalClient/${org_id}`,
				headers: {
					Accept: "application/json",
				},
			}),
		}),
		getCountries: builder.query<CountryTypes[], void>({
			query: () => ({
				url: "/get_all_countries/",
				headers: {
					Accept: "application/json",
				},
			}),
		}),
		getCoaches: builder.query<CoachTypes[], number>({
			query: (org_id) => ({
				url: `/coach/getCoach/${org_id}`,
				headers: {
					Accept: "application/json",
				},
			}),
		}),
		getAllSource: builder.query<sourceTypes[], void>({
			query: () => ({
				url: "/get_all_sources/",
				headers: {
					Accept: "application/json",
				},
			}),
		}),
		getAllBusinesses: builder.query<BusinessTypes[], number>({
			query: (org_id) => ({
				url: `/client/business/${org_id}`,
				headers: {
					Accept: "application/json",
				},
			}),
		}),
		getAllMember: builder.query<MemberTabletypes[], number>({
			query: (org_id) => ({
				url: `/client/filter/?org_id=${org_id}`,
				headers: {
					Accept: "application/json",
				},
			}),
		}),
		AddMember: builder.mutation<MemberResponseTypes, MemberInputTypes>({
			query: (memberdata) => ({
				url: "/client/register",
				method: "POST",
				body: memberdata,
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
  useGetAllMembershipsQuery,
  useGetAllMemberQuery,
  useAddMemberMutation,
} = MemberAPi;
