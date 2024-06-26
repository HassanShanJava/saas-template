import axios from "axios";
const { VITE_API_URL } = import.meta.env;

const client = axios.create({
  baseURL: VITE_API_URL,
});

export async function getFormData(org_Id: number) {
  try {
    const [coachesResponse, businessResponse, membershipPlansResponse] =
      await Promise.all([
        client.get(`coaches/${org_Id}`, {
          headers: {
            Accept: "application/json",
          },
        }),
        client.get(`get_all_business/${org_Id}`, {
          headers: {
            Accept: "application/json",
          },
        }),
        client.get(`get_all_membership_plan/${org_Id}`, {
          headers: {
            Accept: "application/json",
          },
        }),
      ]);

    const coaches = coachesResponse.data;
    const business = businessResponse.data;
    const membershipPlans = membershipPlansResponse.data;
    console.log(coaches,business,membershipPlans);
    return {
      coaches,
      business,
      membershipPlans,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
