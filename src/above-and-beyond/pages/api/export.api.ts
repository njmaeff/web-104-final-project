import type {NextApiHandler} from 'next'
import {connectFirebaseAdminAuth} from "../lib/firebase/connect-admin";

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
    url: string
}

export const handler: NextApiHandler<Data> = async (req, res) => {
    const token = parseAuthorization(req.headers.authorization);
    await auth.verifyIdToken(token)

    res.status(200).json({url: ''})
}

export default handler;
