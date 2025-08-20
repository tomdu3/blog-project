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
  const latestPosts = posts.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <section className="text-center py-16">
        <div className="mb-8">
          <Image
            src="https://picsum.photos/1200/400"
            alt="Hero Image"
            width={1200}
            height={400}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          Welcome to My Blog
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Thoughts, stories, and ideas from my journey in tech and beyond.
        </p>
      </section>

      <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-8">
        Latest Articles
      </h2>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {latestPosts.map((post) => (
          <article key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <Link href={`/blog/${post.slug}`} className="group">
              {post.cover && (
                <div className="relative h-48">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              )}
              <div className="p-6">
                <time className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <h2 className="text-xl font-semibold mt-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-gray-600 mt-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </Link>
          </article>
        ))}
        
        {latestPosts.length === 0 && (
          <div className="text-center py-12 md:col-span-3">
            <p className="text-gray-500">No posts found. Check back later!</p>
          </div>
        )}
      </main>
    </div>
  );
}
