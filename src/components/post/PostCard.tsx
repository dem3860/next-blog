import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { PostCardProps } from "@/types/post";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import Image from "next/image";

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden p-0">
      <Link href={`/posts/${post.id}`}>
        {post.topImage && (
          <div className="relative w-full h-48">
            <Image
              src={post.topImage}
              alt={post.title}
              fill
              sizes="(max-width:768px) 100vw,(max-width:1200px) 50vw,33vw"
              className="object-cover"
            />
          </div>
        )}
        <CardHeader className="pb-2 pt-3 px-4">
          <div className="flex justify-between items-center">
            <CardTitle className="line-clamp-2">{post.title}</CardTitle>
            <CardAction className="text-sm font-medium text-blue-600">
              Read More
            </CardAction>
          </div>
        </CardHeader>

        <CardContent className="text-sm text-gray-600 px-4 pb-4">
          <p className="line-clamp-2 mb-2">{post.content}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{post.author.name}</span>
            <time>
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
                locale: ja,
              })}
            </time>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
