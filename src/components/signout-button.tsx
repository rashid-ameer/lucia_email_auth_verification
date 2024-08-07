"use client";
import { logout } from "@/actions/auth/actions";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

function SignoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };
  return (
    <Button
      onClick={handleLogout}
      disabled={isPending}>
      Logout
    </Button>
  );
}
export default SignoutButton;
