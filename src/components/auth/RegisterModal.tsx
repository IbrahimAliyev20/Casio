"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
import { useSendOtpMutation } from "@/services/auth/mutations";

interface RegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin?: () => void;
  onSuccess?: (email: string) => void;
}

export function RegisterModal({ open, onOpenChange, onSwitchToLogin, onSuccess }: RegisterModalProps) {
  const t = useTranslations("auth.register");
  const [email, setEmail] = useState("");
  const sendOtpMutation = useSendOtpMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendOtpMutation.mutateAsync({ email });
      if (onSuccess) {
        onSuccess(email);
      }
    } catch (error) {
      console.error("Failed to send OTP:", error);
      // Error will be handled by the mutation's error state
    }
  };

  const handleLoginClick = () => {
    onOpenChange(false);
    if (onSwitchToLogin) {
      onSwitchToLogin();
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
            <Label htmlFor="register-email" className="text-sm font-medium text-[#14171A]">
              {t("emailLabel")}
            </Label>
            <Input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="h-12 rounded-none border border-[#E5E5E5] bg-white"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={sendOtpMutation.isPending}
            className="w-full h-12 bg-[#85858C] text-white hover:bg-[#85858C]/90 rounded-[2px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendOtpMutation.isPending ? "Göndərilir..." : t("continueButton")}
          </Button>

          <div className="text-center text-sm text-text-primary">
            {t("hasAccount")}{" "}
            <button
              type="button"
              onClick={handleLoginClick}
              className="text-[#14171A] hover:underline font-medium"
            >
              {t("loginLink")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
