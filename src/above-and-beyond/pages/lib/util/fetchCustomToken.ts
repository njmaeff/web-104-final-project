import {client} from "../hooks/useHttpClient";

export const fetchCustomToken = async () => {
    const result = await client.post("/api/login",);
    return result.data.token
};
