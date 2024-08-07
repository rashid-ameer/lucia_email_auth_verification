import { validateRequest } from "@/auth";
import { redirect, RedirectType } from "next/navigation";

async function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user } = await validateRequest();

  if (user && user.emailVerified) {
    return redirect("/", RedirectType.replace);
  }

  return <>{children}</>;
}
export default AuthLayout;
