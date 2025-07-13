import Image from "next/image";
import Link from "next/link";

interface PostSummary {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  cover: string;
  published: boolean;
}

interface PostsResponse {
  posts: PostSummary[];
  total: number;
}

async function getPosts(): Promise<PostsResponse> {
  const res = await fetch('http://localhost:8000/posts', {
    next: { revalidate: 300 }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  return res.json();
}

export default async function Home() {
  const { posts } = await getPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">My Blog</h1>
        <p className="text-gray-600">Thoughts, stories, and ideas powered by Notion</p>
      </header>

      <main className="space-y-8">
        {posts.map((post) => (
          <article key={post.id} className="border-b border-gray-200 pb-8 last:border-b-0">
            <Link href={`/blog/${post.slug}`} className="group">
              {post.cover && (
                <div className="mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    width={800}
                    height={400}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <time className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                
                <h2 className="text-2xl font-semibold group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                
                {post.excerpt && (
                  <p className="text-gray-600 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
                
                <div className="pt-2">
                  <span className="text-blue-600 group-hover:text-blue-700 font-medium">
                    Read more →
                  </span>
                </div>
              </div>
            </Link>
          </article>
        ))}
        
        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts found. Check back later!</p>
          </div>
        )}
      </main>
    </div>
  );
}
