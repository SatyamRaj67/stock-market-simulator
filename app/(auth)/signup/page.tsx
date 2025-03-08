import { SignUpForm } from "@/components/auth/signup-form";
import { authOptions } from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    return redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Stock Market Simulator</h1>
          <p className="mt-2 text-gray-600">Create a new account</p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
