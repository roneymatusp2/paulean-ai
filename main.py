from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import shutil
import io
import os
from pathlib import Path
import tempfile

# Importações do LangChain/OpenAI
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.retrievers.multi_query import MultiQueryRetriever
from openai import OpenAI as OpenAIClient

# Carregar variáveis de ambiente
from dotenv import load_dotenv
load_dotenv()

# Inicializar FastAPI
app = FastAPI(title="Paulean AI API", version="1.0.0")

# Configurações
CHROMA_PERSIST_DIR = "vectorstore/stpauls_chroma_db"
EMBEDDING_MODEL_NAME = "text-embedding-3-small"
LLM_MODEL_NAME = "gpt-4o-mini"
LLM_TEMPERATURE = 0.1
RETRIEVER_K = 4
USE_MULTI_QUERY = True  # Configurável

# Configurar CORS
origins = [
    "http://localhost",
    "http://localhost:5173",    # Vite
    "http://localhost:3000",    # Create React App
    "http://localhost:8080",    # Alternativa
    "https://paulean-ai.netlify.app",  # Seu domínio no Netlify (ajuste quando tiver)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar cliente OpenAI para TTS e STT
try:
    openai_speech_client = OpenAIClient()
    print("Cliente OpenAI para fala inicializado com sucesso.")
except Exception as e:
    print(f"Erro ao inicializar cliente OpenAI para fala: {e}")
    openai_speech_client = None

# Função para carregar o sistema de QA
def load_qa_system():
    if not Path(CHROMA_PERSIST_DIR).exists():
        raise RuntimeError(f"Diretório do Vector Store '{CHROMA_PERSIST_DIR}' não encontrado.")
    
    print(f"Carregando vector store de '{CHROMA_PERSIST_DIR}'...")
    embeddings_model = OpenAIEmbeddings(model=EMBEDDING_MODEL_NAME)
    vector_store = Chroma(
        persist_directory=CHROMA_PERSIST_DIR,
        embedding_function=embeddings_model
    )
    
    doc_count = vector_store._collection.count()
    if doc_count == 0:
        print(f"AVISO: Vector Store em '{CHROMA_PERSIST_DIR}' está vazio.")
    else:
        print(f"Vector store carregado com {doc_count} documentos.")
    
    llm = ChatOpenAI(
        model_name=LLM_MODEL_NAME,
        temperature=LLM_TEMPERATURE
    )
    
    # Configurar retriever
    if USE_MULTI_QUERY:
        base_retriever = vector_store.as_retriever(search_kwargs={"k": RETRIEVER_K})
        retriever = MultiQueryRetriever.from_llm(
            retriever=base_retriever,
            llm=llm
        )
        print("Usando MultiQueryRetriever.")
    else:
        retriever = vector_store.as_retriever(search_kwargs={"k": RETRIEVER_K})
        print("Usando retriever básico.")
    
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True
    )
    
    return qa_chain

# Carregar sistema de QA na inicialização
try:
    qa_chain_instance = load_qa_system()
    print("Sistema de QA carregado com sucesso.")
except Exception as e:
    print(f"FALHA CRÍTICA ao carregar o sistema de QA: {e}")
    qa_chain_instance = None

# Modelos Pydantic
class QueryRequest(BaseModel):
    query: str
    generate_speech: bool = False

class SourceDocumentResponse(BaseModel):
    title: Optional[str]
    url: Optional[str]
    content_preview: Optional[str] = None

class AnswerResponse(BaseModel):
    answer: str
    sources: List[SourceDocumentResponse]
    audio_url: Optional[str] = None
    error: Optional[str] = None

class TextToSpeechRequest(BaseModel):
    text: str
    voice: str = "nova"  # alloy, echo, fable, onyx, nova, shimmer

class TranscribeResponse(BaseModel):
    transcribed_text: str
    error: Optional[str] = None

