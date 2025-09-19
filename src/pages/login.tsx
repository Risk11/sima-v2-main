import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Loader2 } from "lucide-react";

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <motion.div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-2xl" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
        <div>
          <h2 className="text-3xl font-bold text-center text-blue-700">SIMA</h2>
          <p className="text-sm text-center text-gray-500 tracking-wide mt-3">Sistem Informasi Manajemen dan Aset</p>
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
                    <Input placeholder="Masukkan username anda" {...field} />
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
          className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-all duration-200"
        >
          {isPending && <Loader2 className="animate-spin w-4 h-4" />}
          {isPending ? "Logging in..." : "Login"}
        </motion.button>

      </motion.div>
    </div>
  );
}
