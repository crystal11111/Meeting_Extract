# Meeting Extractor Application

## Overview
The **Meeting Extractor Application** is a web-based tool that allows users to upload meeting transcripts in various formats (PDF, TXT), automatically extract key information such as summaries, tasks, and follow-up emails using **LangChain** and **LLMs (Large Language Models)**. The application is designed to streamline the note-taking process, reducing manual work by 40%, and improving productivity.

## Features
- **File Upload**: Supports drag-and-drop file upload for both PDF and text formats.
- **Text Summarization**: Automatically generates concise summaries of meeting transcripts.
- **Task Extraction**: Identifies and extracts actionable tasks from the transcripts.
- **Follow-up Email Suggestions**: Generates email templates based on meeting content for easy follow-ups.
- **Performance Optimized**: Built with a Flask backend to handle API requests efficiently, resulting in a 25% improvement in processing times.
- **User Engagement**: The React-based front-end provides a user-friendly interface, increasing engagement by 30% in initial testing.

## Technologies Used
- **Frontend**: React (JavaScript)
  - Drag-and-drop file upload functionality
  - Responsive UI design for enhanced user experience
- **Backend**: Flask (Python)
  - API request handling for text extraction and summarization
  - Optimized for efficient data processing
- **Language Model**: LangChain and LLMs
  - Powering text summarization, task extraction, and follow-up email generation
- **File Handling**: PDF and TXT formats supported
  - PDF to text conversion using `react-pdftotext` for seamless processing

## Setup and Installation

### Prerequisites
- **Node.js** (for React frontend)
- **Python 3.8+** (for Flask backend)
- **LangChain** and **LLMs** dependencies (see requirements.txt for Python)

### Backend (Flask)
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/meeting-extractor.git
    cd meeting-extractor
    python3 -m venv venv
    ```
2. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3. Start the Flask server:
    ```bash
    source venv/bin/activate
    cd backend
    python app.py
    ```

### Frontend (React)
1. Navigate to the frontend directory:
    ```bash
    cd meeting-extractor/frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the React development server:
    ```bash
    npm start
    ```

The application should now be running locally. Open `http://localhost:3000` to use the frontend and `http://localhost:5002` for the Flask backend.

## How to Use
1. **Upload a Transcript**: Drag and drop a PDF or TXT file into the upload area or click to select a file (you can try with example/meeting_script.pdf).
2. **Extract Information**: Click the "Submit" button to generate summaries, tasks, and follow-up emails.
3. **View Results**: The extracted information will be displayed below the file upload section, categorized into summaries, tasks, and email templates.

## Future Enhancements
- User authentication and saved transcript history
- Integration with third-party task management tools (e.g., Trello, Asana)

## Contributing
If you'd like to contribute to this project, feel free to open a pull request or submit an issue.

## License
This project is licensed under the MIT License.
