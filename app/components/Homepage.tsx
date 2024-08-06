'use client'

import Head from 'next/head';
import Chatbot from './chatbot';

const Homepage = () => {
  return (
      <div className="relative min-h-screen">
      <Head>
        <title>Chatbot Page</title>
        <meta name="description" content="Chatbot Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center justify-center h-full">
        <h1 className="text-2xl font-bold">Welcome to the Chatbot</h1>
      </main>

      <Chatbot />
    </div>
  );
};

export default Homepage;