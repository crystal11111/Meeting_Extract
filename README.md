# Meeting Extractor Application

## Overview
The **Meeting Extractor Application** is a web-based tool that allows users to upload meeting transcripts in various formats (PDF, TXT), automatically extract key information such as summaries, tasks, and follow-up emails using **OpenAI API**. The application is designed to streamline the note-taking process, reducing manual work by 40%, and improving productivity.

## Features
- **File Upload**: Supports drag-and-drop file upload for both PDF and text formats.
- **Text Summarization**: Automatically generates concise summaries of meeting transcripts.
- **Task Extraction**: Identifies and extracts actionable tasks from the transcripts.
- **Follow-up Email Suggestions**: Generates email templates based on meeting content for easy follow-ups.
- **Export Integration**: Export tasks to Google Calendar and Notion with one click.
- **User API Keys**: Users provide their own OpenAI API keys for privacy and cost control.

## Technologies Used
- **Frontend**: React (JavaScript)
- **API**: Direct OpenAI API integration
- **File Handling**: PDF and TXT formats supported

## Setup and Installation

### Prerequisites
- **Node.js 16+**
- **OpenAI API Key** (users provide their own)

### Quick Start
1. **Clone the repository:**
    ```bash
    git clone https://github.com/crystal11111/Meeting_Extract.git
    cd Meeting_Extract
    ```

2. **Install dependencies:**
    ```bash
    cd meeting-extract
    npm install
    ```

3. **Run locally:**
    ```bash
    npm start
    ```

4. **Deploy to Vercel:**
    ```bash
    npm run build
    npx vercel --prod
    ```

The application will be available at `http://localhost:3000`

## How to Use
1. **Enter API Key**: Provide your OpenAI API key (stored locally in browser)
2. **Upload a Transcript**: Drag and drop a PDF or TXT file or paste text directly
3. **Extract Information**: Click "Generate Summary" to process the transcript
4. **View Results**: See summaries, tasks, and follow-up emails with enhanced formatting
5. **Export Tasks**: Use 📅 Calendar and 📝 Notion buttons to export action items

## Deployment

### Vercel (Recommended)
```bash
cd meeting-extract
npm run build
npx vercel --prod
```

### Other Options
- **Netlify:** Drag & drop build folder
- **GitHub Pages:** `npx gh-pages -d build`
- **Firebase:** `firebase deploy`

### User API Keys
- Users provide their own OpenAI API keys
- Keys stored locally in browser
- No backend server needed
- $0 hosting cost

## Contributing
If you'd like to contribute to this project, feel free to open a pull request or submit an issue.

## License
This project is licensed under the MIT License.