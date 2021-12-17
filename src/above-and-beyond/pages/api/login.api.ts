import type {NextApiHandler} from 'next'
import {connectFirebaseAdminAuth} from "../lib/firebase/connect-admin";
import {createClient} from "../../seed/search";

const auth = connectFirebaseAdminAuth();

export function parseAuthorization(authorization: any) {
    if (typeof authorization === 'string') {
        const [, token] = authorization.split(' ');
        return token;
    } else {
        throw new Error('expecting authorization header string');
    }
}

export type Data = {
    token: string
}
export type Claims = {
    searchKey: string
}

const client = createClient();

export const handler: NextApiHandler<Data> = async (req, res) => {
    const token = parseAuthorization(req.headers.authorization);
    const decoded = await auth.verifyIdToken(token)
    const keys = client.keys();
    const scopedKey = keys.generateScopedSearchKey(process.env.SEARCH_ONLY_API_KEY, {
        'filter_by': `userID:${decoded.uid}`,
        'expires_at': decoded.exp
    })
    const customToken = await auth.createCustomToken(decoded.uid, {searchKey: scopedKey} as Claims)
    res.status(200).json({token: customToken})
}

export default handler;
