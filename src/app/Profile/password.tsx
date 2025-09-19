"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import apiService from "@/services/api-services";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

type PasswordForm = {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
};

type MessageState = {
  type: "success" | "error";
  text: string;
} | null;

export default function Password() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<PasswordForm>();

  const [message, setMessage] = useState<MessageState>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  const newPassword = watch("new_password");

  const onSubmit = async (data: PasswordForm) => {
    setMessage(null);

    try {
      await apiService.post("/reset-password", {
        current_password: data.current_password,
        new_password: data.new_password,
        new_password_confirmation: data.new_password_confirmation,
      });

      setMessage({ type: "success", text: "Password berhasil diubah! Anda akan dialihkan..." });
      reset();

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setMessage({
        type: "error",
        text: "Gagal mengubah password: " + (err.response?.data?.message || err.message),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-20 p-4">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">Ubah Password</CardTitle>
          <CardDescription>
            Perbarui password Anda untuk menjaga keamanan akun.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"} className="mb-4">
              {message.type === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="current_password">Password Lama</Label>
              <div className="relative">
                <Input
                  id="current_password"
                  type={showCurrentPassword ? "text" : "password"}
                  {...register("current_password", {
                    required: "Password lama wajib diisi",
                  })}
                  className={errors.current_password ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.current_password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.current_password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_password">Password Baru</Label>
              <div className="relative">
                <Input
                  id="new_password"
                  type={showNewPassword ? "text" : "password"}
                  {...register("new_password", {
                    required: "Password baru wajib diisi",
                    minLength: {
                      value: 8,
                      message: "Password minimal 8 karakter",
                    },
                  })}
                  className={errors.new_password ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.new_password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.new_password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_password_confirmation">Konfirmasi Password Baru</Label>
              <Input
                id="new_password_confirmation"
                type="password"
                {...register("new_password_confirmation", {
                  required: "Konfirmasi password wajib diisi",
                  validate: (value) =>
                    value === newPassword || "Konfirmasi password tidak cocok",
                })}
                className={errors.new_password_confirmation ? "border-red-500" : ""}
              />
              {errors.new_password_confirmation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.new_password_confirmation.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}