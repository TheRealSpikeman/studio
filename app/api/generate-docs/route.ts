import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, selectedAudiences } = body;

    if (!topic || !selectedAudiences || !Array.isArray(selectedAudiences)) {
      return NextResponse.json({ error: 'Invalid request body: missing topic or selected audiences' }, { status: 400 });
    }

    // Access your API key as an environment variable
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Choose a model that's good for text generation
    // See https://ai.google.dev/models/generative for available models
    const model = genAI.getGenerativeModel({ model: "gemini-pro"}); // You can choose a different model if needed

    // Construct the prompt for the AI model
    const prompt = `Generate documentation about "${topic}" for the following audiences: ${selectedAudiences.join(', ')}.

    Provide the output in a structured format using the following conventions:
    - Use markdown headings (##) for main sections.
    - Use paragraphs for explanatory text.
    - Use markdown lists (-) for lists of items.
    - Use [INFO] and [/INFO] tags for important information blocks.
    - Use [CODE] and [/CODE] tags for code blocks.

    Ensure the language is appropriate for the specified audiences.`;

    // Call the Gemini model
    const result = await model.generateContent(prompt);
    const aiResponseText = result.response.text();

    // Process AI response and convert to ContentBlock objects
    const generatedBlocks: any[] = []; // Using 'any' for simplicity, ideally use ContentBlock type
    const lines = aiResponseText.split('\\n');

    let currentBlock: any | null = null;
    let inCodeBlock = false;
    let inInfoBlock = false;

    for (const line of lines) {
        if (line.startsWith('## ') && !inCodeBlock && !inInfoBlock) {
            if (currentBlock) generatedBlocks.push(currentBlock);
            currentBlock = { type: 'heading', content: line.substring(3).trim(), metadata: { targetAudiences: selectedAudiences } };
            inCodeBlock = false;
            inInfoBlock = false;
        } else if (line.startsWith('- ') && !inCodeBlock && !inInfoBlock) {
             if (currentBlock && currentBlock.type === 'list') {
                 currentBlock.content.push(line.substring(2).trim());
             } else {
                if (currentBlock) generatedBlocks.push(currentBlock);
                currentBlock = { type: 'list', content: [line.substring(2).trim()], metadata: { targetAudiences: selectedAudiences } };
             }
             inCodeBlock = false;
             inInfoBlock = false;
        } else if (line.startsWith('[CODE]')) {
            if (currentBlock) generatedBlocks.push(currentBlock);
            currentBlock = { type: 'code', content: '', metadata: { targetAudiences: selectedAudiences } };
            inCodeBlock = true;
            inInfoBlock = false;
        } else if (line.endsWith('[/CODE]')) {
             if (currentBlock && currentBlock.type === 'code') {
                 currentBlock.content += line.substring(0, line.length - '[/CODE]'.length);
             }
             inCodeBlock = false;
        } // ... (rest of the parsing logic as provided before)
    }

    // You need to complete the parsing logic here based on your desired format
    // The provided parsing logic is a starting point and may need adjustments

    return NextResponse.json(generatedBlocks);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}