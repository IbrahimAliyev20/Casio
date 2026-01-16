"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin?: () => void;
}

export function SuccessModal({ open, onOpenChange, onLogin }: SuccessModalProps) {
  const t = useTranslations("auth.success");

  const handleLogin = () => {
    onOpenChange(false);
    if (onLogin) {
      onLogin();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-8 bg-white rounded-[2px]">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full border-2 border-[#14171A] flex items-center justify-center">
              <Check className="w-8 h-8 text-[#14171A]" strokeWidth={3} />
            </div>
          </div>

          <DialogTitle className="text-2xl font-semibold text-[#14171A] mb-2 text-center">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-sm text-text-primary mt-0 text-center">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <Button
            onClick={handleLogin}
            className="w-full h-12 bg-[#14171A] text-white hover:bg-[#14171A]/90 rounded-[2px] font-medium"
          >
            {t("loginButton")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
