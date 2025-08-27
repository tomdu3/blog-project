
export async function getPosts() {
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
