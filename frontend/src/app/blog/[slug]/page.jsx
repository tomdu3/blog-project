import Image from "next/image";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

async function getPost(slug) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  const data = await res.json();
  return data;
}

export default async function BlogPostPage({ params }) {
    const { slug } = await params;
  const post = await getPost(slug);
  const sanitizedContent = DOMPurify.sanitize(marked(post.content));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      {post.cover && (
        <div className="relative h-96 mb-8">
          <Image
            src={post.cover || '/town-crier.webp'}
            alt={post.title}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
      )}
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </div>
  );
}