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
    const fileInputRef = useRef(null); // Create a ref for the file input

    const handleTranscriptChange = (e) => {
        setTranscript(e.target.value);
    };

    const handleFileChange = async (file) => {
        if (!file) return;

        const fileType = file.type;
        setError("");

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

    const OutputSection = ({ title, content }) => (
        content && (
            <div className="output-container">
                <h3 className="output-title">{title}</h3>
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
                            <span className="upload-icon">📄</span>
                            <p>Drag and drop your file here, or click to browse</p>
                            <p className="file-types">Supported formats: PDF, TXT, DOC, DOCX</p>
                        </div>
                    </div>

                    <button 
                        onClick={handleSubmit} 
                        className={`submit-btn ${loading ? 'loading' : ''}`} 
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Generate Summary'}
                    </button>

                    {error && <div className="error-message" role="alert">{error}</div>}
                </div>

                <div className="output-section">
                    <OutputSection title="Meeting Summary" content={summary} />
                    <OutputSection title="Action Items" content={tasks} />
                    <OutputSection title="Follow-up Email Draft" content={followupEmail} />
                </div>
            </main>
        </div>
    );
};

export default Home;
