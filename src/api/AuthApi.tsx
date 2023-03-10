import apiClient from "./ClientApi";

interface iSignup {
  email: string;
  password: string;
  name: string;
}
const signUpUser = async (data: iSignup) => {
  const { email, password, name } = data;
  console.log("signUpUser");
  return apiClient.post("/auth/register", {
    email,
    password,
    name,
  });
};

interface iSigin {
  email: string;
  password: string;
}
const signInUser = async (data: iSigin) => {
  const { email, password } = data;
  return apiClient.post(`/auth/login`, { email, password });
};

const logoutUser = async (token: string) => {
  return apiClient.get(`/auth/logout`, {
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

export interface iGoogleSign {
  email: string;
  name: string;
  avatar: string;
}
const googleSignUser = async (data: iGoogleSign) => {
  const { avatar, email, name } = data;
  return apiClient.post(`/auth/google-sign-user`, { avatar, email, name });
};

export default {
  logoutUser,
  signInUser,
  signUpUser,
  fetchUserInfo,
  googleSignUser,
};
