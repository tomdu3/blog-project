
import Link from 'next/link';

const ArticleList = ({ posts }) => {
  return (
        <aside className="p-6 bg-slate-800 rounded-lg pb-8">
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

export default ArticleList;
