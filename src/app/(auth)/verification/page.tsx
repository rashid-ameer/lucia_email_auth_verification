import { validateRequest } from "@/auth";
import VerificationForm from "@/components/auth/verification-form";
import { redirect, RedirectType } from "next/navigation";

async function VerificationPage() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login", RedirectType.replace);
  }

  return (
    <main className="py-2  min-h-screen flex flex-col items-center justify-center gap-5">
      <div className="p-5 bg-white rounded-md shadow-lg space-y-5 border">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Enter Verification Code</h2>
          <p className="text-gray-500">
            We have sent to <strong>{user.email}</strong>
          </p>
        </div>
        <VerificationForm user={user} />
      </div>
    </main>
  );
}
export default VerificationPage;
