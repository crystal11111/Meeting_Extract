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
- **Node.js 16+** (for React frontend)
- **Python 3.8+** (for Flask backend)
- **OpenAI API Key** (for LLM functionality)

### Quick Start (Recommended)
1. **Clone the repository:**
    ```bash
    git clone https://github.com/crystal11111/Meeting_Extract.git
    cd Meeting_Extract
    ```

2. **Setup Backend:**
    ```bash
    cd backend
    python3 -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    ```

3. **Configure Environment:**
    ```bash
    # Create .env file in backend directory
    echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
    ```

4. **Setup Frontend:**
    ```bash
    cd ../meeting-extract
    npm install  # This will install all dependencies locally
    ```

5. **Run Both Servers (One Command):**
    ```bash
    cd ..
    npm run dev
    ```

**Note:** The `node_modules` folder is not included in the repository. Each user needs to run `npm install` to download dependencies locally.

### Alternative: Run Servers Separately
- **Backend only:** `npm run backend`
- **Frontend only:** `npm run frontend`

The application will be available at:
- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:5002`

## How to Use
1. **Upload a Transcript**: Drag and drop a PDF or TXT file into the upload area or click to select a file (you can try with example/meeting_script.pdf).
2. **Extract Information**: Click the "Submit" button to generate summaries, tasks, and follow-up emails.
3. **View Results**: The extracted information will be displayed below the file upload section, categorized into summaries, tasks, and email templates.
4. **Export Tasks**: Use the 📅 Calendar and 📝 Notion buttons to export action items to your productivity tools.

## Multi-User Deployment Options

### 🔑 **Option 1: User API Keys (Best for Open Source)**
- Users provide their own OpenAI API keys
- No cost to you, unlimited scaling
- Add API key input field in frontend

### 💳 **Option 2: Freemium Model**
- Free tier: 5 requests per day
- Paid tier: Unlimited requests
- Implement user authentication + Stripe billing

### 🏢 **Option 3: Enterprise**
- White-label for companies
- They use their own API keys
- You provide the software as a service

## Deployment & Multi-User Setup

### For Production Deployment

#### Option 1: User Brings Own API Key (Recommended)
```javascript
// Frontend: Add API key input
const [apiKey, setApiKey] = useState(localStorage.getItem('openai_key') || '');

// Send user's API key with requests
fetch('/api/summary', {
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ query: transcript })
});
```

#### Option 2: Usage-Based Billing
```python
# Backend: Track usage per user
from collections import defaultdict
usage_tracker = defaultdict(int)

@app.route('/summary', methods=['POST'])
def summary():
    user_id = request.headers.get('User-ID')
    if usage_tracker[user_id] > DAILY_LIMIT:
        return {'error': 'Daily limit exceeded'}, 429
    
    usage_tracker[user_id] += 1
    # Process request...
```

#### Option 3: Subscription Model
- Integrate with Stripe for payments
- Different tiers (Free: 5 requests/day, Pro: Unlimited)
- User authentication with JWT tokens

### Deployment Platforms
- **Frontend:** Vercel, Netlify, AWS S3 + CloudFront
- **Backend:** Railway, Render, AWS Lambda, Google Cloud Run
- **Database:** PostgreSQL (for user management), Redis (for rate limiting)

## Future Enhancements
- ✅ User authentication and API key management
- ✅ Usage tracking and rate limiting
- Integration with third-party task management tools (e.g., Trello, Asana)
- Real-time collaboration features
- Meeting recording integration

## Contributing
If you'd like to contribute to this project, feel free to open a pull request or submit an issue.

## License
This project is licensed under the MIT License.
