"use client";
import { verifyEmail } from "@/actions/auth/actions";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { User } from "lucia";
import { useEffect, useState, useTransition } from "react";
import ResendEmailButton from "../resend-email-button";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

type VerificationFormProps = {
  user: User;
};

function VerificationForm({ user }: VerificationFormProps) {
  const [value, setValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleClick = () => {
    startTransition(async () => {
      const result = await verifyEmail(value);
      if (result) {
        setError(result.error);
      } else {
        toast.success("Email verified successfully");
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-5 mx-auto w-[500px]">
      {!isPending && error && (
        <div className="bg-red-100 text-red-500 p-2 rounded-md">{error}</div>
      )}

      <InputOTP
        maxLength={8}
        value={value}
        onChange={(value) => setValue(value)}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
          <InputOTPSlot index={6} />
          <InputOTPSlot index={7} />
        </InputOTPGroup>
      </InputOTP>

      <ResendEmailButton user={user} />

      <Button
        className="bg-blue-700 hover:bg-blue-500"
        onClick={handleClick}>
        Verify
      </Button>
    </div>
  );
}
export default VerificationForm;
