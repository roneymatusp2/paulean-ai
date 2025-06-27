#!/bin/bash

# Script para rodar a API localmente

echo "🚀 Iniciando Paulean AI API..."

# Verificar se o ambiente virtual existe
if [ ! -d "venv" ]; then
    echo "📦 Criando ambiente virtual..."
    python -m venv venv
fi

# Ativar ambiente virtual
echo "🔄 Ativando ambiente virtual..."
source venv/bin/activate || . venv/Scripts/activate

# Instalar dependências
echo "📚 Instalando dependências..."
pip install -r requirements-api.txt

# Verificar se .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "📝 Criando .env a partir do exemplo..."
    cp .env.example .env
    echo "🔑 Por favor, adicione sua OPENAI_API_KEY no arquivo .env"
    exit 1
fi

# Verificar se o ChromaDB existe
if [ ! -d "vectorstore/stpauls_chroma_db" ]; then
    echo "⚠️  ChromaDB não encontrado!"
    echo "📊 Execute primeiro: python process_markdown_with_langchain.py"
    exit 1
fi

# Rodar a API
echo "✅ Iniciando servidor..."
echo "🌐 API disponível em: http://localhost:8000"
echo "📖 Documentação em: http://localhost:8000/docs"
echo ""
echo "Pressione Ctrl+C para parar o servidor"
echo ""

uvicorn main:app --reload --host 0.0.0.0 --port 8000