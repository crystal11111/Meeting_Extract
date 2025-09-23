import React, { useState, useRef } from "react";
import pdfToText from "react-pdftotext"; // Import react-pdftotext
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
        
        try {
            const response = await fetch('http://localhost:5002/summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: transcript })
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            setSummary(data.summary);
            setTasks(data.tasks);
            setFollowupEmail(data.followup_email);
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
                    <button 
                        className={`copy-btn ${copiedSection === title ? 'copied' : ''}`}
                        onClick={() => copyToClipboard(content, title)}
                        title="Copy to clipboard"
                    >
                        {copiedSection === title ? '✓' : '📋'}
                    </button>
                </div>
                <div className="output-content">
                    <p className="output-text">{content}</p>
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
