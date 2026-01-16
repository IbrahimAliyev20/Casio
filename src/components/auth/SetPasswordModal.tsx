"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, EyeOff, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSetPasswordMutation } from "@/services/auth/mutations";

interface SetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token?: string;
  email?: string;
  onSuccess?: () => void;
}

export function SetPasswordModal({ open, onOpenChange, token, email, onSuccess }: SetPasswordModalProps) {
  const t = useTranslations("auth.setPassword");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; repeatPassword?: string }>({});
  const [apiError, setApiError] = useState<string>("");
  const setPasswordMutation = useSetPasswordMutation();

  const validatePassword = (value: string): string | undefined => {
    if (value.length < 8) {
      return t("passwordMinLength");
    }
    return undefined;
  };

  const validateRepeatPassword = (value: string): string | undefined => {
    if (value !== password) {
      return t("passwordsDoNotMatch");
    }
    return undefined;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
    if (errors.repeatPassword && value === repeatPassword) {
      setErrors((prev) => ({ ...prev, repeatPassword: undefined }));
    }
  };

  const handleRepeatPasswordChange = (value: string) => {
    setRepeatPassword(value);
    if (errors.repeatPassword) {
      setErrors((prev) => ({ ...prev, repeatPassword: validateRepeatPassword(value) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordError = validatePassword(password);
    const repeatPasswordError = validateRepeatPassword(repeatPassword);

    if (passwordError || repeatPasswordError) {
      setErrors({
        password: passwordError,
        repeatPassword: repeatPasswordError,
      });
      return;
    }

    if (!token) {
      setApiError("Token məlumatı yoxdur. Zəhmət olmasa yenidən cəhd edin.");
      return;
    }

    if (!email) {
      setApiError("Email məlumatı yoxdur. Zəhmət olmasa yenidən cəhd edin.");
      return;
    }

    setApiError("");
    try {
      await setPasswordMutation.mutateAsync({
        token,
        email,
        password,
        password_confirmation: repeatPassword
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to set password:", error);
      setApiError("Şifrə quraşdırılarkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-8 bg-white rounded-[2px]">
        <DialogHeader className="text-left">
          <DialogTitle className="text-2xl font-semibold text-[#14171A] mb-2">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-sm text-text-primary mt-0">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-[#14171A]">
              {t("passwordLabel")}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder={t("passwordPlaceholder")}
                className={`h-12 pr-10 rounded-none border  ${
                  errors.password ? "border-destructive" : "border-[#E5E5E5]"
                } bg-white`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-primary hover:text-[#14171A] transition-colors"
                aria-label={showPassword ? t("hidePassword") : t("showPassword")}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-text-primary">{t("passwordHint")}</p>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="repeatPassword" className="text-sm font-medium text-[#14171A]">
              {t("repeatPasswordLabel")}
            </Label>
            <div className="relative">
              <Input
                id="repeatPassword"
                type={showRepeatPassword ? "text" : "password"}
                value={repeatPassword}
                onChange={(e) => handleRepeatPasswordChange(e.target.value)}
                placeholder={t("repeatPasswordPlaceholder")}
                className={`h-12 pr-10 rounded-none border ${
                  errors.repeatPassword ? "border-destructive" : "border-[#E5E5E5]"
                } bg-white`}
                required
              />
              <button
                type="button"
                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-primary hover:text-[#14171A] transition-colors"
                aria-label={showRepeatPassword ? t("hidePassword") : t("showPassword")}
              >
                {showRepeatPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.repeatPassword && (
              <p className="text-sm text-destructive">{errors.repeatPassword}</p>
            )}
          </div>

          {apiError && (
            <div className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-[2px] border border-red-200">
              {apiError}
            </div>
          )}

          <Button
            type="submit"
            disabled={setPasswordMutation.isPending}
            className="w-full h-12 bg-[#85858C] text-white hover:bg-[#85858C]/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-[2px] font-medium"
          >
            {setPasswordMutation.isPending ? "Şifrə quraşdırılır..." : t("saveButton")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
