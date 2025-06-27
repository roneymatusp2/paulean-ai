# 🚀 Deploy Guide - PauleanAI no Netlify

## 📋 Pré-requisitos

- Conta no [Netlify](https://netlify.com)
- Repositório GitHub com o código do PauleanAI
- Variáveis de ambiente configuradas

## 🔧 Configuração no Netlify

### 1. Conectar Repositório
1. Acesse [Netlify Dashboard](https://app.netlify.com)
2. Clique em "New site from Git"
3. Conecte com GitHub e selecione o repositório `paulean-ai`
4. Configure as seguintes opções:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: (deixe vazio)

### 2. Variáveis de Ambiente
Configure as seguintes variáveis em **Site settings > Environment variables**:

#### Supabase
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

#### OpenAI APIs
```
VITE_OPENAI_API_KEY_1=sk-proj-your_openai_api_key_1_here
VITE_OPENAI_API_KEY_2=sk-proj-your_openai_api_key_2_here
VITE_OPENAI_API_KEY_3=sk-proj-your_openai_api_key_3_here
VITE_OPENAI_API_KEY_4=sk-proj-your_openai_api_key_4_here
```

#### Claude (Anthropic)
```
VITE_CLAUDE_API_KEY_1=sk-ant-api03-your_claude_api_key_1_here
VITE_CLAUDE_API_KEY_2=sk-ant-api03-your_claude_api_key_2_here
```

#### Mistral AI
```
VITE_MISTRAL_API_KEY_1=your_mistral_api_key_1_here
VITE_MISTRAL_API_KEY_2=your_mistral_api_key_2_here
```

#### DeepSeek
```
VITE_DEEPSEEK_API_KEY_1=sk-your_deepseek_api_key_1_here
VITE_DEEPSEEK_API_KEY_2=sk-your_deepseek_api_key_2_here
```

#### Langfuse
```
VITE_LANGFUSE_SECRET_KEY=sk-lf-your_langfuse_secret_key_here
VITE_LANGFUSE_PUBLIC_KEY=pk-lf-your_langfuse_public_key_here
VITE_LANGFUSE_BASEURL=https://us.cloud.langfuse.com
```

#### TopMedia & Google
```
VITE_TOPMEDIA_API_KEY=your_topmedia_api_key_here
VITE_GOOGLE_API_KEY_1=AIzaSy-your_google_api_key_1_here
VITE_GOOGLE_API_KEY_2=AIzaSy-your_google_api_key_2_here
VITE_GOOGLE_CLIENT_ID_1=your_client_id_1.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_ID_2=your_client_id_2.apps.googleusercontent.com
```

#### Image Generator
```
VITE_IMAGE_GENERATOR_API_KEY=sk-proj-your_image_generator_api_key_here
```

### 3. Build Settings
No arquivo `netlify.toml` já estão configuradas:
- ✅ Comando de build: `npm run build`
- ✅ Diretório de publicação: `dist`
- ✅ Node.js versão 18
- ✅ Redirects para SPA
- ✅ Headers de segurança
- ✅ Proxy para APIs

## 🌐 Domínio Personalizado

### Configurar Domínio
1. Vá em **Site settings > Domain management**
2. Clique em "Add custom domain"
3. Digite seu domínio (ex: `pauleanai.stpauls.br`)
4. Configure DNS:
   ```
   CNAME pauleanai melodious-fudge-8079a2.netlify.app
   ```

### SSL/HTTPS
- ✅ Netlify configura automaticamente SSL gratuito
- ✅ Força redirecionamento HTTPS

## 📊 Monitoramento

### Analytics
- Netlify Analytics está habilitado
- Lighthouse CI configurado para performance

### Logs
- Build logs disponíveis no dashboard
- Function logs para debugging

## 🔧 Comandos Úteis

### Build Local
```bash
npm run build
npm run preview
```

### Deploy Manual
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

## 🚨 Troubleshooting

### Erro de Build
1. Verifique se todas as dependências estão instaladas
2. Confirme que as variáveis de ambiente estão configuradas
3. Teste o build localmente: `npm run build`

### Erro 404 em Rotas
- ✅ Arquivo `_redirects` configurado
- ✅ `netlify.toml` com redirects SPA

### Erro de API
1. Verifique se as variáveis de ambiente estão corretas
2. Confirme se os proxies estão funcionando
3. Teste endpoints diretamente

## 📈 Performance

### Otimizações Configuradas
- ✅ Compressão de imagens
- ✅ Minificação CSS/JS
- ✅ Cache headers otimizados
- ✅ Bundle splitting automático

### Métricas Esperadas
- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 4s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 5s

## 🎯 URLs de Produção

Após o deploy, o site estará disponível em:
- **Netlify URL**: `https://melodious-fudge-8079a2.netlify.app`
- **Domínio Personalizado**: `https://pauleanai.stpauls.br` (se configurado)

## 🔐 Segurança

### Headers Configurados
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

### CORS
- Configurado para APIs externas
- Supabase e Overleaf integrations

---

**Deploy Status**: ✅ Pronto para produção
**Última Atualização**: Dezembro 2024 