import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

const API_TOKEN = process.env.HUGGING_FACE_API_KEY;

export async function POST(request: Request) {
  const { prompt } = await request.json();

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/google/flan-t5-large',
      {
        headers: { Authorization: `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    const result = await response.json();
    console.log('API Response:', result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}





