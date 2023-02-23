import apiClient from "./ClientApi";
import { URL_PATHS } from "../utils/constants";

const signUpUser = async (data: {
  email: string;
  password: string;
  name: string;
}) => {
  const { email, password, name } = data;
  return apiClient.post(`/${URL_PATHS.auth}/register`, {
    email,
    password,
    name,
  });
};

const signInUser = async (email: string, password: string) => {
  return apiClient.post(`/${URL_PATHS.auth}/login`, { email, password });
};

const logoutUser = async (token: string) => {
  return apiClient.get(`/${URL_PATHS.auth}/logout`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

const fetchUserInfo = async (accessToken: string) => {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return await response.json();
};

interface iGoogleSign {
  email: string;
  name: string;
}
const googleSignUser = async (data: iGoogleSign) => {
  const { email, name } = data;
  return apiClient.post(`/${URL_PATHS.auth}/google-sign-user`, { email, name });
};

export default {
  logoutUser,
  signInUser,
  signUpUser,
  fetchUserInfo,
  googleSignUser,
};
