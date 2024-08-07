import { TimeSpan, createDate, isWithinExpirationDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import prisma from "./prisma";
import { User } from "lucia";

export async function generateEmailVerificationCode(
  userId: string,
  email: string
): Promise<string> {
  // delete all existing codes
  await prisma.emailCodeVerification.deleteMany({
    where: { userId },
  });

  // generate new code
  const code = generateRandomString(8, alphabet("0-9"));

  // save code
  await prisma.emailCodeVerification.create({
    data: {
      code,
      userId,
      email,
      expiresAt: createDate(new TimeSpan(15, "m")),
    },
  });

  return code;
}

export async function verifyVerificationCode(user: User, code: string) {
  return await prisma.$transaction(async (prisma) => {
    const codeEntry = await prisma.emailCodeVerification.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!codeEntry || codeEntry.code !== code) {
      return false;
    }

    await prisma.emailCodeVerification.delete({
      where: {
        id: codeEntry.id,
      },
    });

    if (!isWithinExpirationDate(codeEntry.expiresAt)) {
      return false;
    }

    if (codeEntry.email !== user.email) {
      return false;
    }

    return true;
  });
}
