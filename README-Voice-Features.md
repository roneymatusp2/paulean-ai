# Voice Features Implementation Guide

## Installation

First, install the required packages:

```bash
npm install react-speech-recognition
```

For TypeScript support, you might also need:

```bash
npm install --save-dev @types/react-speech-recognition
```

## Browser Compatibility

- **Speech Recognition**: Chrome, Edge, Safari (limited)
- **Speech Synthesis**: Most modern browsers

## Usage

### 1. Basic Implementation

```tsx
import PauleanChat from './components/PauleanChat';

function App() {
  const handleSendMessage = async (message: string) => {
    // Call your backend API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    
    const data = await response.json();
    return data.response;
  };

  return <PauleanChat onSendMessage={handleSendMessage} />;
}
```

### 2. Backend Audio Implementation

If your backend generates audio files (e.g., using OpenAI TTS):

```tsx
// Backend response format:
{
  "text": "Hello, I'm your AI assistant",
  "audioUrl": "https://example.com/audio/response-123.mp3"
}

// Modified handleSendMessage:
const handleSendMessage = async (message: string) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  
  const data = await response.json();
  
  // Play the audio if available
  if (data.audioUrl) {
    const audio = new Audio(data.audioUrl);
    await audio.play();
  }
  
  return data.text;
};
```

### 3. British English Voice Selection

The component automatically tries to select a British English voice. You can also manually select voices:

```tsx
// Get available voices
const voices = window.speechSynthesis.getVoices();

// Filter British voices
const britishVoices = voices.filter(voice => 
  voice.lang === 'en-GB' || 
  voice.name.includes('British') ||
  voice.name.includes('UK')
);
```

## Common British Voice Names

Different browsers provide different voice names:

- Chrome: "Google UK English Female", "Google UK English Male"
- Edge: "Microsoft Hazel - English (United Kingdom)", "Microsoft George - English (United Kingdom)"
- Safari: "Daniel (United Kingdom)", "Kate (United Kingdom)"

## Polyfill for Unsupported Browsers

For browsers that don't support Web Speech API:

```bash
npm install @speechly/speech-recognition-polyfill
```

## CSS Styling

Add styles for the recording indicator:

```css
.recording {
  background-color: #ff4444;
  color: white;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

.transcript-preview {
  padding: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  margin-top: 10px;
  font-style: italic;
}
```

## Troubleshooting

1. **No voices available**: Some browsers load voices asynchronously. The component handles this with `onvoiceschanged` event.

2. **Recording not working**: Ensure HTTPS is enabled (required for getUserMedia).

3. **British voice not found**: Falls back to default system voice.

## Security Considerations

- Always use HTTPS for microphone access
- Handle permissions properly
- Sanitize text before speech synthesis
- Consider rate limiting for API calls

## Advanced Features

You can extend the component with:

- Voice activity detection
- Noise cancellation
- Custom wake words
- Streaming transcription
- Multi-language support