import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { notFound } from 'next/navigation';

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

async function getPost(slug: string): Promise<PostDetail | null> {
  const res = await fetch(`http://localhost:8000/posts/${slug}`, {
    next: { revalidate: 600 }
  });
  
  if (!res.ok) {
    return null;
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostContent post={post} />;
}

function BlogPostContent({ post }: { post: PostDetail }) {
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
          <ReactMarkdown 
            components={{
              code: ({ className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : '';
                
                return language ? (
                  <SyntaxHighlighter
                    style={oneDark as any}
                    language={language}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              blockquote: ({ children, ...props }) => (
                <div className="callout p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg my-4">
                  <div className="flex items-start">
                    <div className="mr-3 text-blue-500 text-xl">💡</div>
                    <div className="prose prose-sm max-w-none">
                      {children}
                    </div>
                  </div>
                </div>
              ),
              details: ({ children, ...props }) => (
                <details className="toggle bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
                  {children}
                </details>
              ),
              summary: ({ children, ...props }) => (
                <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded">
                  {children}
                </summary>
              ),
              table: ({ children, ...props }) => (
                <div className="overflow-x-auto my-6">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children, ...props }) => (
                <thead className="bg-gray-50">
                  {children}
                </thead>
              ),
              th: ({ children, ...props }) => (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  {children}
                </th>
              ),
              td: ({ children, ...props }) => (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                  {children}
                </td>
              )
            }}
          >
            {post.content}
          </ReactMarkdown>
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
}