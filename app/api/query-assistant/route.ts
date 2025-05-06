import { OpenAI } from 'openai';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY is missing');
    return new Response(JSON.stringify({ result: 'API key is missing.' }), { status: 500 });
  }

  const openai = new OpenAI({ apiKey });

  const assistantId = 'asst_3Q3w2JKGsuPciCeoScflzj7F';
  const thread = await openai.beta.threads.create();

  await openai.beta.threads.messages.create(thread.id, {
    role: 'user',
    content: prompt,
  });

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistantId,
  });

  while (true) {
    const status = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    if (status.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id);
      const contentBlocks = messages.data[0]?.content ?? [];

      const resultBlock = contentBlocks.find((block) => {
        return (
          block.type === 'text' &&
          typeof (block as any).text?.value === 'string'
        );
      });

      const result = (resultBlock as any)?.text?.value || 'No response';
      return new Response(JSON.stringify({ result }), { status: 200 });
    }

    if (status.status === 'failed') {
      return new Response(JSON.stringify({ result: 'Assistant failed to respond.' }), { status: 500 });
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}