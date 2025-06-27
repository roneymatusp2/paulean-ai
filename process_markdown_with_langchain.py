from pathlib import Path
import os
import shutil # Para remover o diretório do ChromaDB se ele já existir e quisermos recriar

# --- LangChain Imports ---
from langchain_community.document_loaders import UnstructuredMarkdownLoader
from langchain.text_splitter import MarkdownHeaderTextSplitter, RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings # Para embeddings da OpenAI
from langchain_community.vectorstores import Chroma # Para o Vector Store ChromaDB

# --- Configuração ---
CRAWLER_OUTPUT_DIR = Path("data/site")
BASE_URL = "https://www.stpauls.br"
CHROMA_PERSIST_DIR = Path("vectorstore/stpauls_chroma_db") # Diretório para salvar o ChromaDB
# Certifique-se de que sua chave OPENAI_API_KEY está definida como variável de ambiente
# Ex: $env:OPENAI_API_KEY="sk-..." no PowerShell ou export OPENAI_API_KEY="sk-..." no bash/zsh

# --- Função Auxiliar para obter URL original do caminho do arquivo ---
def get_url_from_file_path(file_path: Path, base_data_dir: Path, site_base_url: str) -> str:
    relative_path = file_path.relative_to(base_data_dir)
    url_parts = list(relative_path.parts)
    if url_parts and url_parts[-1].lower() == "index.md":
        url_parts.pop()
    elif url_parts and url_parts[-1].lower().endswith(".md"):
        url_parts[-1] = url_parts[-1][:-3]
    url_path_segment = "/".join(url_parts)
    if not url_path_segment.startswith("/"):
        url_path_segment = "/" + url_path_segment
    if url_parts:
        last_segment = url_parts[-1]
        if '.' not in last_segment and not url_path_segment.endswith('/'):
            url_path_segment += '/'
    elif not url_path_segment.endswith('/'):
        url_path_segment += '/'
    return site_base_url.rstrip("/") + url_path_segment


