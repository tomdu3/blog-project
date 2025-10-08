
"use client";

import React, { useState, useEffect } from 'react';
import { getPosts } from '../../lib/api';
import Link from 'next/link';
import Image from 'next/image';

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    };
    fetchPosts();
  }, []);

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortBy === 'title') {
      return sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    }
    return 0;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold">All Posts</h1>
        <div className="flex items-center">
          <span className="mr-2">Sort by:</span>
          <button
            className={`mr-2 ${sortBy === 'date' ? 'font-bold' : ''}`}
            onClick={() => setSortBy('date')}
          >
            Date
          </button>
          <button
            className={`${sortBy === 'title' ? 'font-bold' : ''}`}
            onClick={() => setSortBy('title')}
          >
            Title
          </button>
          <button onClick={toggleSortOrder} className="ml-4">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {sortedPosts.map((post) => (
          <li key={post.slug} className="py-4 flex items-center">
            <Image 
              src={post.cover ? post.cover : '/town-crier.webp'} 
              alt={post.title} 
              width={64}
              height={64}
              className="w-16 h-16 object-cover rounded-lg mr-4"
            />
            <div className="flex-grow">
              <Link href={`/blog/${post.slug}`} className="text-xl font-semibold text-gray-800 dark:text-gray-200 hover:underline">
                {post.title}
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
    </div>
  );
};

export default PostsPage;
