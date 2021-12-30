import {httpClient} from "../../lib/hooks/useHttpClient";


export const makeRateReport = async (token, params) => {
    const client = httpClient(token);

    // get html for report
    const html = await client.get('/rate/export', {
        params,
    })
    // generate pdf from html
    const pdf = await client.post('/api/pdf', {html: html.data}, {
        responseType: "arraybuffer",
    });
    return pdf.data;
};

