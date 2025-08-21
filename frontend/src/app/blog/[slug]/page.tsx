
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  cover: string;
  content: string;
  published: boolean;
}

async function getPost(slug: string): Promise<Post> {
  const res = await fetch(`http://localhost:8000/posts/${slug}`, {
    next: { revalidate: 300 }
  });

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error('Failed to fetch post');
  }

  return res.json();
}

import ArticleList from '@/components/ArticleList';

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row">
      <main className="w-full md:w-3/4 md:pr-8">
        <article className="prose lg:prose-xl">
          {post.cover && (
            <div className="mb-8">
              <Image
                src={post.cover}
                alt={post.title}
                width={600}
                height={315}
                className="w-4/5 md:w-1/2 rounded-lg"
              />
            </div>
          )}
          
          <div className="mb-4">
            <time className="text-gray-500">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <h1 className="text-4xl font-bold mt-2">{post.title}</h1>
          </div>

          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1] ?? ''}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>
      </main>
      <ArticleList />
    </div>
  );
}
