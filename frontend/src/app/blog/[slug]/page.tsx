import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface PostDetail {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  cover: string;
  published: boolean;
  content: string;
}

async function getPost(slug: string): Promise<PostDetail> {
  const res = await fetch(`http://localhost:8000/posts/${slug}`, {
    next: { revalidate: 600 }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch post');
  }
  
  return res.json();
}

async function getAllPosts() {
  const res = await fetch('http://localhost:8000/posts');
  if (!res.ok) return { posts: [] };
  const data = await res.json();
  return data;
}

export async function generateStaticParams() {
  const { posts } = await getAllPosts();
  
  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const post = await getPost(params.slug);
    return {
      title: post.title,
      description: post.excerpt,
    };
  } catch {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  try {
    const post = await getPost(params.slug);

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
        >
          ← Back to blog
        </Link>

        <article className="prose prose-lg max-w-none">
          {post.cover && (
            <div className="mb-8 -mx-4 sm:mx-0">
              <Image
                src={post.cover}
                alt={post.title}
                width={1200}
                height={600}
                className="w-full h-64 sm:h-96 object-cover rounded-none sm:rounded-lg"
              />
            </div>
          )}

          <header className="mb-8">
            <time className="text-sm text-gray-500 mb-2 block">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </header>

          <div className="prose prose-lg prose-gray max-w-none
                          prose-headings:font-semibold prose-headings:text-gray-900
                          prose-p:text-gray-700 prose-p:leading-relaxed
                          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                          prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                          prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200
                          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:pl-4
                          prose-img:rounded-lg prose-img:shadow-md">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>

        <footer className="mt-12 pt-8 border-t border-gray-200">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            ← Back to all posts
          </Link>
        </footer>
      </div>
    );
  } catch (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
        >
          ← Back to blog
        </Link>
        
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">
            The blog post you're looking for doesn't exist or has been moved.
          </p>
          <Link 
            href="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }
}