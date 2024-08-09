import { NextResponse } from 'next/server';

const API_TOKEN = process.env.HUGGING_FACE_API_KEY;

export async function POST(request: Request) {
  const { prompt } = await request.json();

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/satyanshu404/flan-t5-large-finetuned-prompt_generation",
      {
        headers: { Authorization: `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' },
        method: "POST",
        body: JSON.stringify({ inputs: `Extract all food ingredients implied or mentioned in this text: "${prompt}".` }),
      }
    );

    const result = await response.json();
    console.log('Ingredients extraction response:', result); 

    const ingredients = result?.[0]?.generated_text || 'No response';

    return NextResponse.json({ ingredients });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}
