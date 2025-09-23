'use client';

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import bg from "@/assets/bg-4.jpg";
import logo from "@/assets/logo_sima2.png"
import { LoginForm, loginFormSchema } from "@/schemas/login-schemas";
import { LoginTypes } from "@/types copy/login";

import apiService, { ApiResponseType } from "@/services/api-services";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/lib/use-app-dispatch";
import { login as setLogin } from "@/slices/auth-slices";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: "", password: "" },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: LoginForm): Promise<ApiResponseType<LoginTypes>> =>
      apiService.post<LoginTypes, LoginForm>('/login', data),

    onSuccess: (response) => {
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        window.dispatchEvent(new Event('authChange'));
        dispatch(setLogin(response.user));
      }
      navigate(from, { replace: true });
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.message || "Terjadi kesalahan yang tidak diketahui.");
    },
  });

  const handleLogin = () => {
    const formData = form.getValues();
    setErrorMessage(null);
    mutateAsync(formData);
  };

  return (
    <div
      className="relative flex min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />

      <div className="relative z-10 flex flex-col w-full md:w-1/3 ">
          <div className="mx-7 my-10">
            <div className="flex items-center gap-2">
              <img src={logo} alt="" />
              <div className="">
                <p className="font-extrabold text-sky-400 text-xl">SIMA</p>
                <p className="text-sm text-slate-400">Sistem Informasi Monitoring Aset</p>
              </div>
            </div>
          </div>
        <motion.div
          className="w-full max-w-md md:mx-20 md:mt-10 p-8 space-y-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="">
            <h2 className="text-2xl font-semibold text-gray-800">Login</h2>
            <p className="text-sm text-gray-500 mt-1">Selamat datang kembali! Silakan masuk.</p>
          </div>

          <Form {...form}>
            <div className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan username anda" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Masukkan password anda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>

          {errorMessage && (
            <div className="mt-4 p-3 text-sm text-center text-red-800 bg-red-100 rounded-md">
              {errorMessage}
            </div>
          )}

          <motion.button
            onClick={handleLogin}
            disabled={isPending}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 text-white bg-sky-400 rounded-lg hover:bg-sky-600 disabled:bg-blue-300 transition-all duration-200"
          >
            {isPending && <Loader2 className="animate-spin w-4 h-4" />}
            {isPending ? "Logging in..." : "Login"}
          </motion.button>
        </motion.div>
      </div>

      {/* Right: Quote */}
      <div className="absolute bottom-6 right-6 text-white text-sm max-w-xs text-right z-10">
        <p className="italic">“When there is no desire, all things are at peace.”</p>
        <span className="block mt-1">- Laozi</span>
      </div>
    </div>
  );
}
