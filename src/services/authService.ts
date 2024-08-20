import axios from "axios";
const { VITE_API_URL } = import.meta.env;

const client = axios.create({
  baseURL: VITE_API_URL,
});

export async function loginUser(email: string, password: string, persona?:string) {
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
