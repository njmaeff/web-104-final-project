import type {NextApiHandler} from 'next'
import {connectFirebaseAdminAuth} from "../../lib/firebase/connect-admin";
import {getStorage} from "firebase-admin/storage";
import {makeRateReport} from "./pdfTemplate";
import path from "path";
import JSZip from "jszip";
import axios from "axios";
import {v4 as uuidv4} from 'uuid';
import {verifyTokenFromRequest} from "../../lib/util/auth";
import {ExportBody} from "./types";

const auth = connectFirebaseAdminAuth();

export type Data = {
    url: string
}
export const handler: NextApiHandler<Data> = async (req, res) => {

    const {token, decoded: result} = await verifyTokenFromRequest(auth, req)

    const {
        uploads,
        type,
        ...reportParams
    } = req.body as ExportBody

    const storage = getStorage();

    let reportGenerator;
    switch (type as "rate" | 'review') {
        case "rate":
            reportGenerator = makeRateReport
            break;

    }
    const reportBuffer = await reportGenerator(token, reportParams)
    const bucket = storage
        .bucket(process.env.NEXT_PUBLIC_STORAGE_BUCKET_URL.replace('gs://', ''))

    const exportsPrefix = path.join('exports', result.uid,
        `${uuidv4()}.zip`
    )

    const jszip = new JSZip();
    jszip.file('report.pdf', reportBuffer);

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
