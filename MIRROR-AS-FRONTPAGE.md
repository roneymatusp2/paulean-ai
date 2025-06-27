# St. Paul's School Mirror as Frontpage

## What Changed

The app now displays the St. Paul's School mirror website as the main content, with the Paulean AI chat floating over it.

### Key Changes:

1. **App.tsx** - Simplified to show only the mirror frame with Paulean layout
2. **NavigableMirrorFrame** - New component that displays the mirror in an iframe
3. **PauleanLayout** - Wraps the mirror and adds the floating chat button

## How It Works

1. When the app loads, it shows the St. Paul's mirror homepage (`/stpauls_site_mirror/index.html`)
2. The Paulean chat button floats in the bottom right corner
3. When clicked, the chat modal opens over the mirror
4. Users can navigate the mirror site while having access to the AI assistant

## Testing

1. Run the development server:
   ```bash
   npm run dev
   ```

2. You should see:
   - The St. Paul's School website (mirror) as the main page
   - A floating Paulean button in the bottom right
   - Click the button to open the chat
   - Ask questions and click on source links

## Production Build

```bash
npm run build
```

The build will include:
- The mirror files in `/dist/stpauls_site_mirror/`
- The React app serving the mirror with floating chat

## Benefits

1. **Seamless Experience** - Users see the actual school website
2. **AI Integration** - Paulean is available for questions at any time
3. **Source Links** - AI responses link directly to relevant mirror pages
4. **Navigation** - Users can browse the entire mirror site

## What's Next

1. Configure real Supabase credentials in `.env`
2. Deploy to production
3. Test cross-origin navigation in the iframe
4. Add navigation history/breadcrumbs if needed