import { validateRequest } from "@/auth";
import LoginForm from "@/components/auth/login-form";
import { redirect, RedirectType } from "next/navigation";

async function page() {
  const { user } = await validateRequest();

  if (user && !user.emailVerified) {
    return redirect("/verification", RedirectType.replace);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full mx-auto max-w-screen-sm space-y-5">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-gray-600">
            Welcome back! Enter your details to continue
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
export default page;
