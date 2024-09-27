import { resourceTypes } from "@/app/types";
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
        "Authorization": `Bearer ${token}`
      },
    }
  );
}
