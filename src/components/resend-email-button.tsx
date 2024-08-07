"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { User } from "lucia";
import { sendVerificationEmail } from "@/actions/auth/actions";

type ResendEmailButtonProps = {
  user: User;
};

function ResendEmailButton({ user }: ResendEmailButtonProps) {
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(30); // 30 seconds countdown
  const [isPending, startTransition] = useTransition();

  const handleResend = async () => {
    startTransition(async () => {
      await sendVerificationEmail();
      setResendDisabled(true);
      setTimer(30); // Reset the timer to 30 seconds
    });
  };

  useEffect(() => {
    if (!resendDisabled) return;

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setResendDisabled(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resendDisabled]);
  return (
    <div className="text-gray-600">
      Didn&apos;t get code?{" "}
      <Button
        variant="link"
        className="px-0 text-blue-700"
        onClick={handleResend}
        disabled={isPending || resendDisabled}>
        Click to resend.
      </Button>{" "}
      {resendDisabled && <span className="tabular-nums"> ({timer}s)</span>}
    </div>
  );
}
export default ResendEmailButton;
