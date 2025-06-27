# Script para rodar a API no Windows

Write-Host "🚀 Iniciando Paulean AI API..." -ForegroundColor Green

# Verificar se o ambiente virtual existe
if (-not (Test-Path "venv")) {
    Write-Host "📦 Criando ambiente virtual..." -ForegroundColor Yellow
    python -m venv venv
}

# Ativar ambiente virtual
Write-Host "🔄 Ativando ambiente virtual..." -ForegroundColor Yellow
& "venv\Scripts\Activate.ps1"

# Instalar dependências
Write-Host "📚 Instalando dependências..." -ForegroundColor Yellow
pip install -r requirements-api.txt

# Verificar se .env existe
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Arquivo .env não encontrado!" -ForegroundColor Red
    Write-Host "📝 Criando .env a partir do exemplo..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "🔑 Por favor, adicione sua OPENAI_API_KEY no arquivo .env" -ForegroundColor Red
    exit 1
}

# Verificar se o ChromaDB existe
if (-not (Test-Path "vectorstore\stpauls_chroma_db")) {
    Write-Host "⚠️  ChromaDB não encontrado!" -ForegroundColor Red
    Write-Host "📊 Execute primeiro: python process_markdown_with_langchain.py" -ForegroundColor Red
    exit 1
}

# Rodar a API
Write-Host "✅ Iniciando servidor..." -ForegroundColor Green
Write-Host "🌐 API disponível em: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📖 Documentação em: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
Write-Host ""

uvicorn main:app --reload --host 0.0.0.0 --port 8000