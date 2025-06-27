# Teste dos Links do Mirror

## Para testar

1. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Abra o navegador em: http://localhost:5173

3. Clique no botão flutuante do Paulean (canto inferior direito)

4. Digite uma pergunta como:
   - "Tell me about St. Paul's School"
   - "What are the academic programs?"
   - "How can I apply for admissions?"

5. Quando aparecerem as fontes, clique nos links

6. Verifique o console do navegador (F12) para logs de debug

## Exemplo de Logs Esperados

```
=== SOURCE LINK CLICK ===
Original URL: https://www.stpauls.br/about-us
Mirror URL: /stpauls_site_mirror/about-us.html
Title: About St. Paul's School
Host: localhost:5173
Full mirror URL: http://localhost:5173/stpauls_site_mirror/about-us.html
```

## O que fazer se não funcionar

1. **Se os links não abrirem**:
   - Verifique se o arquivo existe em `public/stpauls_site_mirror/`
   - Tente acessar diretamente: http://localhost:5173/stpauls_site_mirror/about-us.html

2. **Se aparecer erro 404**:
   - Reinicie o servidor (Ctrl+C e `npm run dev`)
   - Verifique se o plugin do Vite está carregado

3. **Se o chat não responder**:
   - Verifique o `.env` com as credenciais do Supabase
   - Use o mock de resposta para testar

## Arquivo de Teste Direto

Abra: http://localhost:5173/test-mirror.html

Este arquivo tem links diretos e um iframe para testar o acesso ao mirror.