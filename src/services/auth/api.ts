import { post } from "@/lib/api";
import { ApiResponse, LoginResponse } from "@/types";

const postLogin = async (email: string, password: string) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  const response = await post<LoginResponse>("/login", formData);
  return response;
};

const postLogout = async () => {
  const response = await post<ApiResponse<LoginResponse>>("/logout");
  return response;
};

const changePassword = async (
  oldPassword: string,
  password: string,
  password_confirmation: string
) => {
  const response = await post<ApiResponse<LoginResponse>>("/change-password", {
    oldPassword,
    password,
    password_confirmation,
  });
  return response;
};

const sendOtp = async (email: string) => {
  const response = await post<ApiResponse<LoginResponse>>(
    "/register/send-otp",
    {
      email,
    }
  );
  return response;
};
const verifyOtp = async (email: string, code: string) => {
  const response = await post<ApiResponse<LoginResponse>>(
    "/register/verify-otp",
    {
      email,
      code,
    }
  );
  return response;
};

const setPassword = async (
  token: string,
  email: string,
  password: string,
  password_confirmation: string
) => {
  const response = await post<ApiResponse<LoginResponse>>(
    "/register/complete",
    {
      email,
      password,
      password_confirmation,
      token,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

const ChangePassword = async (
  old_password: string,
  password: string,
  password_confirmation: string
) => {
  const response = await post<ApiResponse<LoginResponse>>("/change-password", {
    old_password,
    password,
    password_confirmation,
  });
  return response;
};

const sendForgotMail = async (email: string) => {
  const response = await post<ApiResponse<LoginResponse>>("/forgot-password", {
    email,
  });
  return response;
};

const verifyForgotMail = async (email: string, code: string) => {
  const response = await post<ApiResponse<LoginResponse>>("/forgot-password/verify-otp", {
    email,
    code,
  });
  return response;
};


const resetPassword = async (email: string, password: string, password_confirmation: string, token: string) => {
  const response = await post<ApiResponse<LoginResponse>>("/reset-password", {
    email,
    password,
    password_confirmation,
    token,
  });
  return response;
};


export {
  postLogin,
  postLogout,
  changePassword,
  sendOtp,
  verifyOtp,
  setPassword,
  ChangePassword,
  sendForgotMail,
  verifyForgotMail,
  resetPassword,
};
