# Meeting Assistant with Google Gemini AI

This project is a real-time meeting assistant that transcribes speech and uses Google's Gemini AI to provide intelligent summaries and insights from your meetings.

## Features

- Real-time speech recognition
- Meeting transcription
- AI-powered meeting summarization using Google Gemini
- Easy-to-use interface

##Deployed Version link
- https://arslanhaider8.github.io/meeting-assistant-gemeni/

## Prerequisites

Before you begin, ensure you have:
- Node.js installed (v14 or higher)
- A Google Gemini API key ([Get it here](https://makersuite.google.com/app/apikey))

## Installation

1. Clone the repository:
```bash
git clone https://github.com/arslanhaider8/meeting-assistant-gemeni.git
cd meeting-assistant-gemeni
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Replace `your_api_key_here` with your actual Google Gemini API key
```bash
cp .env.example .env
```

## Configuration

1. Open the `.env` file and add your Google Gemini API key:
```
REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
```

**Important**: Never commit your `.env` file or share your API key publicly.

## Running the Application

To start the development server:
```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`.

## How to Use

1. Click the microphone button to start recording
2. Speak clearly into your microphone
3. The application will transcribe your speech in real-time
4. Click the summarize button to get AI-powered insights from your meeting

## Technical Details

This project uses:
- React.js for the frontend
- Web Speech API for speech recognition
- Google Gemini AI for meeting summarization
- Environment variables for secure API key management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Privacy Note

This application processes audio locally for speech-to-text conversion. Only the text transcription is sent to Google's Gemini AI for summarization. No audio data is stored or transmitted.

## License

This project is open source and available under the MIT License.

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
