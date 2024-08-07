import VerificationCode from "@/components/emails/verification-code";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmailCode(toEmail: string, code: string) {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: [toEmail],
    subject: "Verification Email",
    react: VerificationCode({ code }),
  });

  if (error) {
    return error;
  }

  return data;
}
