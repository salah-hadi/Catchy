# Bug Catcher Chrome Extension

A professional Chrome extension for capturing screenshots and documenting bugs with detailed information.

## Features

- **One-Click Screenshot Capture**: Instantly capture the current tab and save to your device
- **Auto-Generated Steps**: Automatically generates initial steps to reproduce based on page context
- **Professional Bug Form**: Structured fields for comprehensive bug reporting
- **Image Preview**: Zoom and preview captured screenshots with controls
- **Export Reports**: Save bug reports as text files with all details

## Installation

1. Build the extension:
   ```bash
   npm run build
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right

4. Click "Load unpacked" and select the `dist` folder

## Usage

1. Navigate to the page where you found a bug
2. Click the Bug Catcher extension icon
3. Click "Capture Bug" to take a screenshot
4. Fill in the bug details in the form
5. Save the bug report

## Development

```bash
# Install dependencies
npm install

# Build for development
npm run dev

# Build for production
npm run build
```

## Permissions

- `activeTab`: To capture screenshots of the current tab
- `tabs`: To access tab information for context
- `storage`: To save bug reports locally
- `downloads`: To save screenshots and reports to device