import os
import sys # For sys.exit
from pathlib import Path # Corrected import
# from dotenv import load_dotenv # Uncomment if you intend to use a .env file

# --- LangChain Imports ---
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
# For more customisable prompts (advanced option, but good to be aware of)
# from langchain.prompts import PromptTemplate

# --- Load Environment Variables ---
# Uncomment the line below if you have saved your OPENAI_API_KEY in a .env file in the project root
# load_dotenv()

# --- Configuration ---
CHROMA_PERSIST_DIR = "vectorstore/stpauls_chroma_db"
EMBEDDING_MODEL_NAME = "text-embedding-3-small"
LLM_MODEL_NAME = "gpt-4o-mini" # LLM for generating responses
LLM_TEMPERATURE = 0.1 # Lower for more factual and less creative responses
RETRIEVER_K = 4 # Number of relevant chunks to retrieve

# --- Simple Logging (optional, but useful for debugging) ---
import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def initialize_qa_system():
    """
    Initialises all necessary components for the Question Answering (RAG) system
    and returns the configured QA chain.
    """
    logger.info("Initialising Paulean AI QA system...")

    # 1. Verify and Initialise the Embeddings Model
    logger.info(f"Attempting to initialise embeddings model: {EMBEDDING_MODEL_NAME}")
    try:
        embeddings_model = OpenAIEmbeddings(model=EMBEDDING_MODEL_NAME)
        # Quick test to ensure the model and API key are working
        _ = embeddings_model.embed_query("Connectivity test")
        logger.info(f"Embeddings model '{EMBEDDING_MODEL_NAME}' initialised successfully.")
    except Exception as e:
        logger.error(f"Failed to initialise OpenAI embeddings model: {e}")
        logger.error("Please check your OPENAI_API_KEY and internet connection.")
        return None

    # 2. Load the Persisted ChromaDB Vector Store
    logger.info(f"Attempting to load Vector Store from: {CHROMA_PERSIST_DIR}")
    if not Path(CHROMA_PERSIST_DIR).exists():
        logger.error(f"Vector Store directory '{CHROMA_PERSIST_DIR}' not found.")
        logger.error("Please ensure the 'process_markdown_with_langchain.py' script has been run successfully first.")
        return None

    try:
        vector_store = Chroma(
            persist_directory=CHROMA_PERSIST_DIR,
            embedding_function=embeddings_model
        )
        collection_count = vector_store._collection.count()
        if collection_count == 0:
            logger.warning(f"Vector Store at '{CHROMA_PERSIST_DIR}' loaded, but it is empty (0 documents).")
            logger.warning("Please check the output of the 'process_markdown_with_langchain.py' script.")
        else:
            logger.info(f"Vector Store loaded successfully from '{CHROMA_PERSIST_DIR}'. It contains {collection_count} documents.")
    except Exception as e:
        logger.error(f"Failed to load ChromaDB Vector Store: {e}", exc_info=True)
        return None

    # 3. Initialise the Language Model (LLM) for Response Generation
    logger.info(f"Attempting to initialise LLM: {LLM_MODEL_NAME} with temperature {LLM_TEMPERATURE}")
    try:
        llm = ChatOpenAI(model_name=LLM_MODEL_NAME, temperature=LLM_TEMPERATURE)
        logger.info(f"LLM '{LLM_MODEL_NAME}' initialised successfully.")
    except Exception as e:
        logger.error(f"Failed to initialise LLM: {e}")
        logger.error("Please check your OPENAI_API_KEY and model settings.")
        return None

    # 4. Create the RetrievalQA Chain
    # This chain combines retrieval from the vector store with response generation by the LLM.
    # You can customise the prompt here if needed:
    # prompt_template = """Use the following pieces of context to answer the question at the end.
    # If you don't know the answer, just say that you don't know, don't try to make up an answer.
    # Try to provide a concise answer.
    # Context: {context}
    # Question: {question}
    # Helpful Answer:"""
    # QA_CHAIN_PROMPT = PromptTemplate.from_template(prompt_template)

    logger.info(f"Configuring RetrievalQA chain with k={RETRIEVER_K} documents for retrieval.")
    try:
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",  # "stuff": simply puts all retrieved documents directly into the prompt.
            # Suitable if the total context of k chunks fits within the LLM's limit.
            retriever=vector_store.as_retriever(
                search_type="similarity", # Standard cosine similarity search
                search_kwargs={"k": RETRIEVER_K} # Retrieve the top k relevant chunks
            ),
            return_source_documents=True, # Essential for getting sources for "double-checking"
            # chain_type_kwargs={"prompt": QA_CHAIN_PROMPT} # Uncomment to use the custom prompt
        )
        logger.info("RetrievalQA chain configured successfully.")
        return qa_chain
    except Exception as e:
        logger.error(f"Failed to create RetrievalQA chain: {e}", exc_info=True)
        return None

