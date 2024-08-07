"use client";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PasswordInput from "./password-input";
import Link from "next/link";
import { useState, useTransition } from "react";
import { SignupFormValues } from "@/lib/types";
import { signupFormSchema } from "@/lib/schemas";
import { signup } from "@/actions/auth/actions";

function SignupForm() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // handle form submission
  const onSubmit = (data: SignupFormValues) => {
    startTransition(async () => {
      const result = await signup(data);
      if (result) {
        setError(result.error);
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className="space-y-5"
        onSubmit={form.handleSubmit(onSubmit)}>
        {!isPending && error && (
          <div className="text-center text-red-800 py-2 rounded-md bg-red-100">
            {error}
          </div>
        )}

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <Input
                {...field}
                placeholder="Enter username"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input
                {...field}
                placeholder="Enter email"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <PasswordInput
                placeholder="Enter password"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          disabled={isPending}>
          Submit
        </Button>
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </Form>
  );
}
export default SignupForm;
