// Middleware to proxy image requests - respecting cors

export async function GET(request) {
  //Crate searchparams to be able to work with url qualitlies 
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new Response('Missing URL parameter', { status: 400 });
  }

  try {
    // Create controller to handle abort requests 
    const controller = new AbortController();
    //Create timer to know when to abort request 
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    // Proxy makes fetch to the image url (includes the abort controller))
    const response = await fetch(imageUrl, { 
      signal: controller.signal 
    });
    
    // If fetch succceeds before timeout, clear the time 
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    // Only if able to fetch image, can you then convert to blob
    const blob = await response.blob();
    // Get content type from the original image response 
    const contentType = response.headers.get('Content-Type') || 'image/png';
    
    // Create proxy response with blob, content type, and cors headers 
    return new Response(blob, {
      headers: {
        'Content-Type': contentType, // Telling browser what type fo file so it knows how to interpret data 
        'Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*' // Allow all origins to access the image 
      },
    });
  } catch (error) {
    // Log the error for debugging
    console.error('Error proxying image:', error);

    // Case 1: Timeout Error (when our AbortController kicks in after 10s)
    if (error.name === 'AbortError') {
      return new Response('Image fetch timed out', { 
        status: 504  // 504 = Gateway Timeout
      });
    }

    // Case 2: Any other error (fetch failed, invalid image, etc)
    return new Response('Error fetching image', { 
      status: 500  // 500 = Internal Server Error
    });
  }
}
