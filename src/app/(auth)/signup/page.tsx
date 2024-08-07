import SignupForm from "@/components/auth/signup-form";

function page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full mx-auto max-w-screen-sm space-y-5">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Signup</h1>
          <p className="text-gray-600">
            Enter your details to continue to create an account
          </p>
        </div>

        <SignupForm />
      </div>
    </main>
  );
}
export default page;
