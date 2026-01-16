"use client";

import  { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useChangePasswordMutation } from "@/services/auth/mutations";
import { useUpdateUserProfileMutation } from "@/services/user/mutations";
import { getUserProfileQuery } from "@/services/user/queries";

export default function PersonalInfo() {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [phoneData, setPhoneData] = useState({
    phoneNumber: "",
  });

  const [profileData, setProfileData] = useState({
    email: "",
    name: "",
  });

  const changePasswordMutation = useChangePasswordMutation();
  const updateProfileMutation = useUpdateUserProfileMutation();

  // Get user profile data
  const { data: userProfile } = useQuery(getUserProfileQuery());

  // Fill form data when user profile is loaded
  useEffect(() => {
    if (userProfile?.data) {
      const { name, email, phone } = userProfile.data;

      // Set profile data
      setProfileData({
        name: name || "",
        email: email || "",
      });

      // Parse phone number and set phone data
      if (phone) {
        // Extract phone number (remove +994 prefix if exists)
        const phoneNumber = phone.replace(/^\+994/, "");

        setPhoneData({
          phoneNumber: phoneNumber,
        });
      }
    }
  }, [userProfile]);

  const handleSaveProfile = async () => {
    // Validation
    if (!profileData.name.trim()) {
      toast.error("Ad və soyad daxil edin");
      return;
    }

    if (!profileData.email.trim()) {
      toast.error("Email daxil edin");
      return;
    }

    if (!phoneData.phoneNumber.trim()) {
      toast.error("Telefon nömrəsi daxil edin");
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        name: profileData.name,
        email: profileData.email,
        phone: `+994${phoneData.phoneNumber}`,
      });

      toast.success("Məlumatlar uğurla yeniləndi");
    } catch {
      toast.error("Məlumatlar yenilənərkən xəta baş verdi");
    }
  };

  const handleChangePassword = async () => {
    // Validation
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("Bütün sahələri doldurun");
      return;
    }

    if (passwords.new.length < 6) {
      toast.error("Yeni şifrə ən az 6 simvoldan ibarət olmalıdır");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast.error("Yeni şifrə və təkrarı eyni deyil");
      return;
    }

    if (passwords.current === passwords.new) {
      toast.error("Yeni şifrə cari şifrədən fərqli olmalıdır");
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        old_password: passwords.current,
        password: passwords.new,
        password_confirmation: passwords.confirm,
      });

      // Reset form on success
      setPasswords({
        current: "",
        new: "",
        confirm: "",
      });

      toast.success("Şifrə uğurla dəyişdirildi");
    } catch {
      toast.error("Şifrə dəyişdirilərkən xəta baş verdi");
    }
  };

  return (
    <div className="max-w-[900px] w-full px-6 py-8 bg-white">
      <h1 className="text-2xl font-medium mb-8">Hesab Məlumatları</h1>

      <div className="mb-16 space-y-6 ">
        <div>
          <Label className="text-sm mb-2 block">Email</Label>

          <Input
            value={profileData.email}
            onChange={(e) =>
              setProfileData({ ...profileData, email: e.target.value })
            }
            disabled={updateProfileMutation.isPending}
            className="h-12 rounded-none border border-black disabled:opacity-50"
            placeholder="Email"
          />
        </div>
        <div>
          <Label className="text-sm mb-2 block">Ad, Soyad</Label>

          <Input
            value={profileData.name}
            onChange={(e) =>
              setProfileData({ ...profileData, name: e.target.value })
            }
            disabled={updateProfileMutation.isPending}
            className="h-12 rounded-none border border-black disabled:opacity-50"
            placeholder="Ad və soyad daxil edin"
          />
        </div>
        <div>
          <Label className="text-sm mb-2 block">Telefon nömrəsi</Label>

          <div className="border border-black flex items-center gap-2 px-2 h-12">
            <div className="flex items-center gap-0.5 shrink-0">
              <span className="text-sm text-[#8E8E93]">+994</span>
            </div>
            <Input
              value={phoneData.phoneNumber}
              onChange={(e) =>
                setPhoneData({ ...phoneData, phoneNumber: e.target.value })
              }
              disabled={updateProfileMutation.isPending}
              className="flex-1 h-auto px-0 py-0 border-none shadow-none text-sm placeholder:text-[#8E8E93] focus-visible:ring-0 bg-transparent disabled:opacity-50"
              placeholder="Telefon nömrəsi daxil edin"
            />
            <div className="shrink-0 pointer-events-none">
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleSaveProfile}
            disabled={updateProfileMutation.isPending}
            className="h-11 px-8 bg-black text-white rounded-none disabled:opacity-50"
          >
            {updateProfileMutation.isPending ? "Yadda saxlanılır..." : "Yadda saxla"}
          </Button>
        </div>
      </div>

      <h2 className="text-2xl font-medium mb-8">Şifrə dəyişmə</h2>

      <div className="space-y-6 relative">
        <div>
          <Label className="text-sm mb-2 block">Cari şifrə</Label>
          <div className="relative">
            <Input
              type={show.current ? "text" : "password"}
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
              disabled={changePasswordMutation.isPending}
              className="h-12 pr-10 rounded-none border border-black disabled:opacity-50"
              placeholder="Cari şifrənizi daxil edin"
            />
            <button
              onClick={() => setShow({ ...show, current: !show.current })}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {show.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <Label className="text-sm mb-2 block">Yeni şifrə</Label>
          <div className="relative">
            <Input
              type={show.new ? "text" : "password"}
              value={passwords.new}
              onChange={(e) =>
                setPasswords({ ...passwords, new: e.target.value })
              }
              disabled={changePasswordMutation.isPending}
              className="h-12 pr-10 rounded-none border border-black disabled:opacity-50"
              placeholder="Yeni şifrənizi daxil edin"
            />
            <button
              onClick={() => setShow({ ...show, new: !show.new })}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {show.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <Label className="text-sm mb-2 block">Yeni şifrənin təkrarı</Label>
          <div className="relative">
            <Input
              type={show.confirm ? "text" : "password"}
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
              disabled={changePasswordMutation.isPending}
              className="h-12 pr-10 rounded-none border border-black disabled:opacity-50"
              placeholder="Yeni şifrənizi təkrar daxil edin"
            />
            <button
              onClick={() => setShow({ ...show, confirm: !show.confirm })}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button
          onClick={handleChangePassword}
          disabled={changePasswordMutation.isPending}
          className="absolute right-0 -bottom-16 h-11 px-8 bg-black text-white rounded-none disabled:opacity-50"
        >
          {changePasswordMutation.isPending ? "Dəyişdirilir..." : "Yadda saxla"}
        </Button>
      </div>
    </div>
  );
}
