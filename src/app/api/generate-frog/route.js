export const runtime = 'edge';

import { generateFrog } from '../../../../lib/generateFrog';

export async function POST(request) {
  try {
    console.log('API request starting');

    // Get message from the request body 
    const { message } = await request.json();
    console.log('Received message:', message);
    
    // Throw error is API key is missing
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is missing');
    }

    // Generate frog image - api call to openai
    const imageUrl = await generateFrog(message);
    
    // Throw err is no image url is returned
    if (!imageUrl) {
      throw new Error('No image URL returned from generateFrog');
    }

    // Convert image url to json and return response 
    return new Response(JSON.stringify({ imageUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Keep detailed logging for developers
    console.error('Full error details:', {
      message: error.message,
      stack: error.stack
    });
    
    // Simplified, clearer response for frontend
    return new Response(JSON.stringify({ 
      error: 'Failed to generate frog image. Please try again.'
    }), {
      status: !process.env.OPENAI_API_KEY ? 503 : 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
