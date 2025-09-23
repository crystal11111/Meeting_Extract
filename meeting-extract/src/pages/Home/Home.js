import React, { useState, useRef } from "react";
import pdfToText from "react-pdftotext";
import { OpenAIService } from "../../services/openai";
import "./Home.css";

export const Home = () => {
    const [transcript, setTranscript] = useState("");
    const [summary, setSummary] = useState("");
    const [tasks, setTasks] = useState("");
    const [followupEmail, setFollowupEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [copiedSection, setCopiedSection] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState("");
    const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
    const [showApiKey, setShowApiKey] = useState(!localStorage.getItem('openai_api_key'));
    const fileInputRef = useRef(null);

    const handleTranscriptChange = (e) => {
        setTranscript(e.target.value);
    };

    const handleFileChange = async (file) => {
        if (!file) return;

        const fileType = file.type;
        setError("");
        setUploadedFileName(file.name);

        try {
            if (fileType === "application/pdf") {
                const text = await pdfToText(file);
                setTranscript(text);
            } else {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setTranscript(event.target.result);
                };
                reader.readAsText(file);
            }
        } catch (error) {
            console.error("Failed to process file", error);
            setError("Failed to process file. Please try another file.");
            setUploadedFileName("");
        }
    };

    const handleSubmit = async () => {
        if (!transcript.trim()) {
            setError("Please enter a transcript or upload a file.");
            return;
        }

        setLoading(true);
        setError("");
        
        if (!apiKey.trim()) {
            setError("Please enter your OpenAI API key first.");
            setLoading(false);
            return;
        }

        // Save API key to localStorage
        localStorage.setItem('openai_api_key', apiKey);
        
        try {
            const openai = new OpenAIService(apiKey);
            
            const [summary, tasks, followupEmail] = await Promise.all([
                openai.getSummary(transcript),
                openai.getTasks(transcript),
                openai.getFollowupEmail(transcript)
            ]);
            
            setSummary(summary);
            setTasks(tasks);
            setFollowupEmail(followupEmail);
        } catch (error) {
            setError("Error processing your request. Please try again later.");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Prevent default to allow drop
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault(); // Prevent default behavior
        setIsDragging(false);
        const file = e.dataTransfer.files[0]; // Get the first file
        handleFileChange(file); // Process the file
    };

    const handleFileInputClick = () => {
        fileInputRef.current.click(); // Programmatically click the file input
    };

    const getIcon = (title) => {
        switch (title) {
            case 'Meeting Summary': return '📋';
            case 'Action Items': return '✅';
            case 'Follow-up Email Draft': return '📧';
            default: return '📄';
        }
    };

    const copyToClipboard = async (text, section) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedSection(section);
            setTimeout(() => setCopiedSection(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const formatSummary = (text) => {
        if (!text) return text;
        
        return text
            .replace(/(Main points?:|Key points?:|Summary:)/gi, '<strong class="section-header">$1</strong>')
            .replace(/(Decisions?:|Decision made:|Key decisions?:)/gi, '<strong class="section-header decisions">$1</strong>')
            .replace(/(Conclusions?:|Final thoughts?:|Takeaways?:)/gi, '<strong class="section-header conclusions">$1</strong>')
            .replace(/\n/g, '<br>');
    };

    const parseRelativeDate = (dateStr) => {
        if (!dateStr || dateStr === 'None' || dateStr.toLowerCase().includes('ongoing')) return null;
        
        const today = new Date();
        const lowerDate = dateStr.toLowerCase();
        
        const formatDate = (date) => {
            const options = { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric',
                year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
            };
            return date.toLocaleDateString('en-US', options);
        };
        
        if (lowerDate.includes('today')) {
            return `Today (${formatDate(today)})`;
        }
        
        if (lowerDate.includes('tomorrow')) {
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            return `Tomorrow (${formatDate(tomorrow)})`;
        }
        
        // Handle specific weekdays
        const weekdays = {
            'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
            'thursday': 4, 'friday': 5, 'saturday': 6
        };
        
        for (const [day, dayNum] of Object.entries(weekdays)) {
            if (lowerDate.includes(day)) {
                let targetDate = new Date(today);
                let daysUntil = (dayNum - today.getDay() + 7) % 7;
                
                // If it's the same day and we're looking for "next" or it's already past, go to next week
                if (daysUntil === 0 && (lowerDate.includes('next') || today.getHours() > 17)) {
                    daysUntil = 7;
                }
                
                targetDate.setDate(today.getDate() + daysUntil);
                return formatDate(targetDate);
            }
        }
        
        // Handle "next week", "this week", etc.
        if (lowerDate.includes('next week')) {
            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);
            return `Next week (${formatDate(nextWeek)})`;
        }
        
        return dateStr;
    };

    const formatTasks = (text) => {
        if (!text) return text;
        
        // Enhanced styling with date replacement
        let enhancedText = text
            .replace(/Deadline:\s*(Friday|Next Friday)/gi, (match, day) => {
                const parsed = parseRelativeDate(day);
                return `<span class="task-deadline-enhanced">📅 ${parsed || day}</span>`;
            })
            .replace(/Deadline:\s*(Monday|Next Monday)/gi, (match, day) => {
                const parsed = parseRelativeDate(day);
                return `<span class="task-deadline-enhanced">📅 ${parsed || day}</span>`;
            })
            .replace(/Deadline:\s*(Tuesday|Next Tuesday)/gi, (match, day) => {
                const parsed = parseRelativeDate(day);
                return `<span class="task-deadline-enhanced">📅 ${parsed || day}</span>`;
            })
            .replace(/Deadline:\s*(Wednesday|Next Wednesday)/gi, (match, day) => {
                const parsed = parseRelativeDate(day);
                return `<span class="task-deadline-enhanced">📅 ${parsed || day}</span>`;
            })
            .replace(/Deadline:\s*(Thursday|Next Thursday)/gi, (match, day) => {
                const parsed = parseRelativeDate(day);
                return `<span class="task-deadline-enhanced">📅 ${parsed || day}</span>`;
            })
            .replace(/✓\s*Person:\s*(.+)/gi, '<span class="task-person-enhanced">👤 $1</span>')
            .replace(/✓\s*([^\n]+?)(?=\s*✓|$)/gi, '<div class="task-item-enhanced">✅ $1</div>')
            .replace(/\n/g, '<br>');
        
        return `<div class="tasks-container-enhanced">${enhancedText}</div>`;
    };

    const formatEmail = (text) => {
        if (!text) return text;
        
        return text
            .replace(/(Subject:|To:|From:|Dear|Hi|Hello)/gi, '<strong class="email-header">$1</strong>')
            .replace(/(Best regards|Sincerely|Thank you|Thanks)/gi, '<strong class="email-closing">$1</strong>')
            .replace(/\n/g, '<br>');
    };

    const getFormattedContent = (title, content) => {
        switch (title) {
            case 'Meeting Summary':
                return formatSummary(content);
            case 'Action Items':
                return formatTasks(content);
            case 'Follow-up Email Draft':
                return formatEmail(content);
            default:
                return content?.replace(/\n/g, '<br>');
        }
    };

    const exportToGoogleCalendar = (tasks) => {
        const taskLines = tasks.split('\n').filter(line => line.trim() && !line.includes('Person:') && !line.includes('Deadline:'));
        const calendarEvents = taskLines.map(task => {
            const cleanTask = task.replace('✓', '').trim();
            const encodedTask = encodeURIComponent(cleanTask);
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            const dateStr = tomorrow.toISOString().split('T')[0].replace(/-/g, '');
            return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodedTask}&dates=${dateStr}/${dateStr}`;
        });
        
        calendarEvents.forEach(url => window.open(url, '_blank'));
    };

    const exportToNotion = (tasks) => {
        const taskLines = tasks.split('\n').filter(line => line.trim() && !line.includes('Person:') && !line.includes('Deadline:'));
        const notionText = taskLines.map(task => `- [ ] ${task.replace('✓', '').trim()}`).join('\n');
        
        navigator.clipboard.writeText(notionText).then(() => {
            alert('Tasks copied to clipboard! Paste them into your Notion page.');
        });
    };

    const clearForm = () => {
        setTranscript("");
        setSummary("");
        setTasks("");
        setFollowupEmail("");
        setUploadedFileName("");
        setError("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const OutputSection = ({ title, content }) => (
        content && (
            <div className="output-container">
                <div className="output-header">
                    <h3 className="output-title">
                        <span className="output-icon">{getIcon(title)}</span>
                        {title}
                    </h3>
                    <div className="header-buttons">
                        {title === 'Action Items' && (
                            <>
                                <button 
                                    className="export-btn"
                                    onClick={() => exportToGoogleCalendar(content)}
                                    title="Add to Google Calendar"
                                >
                                    📅 Calendar
                                </button>
                                <button 
                                    className="export-btn"
                                    onClick={() => exportToNotion(content)}
                                    title="Copy for Notion"
                                >
                                    📝 Notion
                                </button>
                            </>
                        )}
                        <button 
                            className={`copy-btn ${copiedSection === title ? 'copied' : ''}`}
                            onClick={() => copyToClipboard(content, title)}
                            title="Copy to clipboard"
                        >
                            {copiedSection === title ? '✓' : '📋'}
                        </button>
                    </div>
                </div>
                <div className="output-content">
                    <div 
                        className="output-text" 
                        dangerouslySetInnerHTML={{ __html: getFormattedContent(title, content) }}
                    />
                </div>
            </div>
        )
    );

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Meeting Extract</h1>
                <p className="subtitle">Transform your meeting transcripts into actionable insights</p>
            </header>
            <main className="main-content">
                <div className="input-section">
                    {showApiKey && (
                        <div className="api-key-section">
                            <div className="api-key-header">
                                <h3>🔑 OpenAI API Key</h3>
                                <button 
                                    className="info-btn"
                                    onClick={() => window.open('https://platform.openai.com/api-keys', '_blank')}
                                    title="Get your API key"
                                >
                                    ℹ️ Get Key
                                </button>
                            </div>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="sk-..."
                                className="api-key-input"
                                aria-label="OpenAI API Key"
                            />
                            <p className="api-key-note">
                                🔒 Your API key is stored locally and never shared. 
                                <button 
                                    className="link-btn"
                                    onClick={() => setShowApiKey(false)}
                                >
                                    Hide this field
                                </button>
                            </p>
                        </div>
                    )}
                    
                    {!showApiKey && (
                        <div className="api-key-status">
                            <span>🔑 API Key: ••••••••</span>
                            <button 
                                className="change-key-btn"
                                onClick={() => setShowApiKey(true)}
                            >
                                Change Key
                            </button>
                        </div>
                    )}
                    
                    <textarea
                        value={transcript}
                        onChange={handleTranscriptChange}
                        placeholder="Paste your meeting transcript here..."
                        rows="10"
                        className="transcript-input"
                        aria-label="Meeting transcript input"
                    />

                    <div
                        className={`file-upload ${isDragging ? 'dragging' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleFileInputClick}
                        role="button"
                        tabIndex="0"
                        aria-label="Upload file area"
                    >
                        <input 
                            type="file" 
                            accept=".txt,.pdf,.doc,.docx"  
                            onChange={(e) => handleFileChange(e.target.files[0])}
                            className="file-input"
                            style={{ display: "none" }}
                            ref={fileInputRef}
                        />
                        <div className="upload-content">
                            <span className="upload-icon">📁</span>
                            {uploadedFileName ? (
                                <>
                                    <p className="uploaded-file">✓ {uploadedFileName}</p>
                                    <p className="file-types">File uploaded successfully!</p>
                                </>
                            ) : (
                                <>
                                    <p>Drag and drop your file here, or click to browse</p>
                                    <p className="file-types">✨ Supported formats: PDF, TXT, DOC, DOCX</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="button-group">
                        <button 
                            onClick={handleSubmit} 
                            className={`submit-btn ${loading ? 'loading' : ''}`} 
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Generate Summary'}
                        </button>
                        {(transcript || uploadedFileName) && (
                            <button 
                                onClick={clearForm}
                                className="clear-btn"
                                disabled={loading}
                            >
                                🗑️ Clear
                            </button>
                        )}
                    </div>

                    {error && <div className="error-message" role="alert">{error}</div>}
                </div>

                {(summary || tasks || followupEmail) && (
                    <div className="output-section">
                        {summary && <OutputSection title="Meeting Summary" content={summary} />}
                        {tasks && <OutputSection title="Action Items" content={tasks} />}
                        {followupEmail && <OutputSection title="Follow-up Email Draft" content={followupEmail} />}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
