# Paulean AI - Backend API

## Configuração Inicial

1. **Instalar dependências**:
```bash
pip install -r requirements-api.txt
```

2. **Configurar variáveis de ambiente**:
```bash
cp .env.example .env
# Edite o arquivo .env e adicione sua OPENAI_API_KEY
```

3. **Garantir que o ChromaDB foi criado**:
```bash
# Se ainda não criou o vector store, execute:
python process_markdown_with_langchain.py
```

## Executar a API

### Desenvolvimento Local:
```bash
# Ativar ambiente virtual
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# Rodar o servidor
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

A API estará disponível em: http://localhost:8000

### Verificar se está funcionando:
- Abra http://localhost:8000 no navegador
- Teste a saúde: http://localhost:8000/api/health
- Documentação automática: http://localhost:8000/docs

## Endpoints da API

### 1. `/api/ask` (POST)
Envia uma pergunta e recebe resposta com fontes.

**Request:**
```json
{
  "query": "Qual é o horário de funcionamento da escola?",
  "generate_speech": false
}
```

**Response:**
```json
{
  "answer": "A escola funciona de segunda a sexta...",
  "sources": [
    {
      "title": "Horários",
      "url": "https://www.stpauls.br/horarios",
      "content_preview": "Horários de funcionamento..."
    }
  ],
  "audio_url": null,
  "error": null
}
```

### 2. `/api/generate_speech` (POST)
Converte texto em áudio (MP3).

**Request:**
```json
{
  "text": "Olá, bem-vindo ao St. Paul's School",
  "voice": "nova"
}
```

**Response:** Arquivo MP3 (audio/mpeg)

### 3. `/api/transcribe` (POST)
Converte áudio em texto.

**Request:** Form-data com arquivo de áudio
- Campo: `audio_file`
- Formatos suportados: MP3, WAV, WEBM, etc.

**Response:**
```json
{
  "transcribed_text": "Qual é o calendário escolar?",
  "error": null
}
```

### 4. `/api/health` (GET)
Verifica o status da API.

**Response:**
```json
{
  "status": "ok",
  "qa_system": "ready",
  "speech_services": "ready",
  "vector_store_path": "vectorstore/stpauls_chroma_db"
}
```

## Deploy em Produção

### Opção 1: Render.com (Recomendado)

1. Crie uma conta no [Render.com](https://render.com)

2. Crie um novo Web Service:
   - Source: GitHub repo
   - Branch: main
   - Root Directory: .
   - Environment: Python 3
   - Build Command: `pip install -r requirements-api.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. Configure as variáveis de ambiente:
   - `OPENAI_API_KEY`: sua chave da OpenAI
   - Outras variáveis do .env se necessário

4. Deploy!

### Opção 2: Railway.app

1. Crie uma conta no [Railway](https://railway.app)

2. Conecte seu GitHub e selecione o repositório

3. Configure:
   - Builder: Python
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. Adicione variáveis de ambiente

### Opção 3: Fly.io

1. Instale o CLI do Fly.io
2. Crie um arquivo `fly.toml`:

```toml
app = "paulean-ai-api"
primary_region = "gru"  # São Paulo

[build]
  builder = "paketobuildpacks/builder:base"

[env]
  PORT = "8080"

[[services]]
  http_checks = []
  internal_port = 8080
  protocol = "tcp"
  script_checks = []

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

3. Deploy:
```bash
fly launch
fly secrets set OPENAI_API_KEY=your-key
fly deploy
```

## Considerações de Produção

1. **Armazenamento do ChromaDB**:
   - Em produção, considere usar um banco de dados vetorial hospedado
   - Ou configure volume persistente no serviço de deploy

2. **Segurança**:
   - Configure CORS adequadamente
   - Use HTTPS sempre
   - Limite taxa de requisições

3. **Performance**:
   - Configure cache para respostas frequentes
   - Use workers assíncronos
   - Monitore uso da API OpenAI

## Integração com Frontend

No seu frontend React, configure a URL da API:

```javascript
// .env do React
REACT_APP_API_URL=https://sua-api.onrender.com
```

Ou em desenvolvimento:
```javascript
REACT_APP_API_URL=http://localhost:8000
```

## Monitoramento

Adicione logs e métricas:

```python
import logging
logging.basicConfig(level=logging.INFO)

# No seu código
logger = logging.getLogger(__name__)
logger.info(f"Processando pergunta: {query}")
```

## Troubleshooting

1. **Erro 503 - Sistema não inicializado**:
   - Verifique se o ChromaDB existe
   - Confirme que OPENAI_API_KEY está configurada

2. **Erro de CORS**:
   - Adicione a URL do seu frontend na lista de origens permitidas

3. **Timeout em produção**:
   - Aumente timeout do servidor
   - Otimize queries do ChromaDB