# Paulean AI Setup Guide

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Add your Supabase project credentials:
     ```
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Features

### AI Chat Interface (Paulean)
- Floating chat button with beautiful glassmorphic design
- Voice input (Speech-to-Text) support
- Voice output (Text-to-Speech) with British English accent
- Context-aware responses using RAG (Retrieval Augmented Generation)
- Sources linked to local mirror of St. Paul's website

### Static Mirror Integration
- All source links point to `/stpauls_site_mirror/`
- Automatic URL transformation for seamless navigation
- Debug tools to verify URL transformations

## Troubleshooting

### "Missing Supabase environment variables" error
1. Create a `.env` file in the project root
2. Add your Supabase credentials (see step 2 above)
3. Restart the development server

### Links not pointing to mirror
1. Check browser console for debug logs
2. Verify mirror exists at `/public/stpauls_site_mirror/`
3. Run `npm run dev` and check the debug panel

### Voice features not working
1. Ensure microphone permissions are granted
2. Use HTTPS in production (required for Web Speech API)
3. Check browser compatibility (Chrome/Edge recommended)

## Architecture

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom CSS
- **AI Backend**: Supabase Edge Functions
- **Vector Store**: Supabase with pgvector
- **Embeddings**: OpenAI text-embedding-3-small
- **LLM**: OpenAI gpt-4o-mini
- **Voice**: OpenAI Whisper (STT) + TTS