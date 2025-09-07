
export async function getPosts() {
  console.log('Fetching posts...');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log(`API URL: ${apiUrl}`);

  try {
    const res = await fetch(`${apiUrl}/posts`, {
      next: { revalidate: 60 }
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


export async function getPost(slug) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  try {
    const res = await fetch(`${apiUrl}/posts/${slug}`, {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      console.error(`Failed to fetch post with slug: ${slug}`);
      return null;
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
}

export async function sendContactForm(data) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error('Failed to send message');
    }

    return res.json();
}
