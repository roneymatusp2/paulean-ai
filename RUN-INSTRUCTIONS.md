# How to Run and Test Paulean AI

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Testing Mirror Links

1. Open http://localhost:5173 in your browser
2. Look for the debug sections below the hero:
   - **URL Transformation Debug**: Shows how URLs are transformed
   - **Test Mirror Links**: Simulates AI response with clickable links

3. Click the floating Paulean button (bottom right) to open chat
4. Type any question about St. Paul's School
5. Check that source links point to `/stpauls_site_mirror/`

## Console Debugging

Open browser DevTools (F12) to see:
- URL transformation logs
- Link click events
- Mirror path calculations

## Production Deployment

1. Create `.env` with real Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. Build for production:
   ```bash
   npm run build
   ```

3. Deploy to Netlify/Vercel:
   - Connect GitHub repo
   - Set environment variables
   - Deploy

## Troubleshooting

- **"Missing Supabase environment variables"**: Create `.env` file
- **Links not working**: Check if mirror exists at `/public/stpauls_site_mirror/`
- **Voice not working**: Use HTTPS and allow microphone access