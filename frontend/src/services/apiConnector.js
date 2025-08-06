import axios from "axios";
export const axioInstance = axios.create({});

async function getAuthToken() {
  const token = localStorage.getItem("token");
  if (token) {
    return token;
  }
  return null;
}

export const apiConnector = async (method, url, body, header, params) => {
  let authHeader = header || {};
  const token = await getAuthToken();
  if (token) {
    authHeader = { ...authHeader, Authorization: `Bearer ${token}` };
  }
  return axioInstance({
    method: `${method}`,
    url: `${url}`,
    data: body ? body : null,
    headers: authHeader,
    params: params ? params : null,
  });
};