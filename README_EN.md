# Immersive Translation Extension

[中文版](README.md) | English

A browser extension based on Pollinations AI that provides seamless web page text translation experience.

## Features

- 🌐 **Select to Translate**: Quickly translate any selected text
- 🎯 **Multiple Trigger Methods**: Support button click, right-click menu, keyboard shortcuts
- 🔧 **Smart Interface**: Immersive translation box that doesn't interfere with original page layout
- 🌍 **Multi-language Support**: Support Chinese, English, Japanese, Korean and other languages
- ⚡ **No API Key Required**: Uses free Pollinations AI service
- 💾 **Settings Persistence**: Automatically saves user preferences

## Installation

1. Download or clone this project locally
2. Open Chrome browser and go to extensions management page (`chrome://extensions/`)
3. Enable "Developer mode"
4. Click "Load unpacked extension"
5. Select the project folder
6. Extension installation complete!

## Usage

### Method 1: Select Text Translation
1. Select the text you want to translate on any webpage
2. Click the blue translation button that appears
3. Translation result will be displayed in the translation box at the top right

### Method 2: Right-click Menu
1. Select the text you want to translate
2. Right-click and select "Translate selected text"
3. View the translation result

### Method 3: Keyboard Shortcut
1. Select the text you want to translate
2. Press `Alt + T`
3. View the translation result

### Settings Options
- Click the extension icon in the browser toolbar
- Can enable/disable translation function
- Select target translation language
- Test translation function

## Technical Architecture

### File Structure
```
├── manifest.json      # Extension manifest file
├── background.js      # Background script, handles API calls
├── content.js         # Content script, handles page interactions
├── content.css        # Style file
├── popup.html         # Popup window interface
├── popup.js          # Popup window logic
├── icon.png          # Extension icon
└── README.md         # Documentation
```

### Core Technologies
- **Manifest V3**: Uses the latest browser extension standard
- **Pollinations AI**: Free AI translation service
- **Chrome Extension APIs**: Utilizes browser extension APIs
- **Modern CSS**: Responsive design, adapts to various screens

## API Integration

The extension uses Pollinations AI's text generation API:

```javascript
const response = await fetch('https://text.pollinations.ai/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: prompt }
    ],
    model: 'openai-large',
    private: true
  })
});
```

## Supported Languages

- 中文 (Chinese)
- English
- 日本語 (Japanese)
- 한국어 (Korean)
- Français (French)
- Deutsch (German)
- Español (Spanish)
- Русский (Russian)

## Development

### Local Development
1. After modifying code, click the refresh button on the extensions management page
2. Reload webpages using the extension to apply changes

### Debugging
- Use Chrome Developer Tools to debug content script
- Click "background page" on extensions management page to debug background script
- Right-click extension icon and select "Inspect popup" to debug popup

## Notes

- Extension requires internet connection to work properly
- Translation quality depends on Pollinations AI service
- Some websites may restrict extension functionality due to CSP policies
- Recommended to translate long texts in segments

## License

MIT License

## Contributing

Issues and Pull Requests are welcome!