import axios from 'axios';

export const makeRateReport = async (token, params) => {

    // get html for report
    const html = await axios.get('/rate/export', {
        params,
        headers: {
            authorization: 'Bearer ' + token
        },
        baseURL: process.env.NEXT_PUBLIC_WEB_HOST
    })


    // generate pdf from html
    const pdf = await axios.post('/api/pdf', {html: html.data}, {
        headers: {
            authorization: 'Bearer ' + token
        },
        responseType: "arraybuffer",
        baseURL: process.env.NEXT_PUBLIC_WEB_HOST
    });
    return pdf.data;
};
