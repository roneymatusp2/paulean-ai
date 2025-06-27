# Correção do Paulean AI - Guia Completo

## Problema Identificado
O erro 500 está ocorrendo porque:
1. As Edge Functions estão verificando JWT (verify_jwt: true)
2. A chave OpenAI (OPENAI_API_KEY) provavelmente não está configurada

## Solução Passo a Passo

### 1. Configurar a Chave OpenAI no Supabase

Abra o PowerShell e execute:

```powershell
# Substitua YOUR_OPENAI_KEY pela sua chave real
$OPENAI_KEY = "YOUR_OPENAI_KEY"

# Use Supabase CLI ou vá para o Dashboard
supabase secrets set OPENAI_API_KEY=$OPENAI_KEY --project-ref gjvtncdjcslnkfctqnfy
```

OU faça pelo Dashboard do Supabase:
1. Vá para https://supabase.com/dashboard/project/gjvtncdjcslnkfctqnfy/settings/vault
2. Clique em "New secret"
3. Nome: `OPENAI_API_KEY`
4. Valor: Sua chave OpenAI
5. Salve

### 2. Desabilitar JWT Verification (IMPORTANTE!)

No Dashboard do Supabase:
1. Vá para https://supabase.com/dashboard/project/gjvtncdjcslnkfctqnfy/functions
2. Para cada função:
   - `ask-paulean`
   - `transcribe-paulean-audio`
   - `speak-paulean-answer`
3. Clique na função
4. Vá em "Settings" 
5. Desmarque "Verify JWT"
6. Salve

### 3. Teste Básico

Abra o arquivo `test-api.html` no navegador:
```
file:///C:/Users/roney/WebstormProjects/paulean-ai/test-api.html
```

### 4. Verificar Logs

Se ainda tiver problemas, verifique os logs no Supabase:
1. Vá para https://supabase.com/dashboard/project/gjvtncdjcslnkfctqnfy/logs/edge-functions
2. Procure por erros nas funções

### 5. Arquivo .env Correto

Certifique-se que seu arquivo `.env` tem:
```
VITE_SUPABASE_URL=https://gjvtncdjcslnkfctqnfy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqdnRuY2RqY3NsbmtmY3RxbmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NzM0MDEsImV4cCI6MjA1OTU0OTQwMX0.AzALxUUvYLJJtDkvxt7efJ7bGxeKmzOs-fT5bQOndiU
```

### 6. Reiniciar a Aplicação

```bash
# Pare o servidor (Ctrl+C)
# Reinicie
npm run dev
```

## Teste Final

1. Abra http://localhost:5173
2. Clique no botão Paulean AI
3. Digite "Who is Dr. Hallinan?"
4. Verifique o console do navegador

## Se Ainda Tiver Problemas

Execute este comando para ver os logs detalhados:
```bash
# No navegador, abra o Console (F12)
# Procure por mensagens como:
# - "Supabase URL: ..."
# - "OpenAI key found: ..."
# - "API Error Details: ..."
```

A chave para resolver é:
1. ✅ Configurar OPENAI_API_KEY no Supabase
2. ✅ Desabilitar JWT verification
3. ✅ Testar com test-api.html primeiro