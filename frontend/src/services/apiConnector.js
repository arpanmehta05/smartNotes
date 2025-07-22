import axios from 'axios';
export const axioInstance = axios.create({});

export const apiConnector = async (method,url,body,header,params) => {
    return axioInstance({
        method: `${method}`,
        url: `${url}`,
        data: body? body : null,
        headers: header? header : null,
        params: params? params : null
    })
}