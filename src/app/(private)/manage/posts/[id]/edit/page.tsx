import { auth } from "@/auth";
import { getOwnPost } from "@/lib/ownPost";
import { notFound } from "next/navigation";
import EditPostForm from "./EditPostForm";

type Params = {
  params: { id: string };
};
export default async function EditPage({ params }: Params) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!session?.user?.email || !userId) {
    throw new Error("ユーザー情報の取得に失敗しました。");
  }

  const { id } = await params;
  const post = await getOwnPost(userId, id);
  if (!post) {
    return notFound();
  }
  return <EditPostForm post={post} />;
}