def main():
    print(f"Iniciando processamento dos arquivos Markdown de: {CRAWLER_OUTPUT_DIR}")
    all_document_chunks = []

    headers_to_split_on = [
        ("#", "Header 1"), ("##", "Header 2"), ("###", "Header 3"),
    ]
    markdown_splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on=headers_to_split_on, strip_headers=False
    )
    recursive_fallback_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1500, chunk_overlap=200,
        separators=["\n\n", "\n", ". ", " ", ""]
    )

    markdown_files_found = list(CRAWLER_OUTPUT_DIR.rglob("*.md"))
    print(f"Encontrados {len(markdown_files_found)} arquivos Markdown para processar.")

    if not markdown_files_found:
        print("Nenhum arquivo Markdown encontrado. Verifique o CRAWLER_OUTPUT_DIR.")
        return

    for md_file_path in markdown_files_found:
        print(f"\n--- Processando arquivo: {md_file_path} ---")
        original_url = get_url_from_file_path(md_file_path, CRAWLER_OUTPUT_DIR, BASE_URL)
        print(f"URL de origem mapeada: {original_url}")

        try:
            with open(md_file_path, "r", encoding="utf-8") as f:
                markdown_text_content = f.read()
            if not markdown_text_content.strip():
                print(f"Arquivo {md_file_path} está vazio. Pulando.")
                continue

            header_based_chunks = markdown_splitter.split_text(markdown_text_content)
            print(f"  Dividido em {len(header_based_chunks)} chunks baseados em cabeçalhos.")

            for i, header_chunk in enumerate(header_based_chunks):
                header_chunk.metadata["source_url"] = original_url
                if "Header 1" in header_chunk.metadata:
                    header_chunk.metadata["page_title"] = header_chunk.metadata["Header 1"]
                else:
                    first_h1_match = next((line[2:].strip() for line in markdown_text_content.splitlines() if line.startswith("# ")), None)
                    header_chunk.metadata["page_title"] = first_h1_match if first_h1_match else md_file_path.stem

                # Garantir que page_content não seja None ou vazio antes de verificar o tamanho
                if header_chunk.page_content and len(header_chunk.page_content) > recursive_fallback_splitter._chunk_size:
                    print(f"    Chunk {i} (baseado em cabeçalho) é muito grande ({len(header_chunk.page_content)} chars), aplicando RecursiveSplitter...")
                    sub_chunks = recursive_fallback_splitter.create_documents(
                        texts=[header_chunk.page_content],
                        metadatas=[header_chunk.metadata.copy()]
                    )
                    all_document_chunks.extend(sub_chunks)
                    print(f"      Dividido em {len(sub_chunks)} sub-chunks.")
                elif header_chunk.page_content: # Adicionar apenas se tiver conteúdo
                    all_document_chunks.append(header_chunk)
                else:
                    print(f"    Chunk {i} (baseado em cabeçalho) tem conteúdo vazio. Pulando.")

        except Exception as e:
            print(f"ERRO ao processar o arquivo {md_file_path}: {e}")

    print(f"\n--- Processamento de Chunks Concluído ---")
    print(f"Total de chunks gerados: {len(all_document_chunks)}")

    if not all_document_chunks:
        print("Nenhum chunk foi gerado. Verifique os arquivos de entrada e a lógica de segmentação.")
        return

    # --- ETAPA DE EMBEDDING E ARMAZENAMENTO NO VECTOR STORE ---
    print("\n--- Iniciando Etapa de Embedding e Armazenamento no Vector Store ---")

    # 1. Inicializar o modelo de embeddings
    # Use text-embedding-3-small para eficiência e boa performance
    print("Inicializando modelo de embeddings OpenAI (text-embedding-3-small)...")
    try:
        embeddings_model = OpenAIEmbeddings(model="text-embedding-3-small")
        # Teste rápido para ver se o modelo carrega (requer chave de API válida)
        _ = embeddings_model.embed_query("Teste de embedding")
        print("Modelo de embeddings inicializado com sucesso.")
    except Exception as e:
        print(f"ERRO ao inicializar o modelo de embeddings OpenAI: {e}")
        print("Verifique se a variável de ambiente OPENAI_API_KEY está configurada corretamente.")
        return

    # 2. Criar ou Carregar o Vector Store ChromaDB
    # Para recriar o banco de dados do zero a cada execução (útil durante o desenvolvimento):
    if CHROMA_PERSIST_DIR.exists():
        print(f"Diretório do Vector Store existente encontrado em '{CHROMA_PERSIST_DIR}'. Removendo para recriar...")
        shutil.rmtree(CHROMA_PERSIST_DIR) # Remove o diretório antigo

    print(f"Criando novo Vector Store ChromaDB em: {CHROMA_PERSIST_DIR}")

    try:
        vector_store = Chroma.from_documents(
            documents=all_document_chunks,  # A lista de Documentos LangChain (chunks)
            embedding=embeddings_model,     # O modelo de embedding a ser usado
            persist_directory=str(CHROMA_PERSIST_DIR) # Caminho para salvar o banco de dados
        )
        # Chroma.from_documents já persiste automaticamente se persist_directory for fornecido.
        # Mas uma chamada explícita a persist() não faz mal e garante.
        vector_store.persist()
        print(f"Vector Store criado e salvo com sucesso em '{CHROMA_PERSIST_DIR}'.")
        print(f"Total de vetores/documentos no store: {vector_store._collection.count()}")

    except Exception as e:
        print(f"ERRO ao criar ou popular o Vector Store ChromaDB: {e}")
        return

    print("\n--- Demonstração: Testando uma busca por similaridade ---")
    if vector_store:
        query = "What is the history of St. Paul's School?"
        print(f"Buscando por similaridade para a query: '{query}'")
        try:
            similar_docs = vector_store.similarity_search(query, k=3) # k=3 para obter os 3 mais similares
            if similar_docs:
                print(f"Encontrados {len(similar_docs)} documentos similares:")
                for i, doc in enumerate(similar_docs):
                    print(f"\n--- Documento Similar {i+1} ---")
                    print(f"Conteúdo (primeiros 150 chars): {doc.page_content[:150]}...")
                    print(f"Metadados (source_url): {doc.metadata.get('source_url')}")
                    print(f"Metadados (page_title): {doc.metadata.get('page_title')}")
            else:
                print("Nenhum documento similar encontrado para a query de teste.")
        except Exception as e:
            print(f"ERRO durante a busca por similaridade de teste: {e}")

    print("\n--- Script Concluído ---")

if __name__ == "__main__":
    # Verificar se a chave da API OpenAI está definida
    if not os.getenv("OPENAI_API_KEY"):
        print("ERRO: A variável de ambiente OPENAI_API_KEY não está definida.")
        print("Por favor, defina-a antes de executar o script.")
        # sys.exit(1) # Descomente para sair se a chave não estiver definida
    else:
        print("Variável de ambiente OPENAI_API_KEY encontrada.")
    main()