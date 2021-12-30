import {NextApiRequest, NextApiResponse} from "next";
import {chromium} from "playwright"
import {verifyTokenFromRequest} from "../../lib/util/auth";
import {connectFirebaseAdminAuth} from "../../lib/firebase/connect-admin";

const auth = connectFirebaseAdminAuth();

export const pdfFromHtmlString = async (html: string) => {
    const browser = await chromium.launch()
    const page = await browser.newPage()
    await page.emulateMedia({media: 'screen'})
    await page.setContent(html)
    const result = await page.pdf({
        format: "Letter",
        margin: {
            top: '100px',
            bottom: '40px'
        },
    })
    await browser.close()
    return result
};

export default async (request: NextApiRequest, response: NextApiResponse) => {
    await verifyTokenFromRequest(auth, request)
    const pdf = await pdfFromHtmlString(request.body.html)
    response.status(200).send(pdf);
};
