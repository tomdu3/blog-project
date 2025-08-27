
export async function getPosts() {
  // During the build process, `npm_lifecycle_event` will be 'build'.
  // In this case, we don't want to fetch data, so we return an empty array.
  if (process.env.npm_lifecycle_event === 'build') {
    console.log('Build process detected, skipping fetch.');
    return [];
  }

  console.log('Fetching posts...');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log(`API URL: ${apiUrl}`);

  try {
    const res = await fetch(`${apiUrl}/posts`, {
      next: { revalidate: 300 }
    });
    
    if (!res.ok) {
      console.error('Failed to fetch posts');
      return [];
    }
    
    const data = await res.json();
    return data.posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}
