import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { postLogin, postLogout, sendOtp, verifyOtp, setPassword, ChangePassword, sendForgotMail, verifyForgotMail, resetPassword } from "./api";
import { LoginResponse, ApiResponse } from "@/types";
import { toastUtils } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface LoginVariables {
  email: string;
  password: string;
  rememberMe?: boolean;
}

const TOKEN_KEY = "access_token";

export const useLoginMutation = () => {
  const t = useTranslations("toast.auth");

  return useMutation<LoginResponse, Error, LoginVariables>({
    mutationFn: ({ email, password }) => postLogin(email, password),
    onSuccess: (data, variables) => {
      if (data.token) {
        Cookies.set(TOKEN_KEY, data.token, {
          expires: variables.rememberMe ? 30 : 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        toastUtils.success(t("loginSuccess"));
      }
    },
    onError: () => {
      toastUtils.error(t("loginError"));
    },
  });
};

export const useLogoutMutation = () => {
  const t = useTranslations("toast.auth");

  return useMutation<ApiResponse<LoginResponse>, Error, void>({
    mutationFn: () => postLogout(),
    onSuccess: () => {
      Cookies.remove(TOKEN_KEY);
      Cookies.remove(TOKEN_KEY, { path: "/" });
      toastUtils.success(t("logoutSuccess"));
    },
    onError: () => {
      Cookies.remove(TOKEN_KEY);
      Cookies.remove(TOKEN_KEY, { path: "/" });
      toastUtils.success(t("logoutSuccess"));
    },
  });
};

export const useSendOtpMutation = () => {
  const t = useTranslations("toast.auth");

  return useMutation<ApiResponse<LoginResponse>, Error, { email: string }>({
    mutationFn: ({ email }) => sendOtp(email),
    onSuccess: () => {
      toastUtils.success(t("otpSent"));
    },
    onError: () => {
      toastUtils.error(t("registerError"));
    },
  });
};

export const useVerifyOtpMutation = () => {
  const t = useTranslations("toast.auth");

  return useMutation<ApiResponse<LoginResponse>, Error, { email: string, code: string }>({
    mutationFn: ({ email, code }) => verifyOtp(email, code),
    onSuccess: () => {
      toastUtils.success(t("otpVerified"));
    },
    onError: () => {
      toastUtils.error(t("otpError"));
    },
  });
};

export const useSetPasswordMutation = () => {
  const t = useTranslations("toast.auth");

  return useMutation<ApiResponse<LoginResponse>, Error, { token: string, email: string, password: string, password_confirmation: string }>({
    mutationFn: ({ token, email, password, password_confirmation }) => setPassword(token, email, password, password_confirmation),
    onSuccess: () => {
      toastUtils.success(t("passwordSet"));
    },
    onError: () => {
      toastUtils.error(t("registerError"));
    },
  });
};
export const useChangePasswordMutation = () => {
  const t = useTranslations("toast.auth");

  return useMutation<ApiResponse<LoginResponse>, Error, { old_password: string, password: string, password_confirmation: string }>({
    mutationFn: ({ old_password, password, password_confirmation }) => ChangePassword(old_password, password, password_confirmation),
    onSuccess: () => {
      toastUtils.success(t("passwordChanged"));
    },
    onError: () => {
      toastUtils.error(t("registerError"));
    },
  });
};

export const useSendForgetMailMutation = () => {
  const t = useTranslations("toast.auth");

  return useMutation<ApiResponse<LoginResponse>, Error, { email: string }>({
    mutationFn: ({ email }) => sendForgotMail(email),
    onSuccess: () => {
      toastUtils.success(t("forgotMailSent"));
    },
    onError: () => {
      toastUtils.error(t("registerError"));
    },
  });
};

export const useVerifyForgetMailMutation = () => {
  const t = useTranslations("toast.auth");

  return useMutation<ApiResponse<LoginResponse>, Error, { email: string, code: string }>({
    mutationFn: ({ email, code }) => verifyForgotMail(email, code),
    onSuccess: () => {
      toastUtils.success(t("otpVerified"));
    },
    onError: () => {
      toastUtils.error(t("otpError"));
    },
  });
};

export const useResetPasswordMutation = () => {
  const t = useTranslations("toast.auth");

  return useMutation<ApiResponse<LoginResponse>, Error, { email: string; password: string; password_confirmation: string; token: string }>({
    mutationFn: ({ email, password, password_confirmation, token }) =>
      resetPassword(email, password, password_confirmation, token),
    onSuccess: () => {
      toastUtils.success(t("passwordReset"));
    },
    onError: () => {
      toastUtils.error(t("registerError"));
    },
  });
};