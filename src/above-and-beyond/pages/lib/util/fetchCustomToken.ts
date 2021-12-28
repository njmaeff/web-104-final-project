import {client} from "../hooks/useHttpClient";
import {auth} from "../firebase/connect-api";

export const fetchCustomToken = async () => {
    const result = await client.post("/api/login",);
    await auth.signInWithCustomToken(result.data.token)
};