# Endpoint principal - perguntas
@app.post("/api/ask", response_model=AnswerResponse)
async def ask_ai(request: QueryRequest):
    if not qa_chain_instance:
        return AnswerResponse(
            answer="",
            sources=[],
            error="Sistema de IA não inicializado corretamente."
        )
    
    try:
        print(f"Processando pergunta: {request.query}")
        result = qa_chain_instance.invoke({"query": request.query})
        
        answer_text = result.get("result", "Desculpe, não consegui encontrar uma resposta.")
        source_docs_data = result.get("source_documents", [])
        
        # Processar fontes únicas
        unique_sources = []
        seen_source_keys = set()
        
        for doc in source_docs_data:
            source_url = doc.metadata.get('source_url', '')
            page_title = doc.metadata.get('page_title', 'Título Desconhecido')
            content_preview = doc.page_content[:200] + "..." if len(doc.page_content) > 200 else doc.page_content
            
            source_key = (page_title, source_url)
            if source_key not in seen_source_keys:
                unique_sources.append(SourceDocumentResponse(
                    title=page_title,
                    url=source_url,
                    content_preview=content_preview
                ))
                seen_source_keys.add(source_key)
        
        print(f"Resposta gerada com {len(unique_sources)} fontes.")
        
        return AnswerResponse(
            answer=answer_text,
            sources=unique_sources,
            audio_url=None
        )
        
    except Exception as e:
        print(f"Erro no endpoint /api/ask: {e}")
        return AnswerResponse(
            answer="",
            sources=[],
            error=f"Erro ao processar a pergunta: {str(e)}"
        )

# Endpoint para Text-to-Speech
@app.post("/api/generate_speech")
async def generate_speech_endpoint(request: TextToSpeechRequest):
    if not openai_speech_client:
        raise HTTPException(status_code=503, detail="Serviço de TTS não disponível.")
    
    try:
        print(f"Gerando áudio para: {request.text[:50]}...")
        
        response = openai_speech_client.audio.speech.create(
            model="tts-1",
            voice=request.voice,
            input=request.text,
            response_format="mp3"
        )
        
        print("Áudio gerado com sucesso.")
        return StreamingResponse(
            io.BytesIO(response.content),
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "inline; filename=speech.mp3"
            }
        )
        
    except Exception as e:
        print(f"Erro ao gerar áudio: {e}")
        raise HTTPException(status_code=500, detail=f"Falha ao gerar áudio: {str(e)}")

# Endpoint para Speech-to-Text
@app.post("/api/transcribe", response_model=TranscribeResponse)
async def transcribe_audio_endpoint(audio_file: UploadFile = File(...)):
    if not openai_speech_client:
        return TranscribeResponse(
            transcribed_text="",
            error="Serviço de transcrição não disponível."
        )
    
    temp_file_path = None
    try:
        print(f"Recebendo arquivo de áudio: {audio_file.filename}")
        
        # Criar arquivo temporário
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=os.path.splitext(audio_file.filename)[1]
        ) as temp_file:
            temp_file_path = temp_file.name
            shutil.copyfileobj(audio_file.file, temp_file)
        
        print(f"Arquivo salvo temporariamente em: {temp_file_path}")
        
        # Transcrever com Whisper
        with open(temp_file_path, "rb") as audio_data:
            transcription_response = openai_speech_client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_data,
                language="pt"  # Especificar português se for o caso
            )
        
        transcribed_text = transcription_response.text
        print(f"Transcrição concluída: {transcribed_text[:50]}...")
        
        return TranscribeResponse(transcribed_text=transcribed_text)
        
    except Exception as e:
        print(f"Erro na transcrição: {e}")
        return TranscribeResponse(
            transcribed_text="",
            error=f"Falha na transcrição: {str(e)}"
        )
    finally:
        # Limpar arquivo temporário
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            print("Arquivo temporário removido.")

# Endpoint de health check
@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "qa_system": "ready" if qa_chain_instance else "not_initialized",
        "speech_services": "ready" if openai_speech_client else "not_initialized",
        "vector_store_path": CHROMA_PERSIST_DIR
    }

# Endpoint raiz
@app.get("/")
async def root():
    return {
        "message": "Paulean AI API está rodando!",
        "version": "1.0.0",
        "endpoints": [
            "/api/ask",
            "/api/generate_speech",
            "/api/transcribe",
            "/api/health"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)