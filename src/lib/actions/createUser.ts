"use server";

import { registerSchema } from "@/validations/user";
import type { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";

type ActionState = {
  success: boolean;
  errors: Record<string, string[]>;
};

function handleValidationError(error: ZodError<unknown>): ActionState {
  const { fieldErrors, formErrors } = error.flatten();

  if (formErrors.length > 0) {
    return {
      success: false,
      errors: { ...fieldErrors, confirmPassword: formErrors },
    };
  }
  return { success: false, errors: fieldErrors };
}

function handleError(customErrors: Record<string, string[]>): ActionState {
  return { success: false, errors: customErrors };
}
export async function createUser(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  //フォーム革渡ってきた情報を取得
  const rawFormData = Object.fromEntries(
    ["name", "email", "password", "confirmPassword"].map((key) => [
      key,
      formData.get(key),
    ])
  );

  console.log("rawFormData:", rawFormData);

  // バリデーション
  const validationResult = registerSchema.safeParse(rawFormData);
  if (!validationResult.success) {
    return handleValidationError(validationResult.error);
  }
  //DBにメールアドレスがあるかを確認
  const existingUser = await prisma.user.findUnique({
    where: { email: validationResult.data.email },
  });
  if (existingUser) {
    return handleError({
      email: ["このメールアドレスは既に使用されています。"],
    });
  }
  //DB登録
  const hashedPassword = await bcryptjs.hash(
    validationResult.data.password,
    12
  );

  await prisma.user.create({
    data: {
      name: validationResult.data.name,
      email: validationResult.data.email,
      password: hashedPassword,
    },
  });
  //dashboardにリダイレクト
  await signIn("credentials", {
    ...Object.fromEntries(formData),
    redirect: false,
  });
  redirect("/dashboard");
}
