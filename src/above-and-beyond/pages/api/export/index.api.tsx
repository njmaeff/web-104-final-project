import type {NextApiHandler} from 'next'
import {connectFirebaseAdminAuth} from "../../lib/firebase/connect-admin";
import {getStorage} from "firebase-admin/storage";
import {renderToString} from "@react-pdf/renderer";
import {RateDocumentTemplate} from "./pdfTemplate";
import path from "path";
import JSZip from "jszip";
import axios from "axios";
import {v4 as uuidv4} from 'uuid';

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
    const result = await auth.verifyIdToken(token)
    const {
        uploads,
        type,
        record
    } = req.body as { path: string, type: string, record: any, uploads: { url: string, name: string }[] }

    const storage = getStorage();

    let Template;
    switch (type as "rate" | 'review') {
        case "rate":
            Template = RateDocumentTemplate
            break;

    }
    // noinspection ES6RedundantAwait
    const reportString = await renderToString(<Template record={record}/>)

    const bucket = storage
        .bucket(process.env.NEXT_PUBLIC_STORAGE_BUCKET_URL.replace('gs://', ''))

    const exportsPrefix = path.join('exports', result.uid,
        `${uuidv4()}.zip`
    )

    const jszip = new JSZip();
    jszip.file('report.pdf', reportString);

    const filesResponses = await Promise.all(
        uploads.map(file => axios.get(file.url, {
            responseType: 'arraybuffer'
        }))
    );

    filesResponses.forEach((response, index) => {
        jszip.file(`uploads/${uploads[index].name}`, Buffer.from(response.data))
    });

    const content = await jszip.generateAsync({type: 'nodebuffer'});

    const zipFile = bucket.file(
        exportsPrefix,
    );

    await zipFile.save(content);

    res.status(200).json({
        url: exportsPrefix,
    });
}

export default handler;
