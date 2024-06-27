import axios from "axios";
const { VITE_API_URL, VITE_API_URL_two } = import.meta.env;

const client = axios.create({
  baseURL: VITE_API_URL,
});

const clienttwo = axios.create({
  baseURL: VITE_API_URL_two,
});
export async function getFormData(org_id: number) {
  try {
    const [
      coachesResponse,
      sourcesResponse,
      countryResponse,
      businessResponse,
      membershipPlansResponse,
      getClientCount,
    ] = await Promise.all([
      clienttwo.get(`/coach/coaches/${org_id}`, {
        headers: {
          Accept: "application/json",
        },
      }),
      client.get(`get_all_sources/`, {
        headers: {
          Accept: "application/json",
        },
      }),
      client.get(`get_all_countries/`, {
        headers: {
          Accept: "application/json",
        },
      }),
      clienttwo.get(`/client/business/clients/${org_id}`, {
        headers: {
          Accept: "application/json",
        },
      }),
      clienttwo.get(`/membership/get_all_membership_plan/${org_id}`, {
        headers: {
          Accept: "application/json",
        },
      }),
      clienttwo.get(`/client/organization/${org_id}/clients/count`, {
        headers: {
          Accept: "application/json",
        },
      }),
    ]);
    const sources = sourcesResponse.data;
    const coaches = coachesResponse.data;
    const business = businessResponse.data;
    const membershipPlans = membershipPlansResponse.data;
    const countries = countryResponse.data;
    const clientCount = getClientCount.data;

    return {
      coaches,
      business,
      membershipPlans,
      sources,
      countries,
      clientCount
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
