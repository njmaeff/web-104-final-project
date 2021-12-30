import axios from 'axios';


export const makeRateReport = async (token, params) => {
    const html = await axios.get('/rate/export', {
        params,
        headers: {
            authorization: 'Bearer ' + token
        },
        baseURL: process.env.NEXT_PUBLIC_WEB_HOST
    })

    const pdf = await axios.post('http://localhost:3001/api/html', {html: html.data}, {
        headers: {
            authorization: 'Bearer ' + token
        },
        responseType: "arraybuffer"
    });
    return pdf.data;
};
