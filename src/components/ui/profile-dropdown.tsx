"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User as Loader2, UserCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import apiService from "@/services/api-services";

type User = {
  id: number;
  nama: string;
  email: string;
  img?: string;
};


const getUserId = (): number | null => {
  const userDataString = localStorage.getItem('user');
  if (!userDataString) return null;
  try {
    const user = JSON.parse(userDataString);
    return user?.id || null;
  } catch {
    return null;
  }
};

const getInitials = (name?: string): string => {
  if (!name) return "U";
  const names = name.split(' ');
  const initials = names.map(n => n[0]).join('');
  return initials.slice(0, 2).toUpperCase();
};


export function ProfileDropdown() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userId = getUserId();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await apiService.get<User>(`/users/${userId}`);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    queryClient.clear();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-10 h-10">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <Button variant="outline" onClick={() => navigate('/login')}>
        Login
      </Button>
    );
  }

  const apiUrl = import.meta.env.VITE_API_URL;
  const imageUrl = user.img
    ? (user.img.startsWith('http') ? user.img : `${apiUrl}/storage/${user.img}`)
    : undefined;
  /* const avatarSrc = currentUser?.img_url || (currentUser?.img ? (currentUser.img.startsWith("http") ? currentUser.img : `${import.meta.env.VITE_API_URL}/storage/${currentUser.img}`) : "/avatar.png");
  */
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0 transition hover:scale-105"
        >
          <Avatar className="h-10 w-10 rounded-full overflow-hidden">
            <AvatarImage src={imageUrl} alt={user.nama} />
            <AvatarFallback className="bg-slate-100 border text-sm font-semibold">
              {getInitials(user.nama)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60 p-2 rounded-xl shadow-xl" align="end" forceMount>
        <DropdownMenuLabel className="font-normal px-2 pb-1">
          <div className="flex flex-col space-y-0.5">
            {/* <img src={avatarSrc} alt="avatar" className="w-10 h-10 rounded-full shadow-sm object-cover border-2 border-white" /> */}
            <p className="text-sm font-medium leading-none truncate">{user.nama}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <Link to="/profile">
            <DropdownMenuItem className="cursor-pointer rounded-md hover:bg-accent hover:text-accent-foreground">
              <UserCog className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer rounded-md text-red-600 hover:bg-destructive/90 hover:text-white focus:bg-destructive/90 focus:text-white"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
