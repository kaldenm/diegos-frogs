import OpenAI from 'openai';

// Save api key in variable 
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const generateFrog = async (messageContent) => {
   // Dalle prompt for genreating for image
    try {
        const prompt = 
        `Simple ink drawing of a frog with flowing, continuous line work. 
        The frog's expression, posture, and setting should convey "${messageContent}". 
        Quick, confident gestural drawing style. 
        Single black lines on white background with no shading. 
        Confident minimal linework.
        Must have for frog: distinct facial features showing clear emotion, rounded eyes with personality, simplified body in side view.
        `;

    // Server requests image generation from DALL-E API
        const response = await openai.images.generate({
            prompt,
            n: 1,
            size: "512x512",
            quality: "standard",
            style: "vivid"
        });

    // Server receives and returns the image URL from DALL-EGre
        return response.data[0].url;

    } catch (error) {
    // Log error if dalle api doesnt generate image
        console.error('DALL-E Error:', error);
        throw error;
    }
};
