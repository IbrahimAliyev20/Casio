"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useVerifyOtpMutation, useVerifyForgetMailMutation } from "@/services/auth/mutations";
import { ApiResponse, LoginResponse } from "@/types";

interface OTPModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email?: string;
  onSuccess?: (token: string) => void;
  onResend?: () => void;
  type?: "register" | "forgotPassword";
}

export function OTPModal({ open, onOpenChange, email, onSuccess, onResend, type = "register" }: OTPModalProps) {
  const t = useTranslations("auth.otp");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState<string>("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const verifyOtpMutation = useVerifyOtpMutation();
  const verifyForgetMailMutation = useVerifyForgetMailMutation();
  const activeMutation = type === "forgotPassword" ? verifyForgetMailMutation : verifyOtpMutation;

  useEffect(() => {
    if (!open || timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, timer]);

  useEffect(() => {
    if (open) {
      setOtp(Array(6).fill(""));
      setTimer(59);
      setCanResend(false);
      setError("");
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [open]);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) {
      return;
    }

    if (error) {
      setError("");
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    const digits = pastedData.replace(/\D/g, "").slice(0, 6).split("");

    if (digits.length === 6) {
      const newOtp = [...otp];
      digits.forEach((digit, index) => {
        newOtp[index] = digit;
      });
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length === 6 && email) {
      setError("");
      try {
        const response = await activeMutation.mutateAsync({ email, code: otpString });

        const token = (response as ApiResponse<LoginResponse> & { token?: string }).token || response.data?.token;
        if (onSuccess && token) {
          onSuccess(token);
        } else {
          setError("OTP doğrulandı ancaq token tapılmadı. Zəhmət olmasa yenidən cəhd edin.");
        }
      } catch (error) {
        console.error("Failed to verify OTP:", error);
        setError("OTP kod yanlışdır. Zəhmət olmasa yenidən yoxlayın.");
      }
    }
  };

  const handleResend = () => {
    if (canResend && onResend) {
      setTimer(59);
      setCanResend(false);
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
      onResend();
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={cn(
                  "h-10 w-10 text-center text-xl font-semibold rounded-none border border-[#E5E5E5] bg-white",
                  "focus:border-[#14171A] focus:outline-none focus:ring-0",
                  "transition-colors"
                )}
                required
              />
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm text-[#14171A] font-medium">{formatTimer(timer)}</p>
          </div>

          <div className="text-center text-sm text-text-primary">
            {t("didntReceive")}{" "}
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="text-[#14171A] hover:underline font-medium"
              >
                {t("resend")}
              </button>
            ) : (
              <span className="text-text-primary">{t("resend")}</span>
            )}
          </div>

          {error && (
            <div className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-[2px] border border-red-200">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={otp.join("").length !== 6 || activeMutation.isPending}
            className="w-full h-12 bg-[#85858C] text-white hover:bg-[#85858C]/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-[2px] font-medium"
          >
            {activeMutation.isPending ? "Doğrulandı..." : t("confirmButton")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
