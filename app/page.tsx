'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string>('');

  return (
    <main className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-4 py-8">
      <Image
        src="/fx2-logo.png"
        alt="Fx2 Logo"
        width={96}
        height={96}
        className="mb-4"
      />
      <h1 className="text-3xl font-bold mb-2">Fx² Matchmaker</h1>
      <p className="mb-6 text-center max-w-md">
        Your AI-powered investment matchmaker. <br /> Enter a prompt to begin.
      </p>

      <form
        className="w-full max-w-xl flex"
        onSubmit={async (e) => {
          e.preventDefault();
          setResponse('Loading...');

          try {
            const res = await fetch('/api/query-assistant', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt: input }),
            });

            if (!res.ok) {
              const text = await res.text();
              throw new Error(`API Error: ${text}`);
            }

            const data = await res.json();
            setResponse(data.result || 'No response from assistant.');
          } catch (err) {
            console.error('Error submitting prompt:', err);
            setResponse('Something went wrong. Please try again.');
          }
        }}
      >
        <input
          className="flex-grow px-4 py-2 border border-gray-300 rounded"
          placeholder="e.g. Pre-seed, B2B SaaS, $500K"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="ml-2 bg-black text-white px-4 py-2 rounded">Submit</button>
      </form>

      {response && <div className="mt-6 max-w-xl whitespace-pre-line">{response}</div>}
    </main>
  );
}