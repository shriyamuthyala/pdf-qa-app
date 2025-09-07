# Mini PDF Q&A App

##  Project Setup

### Prerequisites

- Node.js (version `18` or higher)
- npm or yarn package manager
- OpenAI API Key (required)
- Pinecone API Key and Environment details (required)

### Installation
npm install

### Environment Variables

Create a `.env` file in the project root with the following content:
OPENAI_API_KEY=your_openai_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_region 
PINECONE_CONTROLLER_HOST=https://your-pinecone-controller-host.svc.region.pinecone.io

Open your browser and go to [http://localhost:3000](http://localhost:3000)


##  How to use

- Upload your PDF file using the upload form.
- Enter your questions in the input box.
- Receive answers based on the PDF content leveraging OpenAI’s retrieval approach.



##  Technical Approach

- Extract PDF text using LangChain’s `PDFLoader`.
- Generate vector embeddings using OpenAI’s **text-embedding-3-small** model (512 dimensions).
- Store embeddings in Pinecone vector DB for similarity search.
- Retrieve context using vector search and generate answers via OpenAI chat completions.






