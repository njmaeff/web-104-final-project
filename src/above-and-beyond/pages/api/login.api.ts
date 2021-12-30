import type {NextApiHandler} from 'next'
import {connectFirebaseAdminAuth} from "../lib/firebase/connect-admin";
import {createClient} from "../../seed/search";
import {verifyTokenFromRequest} from "../lib/util/auth";

const auth = connectFirebaseAdminAuth();

export type Data = {
    token: string
}

const client = createClient();

export const handler: NextApiHandler<Data> = async (req, res) => {
    const {decoded} = await verifyTokenFromRequest(auth, req)
    const keys = client.keys();
    const scopedKey = keys.generateScopedSearchKey(process.env.SEARCH_ONLY_API_KEY, {
        'filter_by': `userID:${decoded.uid}`,
        'expires_at': decoded.exp
    })
    res.status(200).json({token: scopedKey})
}

export default handler;
