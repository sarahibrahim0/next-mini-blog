"use client";
import { DOMAIN } from '@/utils/constants';
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();
  const logoutHandler = async () => {
    try {
        const response = await fetch(`${DOMAIN}/api/users/logout`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          router.push("/");
          router.refresh();
        } else {
          toast.warning("Something went wrong");
        }
    } catch (error) {
        toast.warning("Something went wrong");
        console.log(error);
    }
  }

  return (
    <button onClick={logoutHandler} className="bg-gray-700 text-gray-200 px-1 rounded">
        Logout
    </button>
  )
}

export default LogoutButton
