import {GetServerSideProps} from "next";
import {connectFirebaseAdminAuth} from "../firebase/connect-admin";
import {verifyTokenFromRequest} from "./auth";
import {getFirestore} from "firebase-admin/firestore";
import {RecordParams} from "../../api/export/types";

const auth = connectFirebaseAdminAuth();
export const getRecordFromPath: GetServerSideProps = async (context) => {
    const {decoded} = await verifyTokenFromRequest(auth, context.req)
    const {
        uid,
        collection,
        id,
        tz
        // @ts-expect-error: These are passed to the api. We could validate
        // this better with a yup schema.
    } = context.query as RecordParams;
    if (!(decoded.uid === uid)) {
        throw new Error('uid does not match token')
    }

    const record = await getFirestore().collection(collection).doc(id).get()
    return {
        props: {
            record: JSON.parse(JSON.stringify(record.data())),
            tz,
        }
    };
}

export default getRecordFromPath
