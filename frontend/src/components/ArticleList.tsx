
import Link from 'next/link';

interface PostSummary {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  cover?: string;
  published: boolean;
}

interface PostsResponse {
  posts: PostSummary[];
  total: number;
}

async function getPosts(): Promise<PostSummary[]> {
  const res = await fetch(`http://localhost:8000/posts`, {
    next: { revalidate: 300 }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }

  const data: PostsResponse = await res.json();
  return data.posts;
}

export default async function ArticleList() {
  const posts = await getPosts();

  return (
    <aside className="w-full md:w-1/4 p-6 bg-slate-800 rounded-lg">
      <h2 className="text-lg font-medium text-slate-300 mb-4">All Articles</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="mb-4">
            <Link href={`/blog/${post.slug}`} className="text-slate-200 hover:text-white hover:underline font-medium">
              {post.title}
            </Link>
            <p className="text-sm text-slate-400 mt-1">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
