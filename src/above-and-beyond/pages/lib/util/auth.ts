import { Auth } from "firebase-admin/lib/auth/auth";

export function parseAuthorization(authorization: any) {
    if (typeof authorization === 'string') {
        const [, token] = authorization.split(' ');
        return token;
    } else {
        throw new Error('expecting authorization header string');
    }
}

export const verifyTokenFromRequest = async (auth: Auth, req) => {
    const token = parseAuthorization(req.headers.authorization);

    return {
        token,
        decoded: await auth.verifyIdToken(token)
    } as const
};
