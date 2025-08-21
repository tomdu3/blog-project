import Image from "next/image";
import Link from "next/link";
import ArticleList from "@/components/ArticleList";

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
  const res = await fetch('http://localhost:8000/posts', {
    next: { revalidate: 300 }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  const data: PostsResponse = await res.json();
  return data.posts;
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row">
      <div className="w-full md:w-3/4 md:pr-8">
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
          All Articles
        </h2>

        <main className="flex flex-col gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
              <Link href={`/blog/${post.slug}`} className="group w-full">
                <div className="md:flex">
                  {post.cover && (
                    <div className="md:w-1/3 relative h-48 md:h-auto">
                      <Image
                        src={post.cover}
                        alt={post.title}
                        layout="fill"
                        objectFit="cover"
                        className="group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )}
                  <div className="p-6 md:w-2/3">
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
      <div className="w-full md:w-1/4 mt-8 md:mt-0">
        <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-4">
          <ArticleList posts={posts} />
        </div>
      </div>
    </div>
  );
}

