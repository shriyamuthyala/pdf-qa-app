
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/community/vectorstores/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

let vectorStore = null;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const fileList = formData.getAll("file");
    console.log("Received file list:", fileList);
    if (!fileList || fileList.length === 0) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    function isFileList(obj) {
      return obj && typeof obj === "object" && "length" in obj && typeof obj.item === "function";
    }

    let file;
    const innerFileList = fileList[0];
    if (isFileList(innerFileList)) {
      if (innerFileList.length === 0) {
        return NextResponse.json({ error: "Empty FileList inside upload" }, { status: 400 });
      }
      file = innerFileList[0];
    } else {
      file = innerFileList;
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const tempPath = path.join(process.cwd(), "temp.pdf");
    await fs.writeFile(tempPath, buffer);

    const loader = new PDFLoader(tempPath);
    const docs = await loader.load();
    console.log("OPENAI_API_KEY Value at runtime:", process.env.OPENAI_API_KEY);

    const embedder = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "text-embedding-3-small",
      dimensions: 512, 
    });


    const PINECONE_INDEX_NAME = "pdf-qa-index";
    const PINECONE_ENV = process.env.PINECONE_ENVIRONMENT;
    const PINECONE_API_KEY = process.env.PINECONE_API_KEY;

    const pinecone = new Pinecone({
        apiKey: PINECONE_API_KEY,
        controllerHostUrl: process.env.PINECONE_CONTROLLER_HOST
    });


    const index = pinecone.Index(PINECONE_INDEX_NAME);

    if (vectorStore) {
      await vectorStore.addDocuments(docs);
    } else {
      vectorStore = await PineconeStore.fromDocuments(docs, embedder, {
        pineconeIndex: index,
      });
    }

    await fs.unlink(tempPath);

    global.vectorStore = vectorStore;

    return NextResponse.json({ success: true, message: "PDF uploaded and indexed." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
