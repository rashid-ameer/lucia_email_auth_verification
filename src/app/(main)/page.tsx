import { validateRequest } from "@/auth";
import SignoutButton from "@/components/signout-button";

export default async function Home() {
  const { user } = await validateRequest();

  if (!user) {
    return null;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-5 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">
          Hello <span>{user.username}</span>
        </h1>
        <p className="text-gray-600">
          Lucia is a low code library for authentication
        </p>
      </div>
      <SignoutButton />
    </main>
  );
}
