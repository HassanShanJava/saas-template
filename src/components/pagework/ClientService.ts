import axios, { AxiosResponse } from "axios";
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

    const totalClients =
      clientCount && clientCount.total_clients;
    const newClientId = `ext-${totalClients + 1}`;
    return {
      coaches,
      business,
      membershipPlans,
      sources,
      countries,
      clientCount,
      newClientId
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}



export async function SubmitForm(formData: any): Promise<any> {
  try {
    const now = new Date();

    // Default values for postData
    const postData: any = {
      profile_img: null,
      own_member_id: "",
      first_name: "",
      last_name: "",
      gender: "",
      dob: "", // Adjust as necessary based on actual date format
      email: "",
      phone: null,
      mobile_number: null,
      notes: null,
      source_id: null,
      language: null,
      is_business: false,
      business_id: null,
      country_id: null,
      city: null,
      zipcode: null,
      address_1: null,
      address_2: null,
      client_since: null,
      created_at:  now.toISOString(),
      created_by: 1,
      org_id: 4,
      coach_id: 0,
      membership_id: 0,
      status: "",
      send_invitation:null,
    };

    // Manipulate dob field to ensure only date part is sent
    if (formData.dob) {
      const dobDate = new Date(formData.dob);
      dobDate.setUTCHours(0, 0, 0, 0); // Set time to midnight UTC
      postData.dob = dobDate.toISOString().split("T")[0]; // Extract date part only
    }

    if (formData.country_id ){
      const id = Number(formData.country_id);
      postData.country_id=id;
    }

    if (formData.source_id){
      const id = Number(formData.source_id);
      postData.source_id=id;
    }

    if (formData.membership_id) {
        const id = Number(formData.membership_id);
        postData.membership_id = id;
      }

    
    // Assign other values from formData to postData if provided
    Object.keys(formData).forEach((key) => {
        const typedKey = key as keyof typeof postData;
        if (
          typedKey !== "dob" &&
          typedKey !== "country_id" &&
          typedKey !== "source_id" &&
          typedKey !== "membership_id" &&
          formData[typedKey] !== undefined
        ) {
          postData[typedKey] = formData[typedKey];
        }
      });

    // Send POST request using clienttwo.post (adjust this part based on your actual HTTP client)
    const response: AxiosResponse<any> = await clienttwo.post(
      "/client/register/client",
      postData,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`data ${postData}`)
    return response.data; // Return the response data if successful
  } catch (error) {
    console.error("API call error:", error);
    throw error; // Re-throw the error to handle it further if needed
  }
}