def get_answer_and_sources(qa_chain_instance, user_question: str) -> dict | None:
    """
    Asks a question to the QA chain and returns a dictionary containing the answer and sources.
    """
    if not qa_chain_instance:
        logger.error("QA system is not initialised. Cannot process question.")
        return None

    logger.info(f"Processing user's question: '{user_question}'")
    try:
        # .invoke is the standard way to run chains in recent LangChain versions
        response = qa_chain_instance.invoke({"query": user_question})

        answer = response.get("result", "I'm sorry, I couldn't generate an answer for that.")
        source_docs = response.get("source_documents", [])

        unique_sources_list = []
        if source_docs:
            # Use a set to track (title, url) combinations already added
            # to avoid exact duplicates in the sources list.
            seen_source_keys = set()
            for doc in source_docs:
                source_url = doc.metadata.get('source_url', 'Unknown URL')
                page_title = doc.metadata.get('page_title', 'Unknown Title')
                source_key = (page_title, source_url) # Key for checking uniqueness

                if source_key not in seen_source_keys:
                    unique_sources_list.append({
                        "title": page_title,
                        "url": source_url,
                        "content_preview": doc.page_content[:200] + "..." # Preview of the chunk
                    })
                    seen_source_keys.add(source_key)

        logger.info(f"Answer generated. {len(unique_sources_list)} unique source(s) found.")
        return {
            "answer": answer,
            "sources": unique_sources_list
        }

    except Exception as e:
        logger.error(f"Error processing question '{user_question}' with QA chain: {e}", exc_info=True)
        return None

if __name__ == "__main__":
    # Verify if the OpenAI API key is set in the environment
    if not os.getenv("OPENAI_API_KEY"):
        logger.critical("CRITICAL ERROR: The OPENAI_API_KEY environment variable is not set.")
        logger.critical("Please set it and try again. E.g., $env:OPENAI_API_KEY='sk-...'")
        sys.exit(1) # Exit the script if the key is not set
    else:
        logger.info("OPENAI_API_KEY environment variable found.")

    # Initialise the QA system (loads models, vector store, etc.)
    paulean_qa_system = initialize_qa_system()

    if paulean_qa_system:
        logger.info("Paulean AI is ready to answer. Type 'exit' to finish.")
        # Interactive loop for asking questions via the command line
        while True:
            try:
                user_query = input("\nYou: ")
                if user_query.strip().lower() == 'exit':
                    logger.info("Exiting Paulean AI...")
                    break
                if not user_query.strip():
                    continue # Ignore empty input

                result_data = get_answer_and_sources(paulean_qa_system, user_query)

                if result_data:
                    print("\nPaulean AI:")
                    print(result_data["answer"])

                    if result_data["sources"]:
                        print("\nSources (for double-checking):")
                        for idx, source in enumerate(result_data["sources"]):
                            print(f"  {idx+1}. Title: {source['title']}")
                            print(f"     URL: {source['url']}")
                            # print(f"     Preview: {source['content_preview']}") # Uncomment to see chunk preview
                    else:
                        print("\nNo specific sources found for this answer.")
                else:
                    print("Paulean AI: I'm sorry, there was a problem processing your question.")

            except KeyboardInterrupt: # Handle Ctrl+C during input
                logger.info("\nExiting Paulean AI due to user interruption...")
                break
            except Exception as e: # Catch other unexpected errors in the main loop
                logger.error(f"Unexpected error in main loop: {e}", exc_info=True)
                break # Exit loop on critical error
    else:
        logger.critical("Failed to initialise the Paulean AI system. Please check logs for details.")
        sys.exit(1)