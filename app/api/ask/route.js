import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";

export async function POST(request) {
  try {
    const body = await request.json();
    const question = body.question;
    if (!question) {
      return NextResponse.json({ error: "Question not provided" }, { status: 400 });
    }

    if (!global.vectorStore) {
      return NextResponse.json({ error: "No PDF processed yet." }, { status: 400 });
    }

    const results = await global.vectorStore.similaritySearch(question, 2);
    const context = results.map(r => r.pageContent).join("\n\n");

    const chatModel = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY });
    const messages = [
      { role: "system", content: "Answer only using the provided PDF context." },
      { role: "user", content: `${context}\n\nQuestion: ${question}` }
    ];

    const response = await chatModel.call(messages);
    return NextResponse.json({ answer: response.content });

  } catch (error) {
    console.error("Error in /api/ask:", error);
    return NextResponse.json({ error: "Failed to generate answer" }, { status: 500 });
  }
}
