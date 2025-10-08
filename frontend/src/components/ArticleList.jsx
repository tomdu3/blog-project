
import Link from 'next/link';
import Image from 'next/image';

const ArticleList = ({ posts }) => {
  console.log('ArticleList received posts:', posts);
  const displayedPosts = posts.slice(0, 10);

  return (
        <aside className="p-6 bg-slate-800 rounded-lg pb-8">
      <h2 className="text-lg font-medium text-slate-300 mb-4">All Articles</h2>
      <ul>
        {displayedPosts.map((post) => (
          <li key={post.id} className="mb-4 flex items-center">
            <div className="w-20 h-20 mr-4 flex-shrink-0">
              <Image 
                src={post.cover ? post.cover : '/town-crier.webp'} 
                alt={post.title} 
                width={80}
                height={80}
                className="w-full h-full object-cover rounded-lg" 
              />
            </div>
            <div>
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
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-center">
        <Link href="/posts" className="text-slate-200 hover:text-white hover:underline font-medium">
          Posts
        </Link>
      </div>
    </aside>
  );
}

export default ArticleList;
