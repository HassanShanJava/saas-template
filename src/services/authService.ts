import axios from "axios";
const { VITE_API_URL } = import.meta.env;

const client = axios.create({
  baseURL: VITE_API_URL,
});

export async function loginUser(email: string, password: string, persona?: string) {
  return await client.post(
    "login",
    { email, password, persona },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    }
  );
}


export async function getUserResource(role_id: number, token: string) {
  return await client.get(
    `role?role_id=${role_id}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    }
  );
}


export async function closeCounter(counter_id: number, token: string) {
  return await client.put(
    `/pos/counters/${counter_id}`,
    { id: counter_id, is_open: false },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    }
  );
}

