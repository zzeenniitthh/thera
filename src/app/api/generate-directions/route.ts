import { NextResponse } from 'next/server';
import { gemini } from '@/lib/gemini';

const SYSTEM_PROMPT = `You are a gentle guide helping someone explore their goals without pressure.
You suggest directions — not tasks. You illuminate possibilities — not obligations.

Language rules:
- Use: direction, possibility, horizon, path, exploration, wonder, notice, curious, drawn to
- Never use: task, must, should, deadline, overdue, complete, finish, fail, required, mandatory
- Frame everything as invitation: "What if...", "You might notice...", "A direction worth exploring..."

Given a goal, generate 5-7 directions that branch out from it.
Each direction should feel like a natural path to explore, not a task to complete.
Include a brief "why this connects" description for each direction.

Respond with valid JSON only, no markdown formatting:
{
  "directions": [
    {
      "title": "Short direction name (3-6 words)",
      "description": "Why this direction connects to the goal (1-2 sentences)"
    }
  ]
}`;

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 503 }
      );
    }

    const { goalTitle, goalDescription, parentDirectionTitle } = await request.json();

    if (!goalTitle) {
      return NextResponse.json(
        { error: 'Goal title is required' },
        { status: 400 }
      );
    }

    let userPrompt: string;

    if (parentDirectionTitle) {
      userPrompt = `My horizon: ${goalTitle}
${goalDescription ? `More about this: ${goalDescription}` : ''}

I've been exploring the direction: "${parentDirectionTitle}"
What sub-directions might branch from here? Generate 3-5 possibilities.`;
    } else {
      userPrompt = `My horizon: ${goalTitle}
${goalDescription ? `More about this: ${goalDescription}` : ''}

What directions might I explore from here?`;
    }

    const fullPrompt = `${SYSTEM_PROMPT}\n\n${userPrompt}`;

    const result = await gemini.generateContent(fullPrompt);
    const response = result.response;
    const content = response.text();

    if (!content) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Direction generation error:', error);
    return NextResponse.json(
      { error: 'The cosmos is quiet right now. Would you like to try again?' },
      { status: 500 }
    );
  }
}
