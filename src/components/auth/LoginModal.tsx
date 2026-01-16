"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useLoginMutation } from "@/services/auth/mutations";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToRegister?: () => void;
  onSwitchToForgotPassword?: () => void;
  onLoginSuccess?: () => void;
}

export function LoginModal({ open, onOpenChange, onSwitchToRegister, onSwitchToForgotPassword, onLoginSuccess }: LoginModalProps) {
  const t = useTranslations("auth.login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await loginMutation.mutateAsync({ email, password, rememberMe });
      onOpenChange(false);
      setEmail("");
      setPassword("");
      setRememberMe(false);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleRegisterClick = () => {
    onOpenChange(false);
    if (onSwitchToRegister) {
      onSwitchToRegister();
    }
  };

  const handleForgotPasswordClick = () => {
    onOpenChange(false);
    if (onSwitchToForgotPassword) {
      onSwitchToForgotPassword();
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
            <Label htmlFor="email" className="text-sm font-medium text-[#14171A]">
              {t("emailLabel")}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="h-12 rounded-none border border-[#E5E5E5] bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-[#14171A]">
              {t("passwordLabel")}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("passwordPlaceholder")}
                className="h-12 pr-10 rounded-none border border-[#E5E5E5] bg-white"
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
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="rounded-[2px]"
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm text-[#14171A] cursor-pointer font-normal"
              >
                {t("rememberMe")}
              </Label>
            </div>
            <button
              type="button"
              onClick={handleForgotPasswordClick}
              className="text-sm text-[#14171A] hover:underline"
            >
              {t("forgotPassword")}
            </button>
          </div>

          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full h-12 bg-[#85858C] text-white hover:bg-[#85858C]/90 rounded-[2px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? t("loggingIn") || "Logging in..." : t("submitButton")}
          </Button>

          {loginMutation.isError && (
            <div className="text-sm text-red-600 text-center">
              {loginMutation.error?.message || t("loginError") || "Login failed. Please try again."}
            </div>
          )}

          <div className="text-center text-sm text-text-primary">
            {t("noAccount")}{" "}
            <button
              type="button"
              onClick={handleRegisterClick}
              className="text-[#14171A] hover:underline font-medium"
            >
              {t("registerLink")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
