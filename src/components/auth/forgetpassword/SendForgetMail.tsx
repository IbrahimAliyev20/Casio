"use client";

import { useState, useEffect } from "react";
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
import { useSendForgetMailMutation } from "@/services/auth/mutations";

interface SendForgetMailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin?: () => void;
  onSuccess?: (email: string) => void;
}

export default function SendForgetMail({ 
  open, 
  onOpenChange, 
  onSwitchToLogin, 
  onSuccess 
}: SendForgetMailProps) {
  const t = useTranslations("auth.sendForgetMail");
  const [email, setEmail] = useState("");
  const [apiError, setApiError] = useState<string>("");
  const sendForgetMailMutation = useSendForgetMailMutation();

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setEmail("");
      setApiError("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    
    try {
      const response = await sendForgetMailMutation.mutateAsync({ email });
      
      // API response'unu kontrol et
      if (response && (response as { status?: boolean }).status !== false) {
        // Başarılı olduğunda onSuccess callback'ini çağır
        if (onSuccess) {
          onSuccess(email);
        }
      } else {
        // API başarısız response döndürdüyse
        const errorMsg = (response as { message?: string })?.message || 
          "Email göndərilərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.";
        setApiError(errorMsg);
      }
    } catch (error) {
      console.error("Failed to send forgot password email:", error);
      
      // Hata mesajını API response'undan al veya varsayılan mesajı kullan
      let errorMessage = "Email göndərilərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.";
      
      if (error && typeof error === 'object') {
        const apiError = error as { 
          response?: { 
            data?: { 
              message?: string;
              error?: string;
              errors?: {
                email?: string[];
                [key: string]: string[] | undefined;
              };
            } 
          };
          message?: string;
        };
        
        // Validation hatalarını kontrol et (422 hatası için)
        if (apiError?.response?.data?.errors) {
          const errors = apiError.response.data.errors;
          // Email validation hatası varsa göster
          if (errors.email && errors.email.length > 0) {
            const validationKey = errors.email[0];
            // Validation mesajlarını kullanıcı dostu mesajlara çevir
            if (validationKey === "validation.exists") {
              errorMessage = "Bu email adresi sistemdə mövcud deyil.";
            } else if (validationKey === "validation.required") {
              errorMessage = "Email adresi tələb olunur.";
            } else if (validationKey === "validation.email") {
              errorMessage = "Düzgün email adresi daxil edin.";
            } else {
              errorMessage = validationKey;
            }
          } else {
            // Diğer validation hatalarını kontrol et
            const firstError = Object.values(errors)[0];
            if (firstError && firstError.length > 0) {
              const validationKey = firstError[0];
              if (validationKey === "validation.exists") {
                errorMessage = "Bu email adresi sistemdə mövcud deyil.";
              } else {
                errorMessage = validationKey;
              }
            }
          }
        } else {
          // Genel hata mesajı
          errorMessage = 
            apiError?.response?.data?.message ||
            apiError?.response?.data?.error ||
            apiError?.message ||
            errorMessage;
        }
      }
      
      setApiError(errorMessage);
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
            <Label htmlFor="forget-email" className="text-sm font-medium text-[#14171A]">
              {t("emailLabel")}
            </Label>
            <Input
              id="forget-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="h-12 rounded-none border border-[#E5E5E5] bg-white"
              required
            />
          </div>

          {apiError && (
            <div className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-[2px] border border-red-200">
              {apiError}
            </div>
          )}

          <Button
            type="submit"
            disabled={sendForgetMailMutation.isPending}
            className="w-full h-12 bg-[#85858C] text-white hover:bg-[#85858C]/90 rounded-[2px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendForgetMailMutation.isPending ? "Göndərilir..." : t("continueButton")}
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
