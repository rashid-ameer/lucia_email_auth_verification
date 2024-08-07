"use server";

import prisma from "@/lib/prisma";
import {
  loginFormSchema,
  signupFormSchema,
  verificationCodeSchema,
} from "@/lib/schemas";
import {
  generateEmailVerificationCode,
  verifyVerificationCode,
} from "@/lib/server-utils";
import { generateIdFromEntropySize } from "lucia";
import { hash, verify } from "@node-rs/argon2";
import { sendVerificationEmailCode } from "@/lib/email-utils";
import { lucia, validateRequest } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { error } from "console";

// sign up a user
export async function signup(data: unknown) {
  // check if data is valid
  const validationResult = signupFormSchema.safeParse(data);
  if (!validationResult.success) {
    return { error: "Invalid data" };
  }

  // extract data
  const { email, password, username } = validationResult.data;

  // check if email already exists
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (user) {
    return { error: "Email already exists" };
  }

  // generate user id
  const userId = generateIdFromEntropySize(10); // 16 characters long
  // generate hash password
  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  // add a user to database, but email verificaiton is false
  await prisma.user.create({
    data: {
      id: userId,
      email,
      username,
      passwordHash: passwordHash,
    },
  });

  // get the verficaiton code for email
  const code = await generateEmailVerificationCode(userId, email);
  // send the verification email
  await sendVerificationEmailCode(email, code);

  // create a session
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  redirect("/verification");
}

// login a user
export async function login(data: unknown) {
  // check if the data is valid
  const validationResult = loginFormSchema.safeParse(data);
  if (!validationResult.success) {
    return { error: "Invalid data" };
  }

  const { email, password } = validationResult.data;
  // check if the user exists
  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!existingUser) {
    return { error: "Invalid email or password" };
  }
  // generate hash password
  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const validPassword = await verify(existingUser.passwordHash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  if (!validPassword) {
    return {
      error: "Incorrect username or password",
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/");
}

// verify email code
export async function verifyEmail(data: unknown) {
  const { user } = await validateRequest();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const validationResult = verificationCodeSchema.safeParse(data);

  if (!validationResult.success) {
    return { error: "Invalid code" };
  }

  const code = validationResult.data;

  const isCodeValid = await verifyVerificationCode(user, code);

  if (!isCodeValid) {
    return { error: "Invalid code" };
  }

  await lucia.invalidateUserSessions(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true },
  });

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  redirect("/");
}

// logout user
export async function logout() {
  const { user } = await validateRequest();
  if (!user) {
    return { error: "Unauthorized" };
  }

  await lucia.invalidateSession(user.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect("/login");
}

// send verification email
export async function sendVerificationEmail() {
  const { user } = await validateRequest();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const code = await generateEmailVerificationCode(user.id, user.email);
  const result = await sendVerificationEmailCode(user.email, code);
  return result;
}
