import { NextResponse } from 'next/server';

const APP_ID = process.env.EDAMAM_APP_ID;
const APP_KEY = process.env.EDAMAM_APP_KEY;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = encodeURIComponent(url.searchParams.get('q') || '');
  
  console.log('Query Parameter:', query); 

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is missing' }, { status: 400 });
  }

  try {
    const requestUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`;
    console.log('Request URL:', requestUrl); 

    const response = await fetch(requestUrl);

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response Data:', data); 
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json({ error: 'Error fetching recipes' }, { status: 500 });
  }
}
