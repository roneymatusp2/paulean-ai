# Paulean AI - Deployment Instructions

## Complete Project Setup Summary

### Supabase Backend (Completed)

1. **Database Setup**:
   - pgvector extension enabled
   - `stpauls_documents` table created
   - `match_stpauls_documents` RPC function created
   - OPENAI_API_KEY stored as Edge Function secret

2. **Edge Functions**:
   - `ask-paulean`: https://gjvtncdjcslnkfctqnfy.supabase.co/functions/v1/ask-paulean
   - `transcribe-paulean-audio`: https://gjvtncdjcslnkfctqnfy.supabase.co/functions/v1/transcribe-paulean-audio  
   - `speak-paulean-answer`: https://gjvtncdjcslnkfctqnfy.supabase.co/functions/v1/speak-paulean-answer

### Frontend Requirements

#### NPM Packages to Install

```bash
npm install @supabase/supabase-js
```

#### Environment Variables

Create a `.env` file in your React project root:

```env
VITE_SUPABASE_URL=https://gjvtncdjcslnkfctqnfy.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Static Site Mirror Setup

1. **Move the mirrored site** from `stpauls_mirror/www.stpauls.br/` to `public/stpauls_site_mirror/`:

```bash
# From your project root
cp -r stpauls_mirror/www.stpauls.br/* public/stpauls_site_mirror/
```

2. **Verify structure**: Your public directory should look like:
```
public/
  ├── stpauls_site_mirror/
  │   ├── index.html
  │   ├── about-us/
  │   │   ├── index.html
  │   │   └── our-history/
  │   │       └── index.html
  │   └── ... other pages
  └── ... other public files
```

### Deployment to Netlify/Vercel

#### Option 1: Netlify

1. **Build settings**:
   ```
   Build command: npm run build
   Publish directory: dist
   ```

2. **Environment variables**:
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Netlify dashboard

3. **Deploy**:
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Build and deploy
   npm run build
   netlify deploy --dir=dist --prod
   ```

#### Option 2: Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Add environment variables** in Vercel dashboard

### File Structure Summary

Your final project structure should be:

```
paulean-ai/
├── src/
│   ├── components/
│   │   ├── PauleanChat.tsx
│   │   └── PauleanChat.css
│   ├── hooks/
│   │   ├── useVoiceRecording.ts
│   │   └── useAudioPlayer.ts
│   ├── services/
│   │   └── supabaseApi.ts
│   ├── types/
│   │   └── chat.ts
│   ├── utils/
│   │   └── mirroredSiteLinks.ts
│   └── App.tsx
├── public/
│   ├── stpauls_site_mirror/  # Mirrored site content
│   └── ... other public files
├── .env
├── package.json
└── ... other config files
```

### Usage in App.tsx

```tsx
import React from 'react';
import PauleanChat from './components/PauleanChat';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Paulean AI - St. Paul's School Assistant</h1>
      </header>
      <main>
        <PauleanChat />
      </main>
    </div>
  );
}

export default App;
```

### Testing

1. **Local testing**:
   ```bash
   npm run dev
   ```

2. **Test the chat**:
   - Type a question about St. Paul's School
   - Test voice recording
   - Verify source links point to `/stpauls_site_mirror/`

### Important Notes

1. The static mirror must be in `public/stpauls_site_mirror/` for proper deployment
2. Source links are automatically transformed by `getMirroredSiteLink()`
3. Voice features require HTTPS in production
4. Ensure Supabase Edge Functions have sufficient timeout for AI operations

### Troubleshooting

1. **CORS errors**: Check that Edge Functions include proper CORS headers
2. **Voice not working**: Ensure site is served over HTTPS
3. **Sources not linking**: Verify mirror structure matches expected format
4. **API errors**: Check environment variables and Supabase anon key