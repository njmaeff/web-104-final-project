import {NextApiRequest, NextApiResponse} from "next";
import {chromium} from "playwright"

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
    const pdf = await pdfFromHtmlString(request.body.html)
    response.status(200).send(pdf);
};
