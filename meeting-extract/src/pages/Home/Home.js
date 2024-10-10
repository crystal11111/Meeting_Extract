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
    const fileInputRef = useRef(null); // Create a ref for the file input

    const handleTranscriptChange = (e) => {
        setTranscript(e.target.value);
    };

    const handleFileChange = async (file) => {
        if (file) {
            const fileType = file.type;

            if (fileType === "application/pdf") {
                // Handle PDF file using react-pdftotext
                try {
                    const text = await pdfToText(file);
                    setTranscript(text); // Set the extracted text as the transcript
                } catch (error) {
                    console.error("Failed to extract text from PDF", error);
                    setError("Failed to extract text from PDF. Please try another file.");
                }
            } else {
                // Handle text file
                const reader = new FileReader();
                reader.onload = (event) => {
                    setTranscript(event.target.result); // Set the file content as the transcript
                };
                reader.readAsText(file); // Read the file as text
            }
        }
    };

    const handleSubmit = async () => {
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
            const data = await response.json();
            setSummary(data.summary);
            setTasks(data.tasks);
            setFollowupEmail(data.followup_email);
        } catch (error) {
            setError("Error fetching data. Please try again later.");
            console.error("Error fetching summary:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Prevent default to allow drop
    };

    const handleDrop = (e) => {
        e.preventDefault(); // Prevent default behavior
        const file = e.dataTransfer.files[0]; // Get the first file
        handleFileChange(file); // Process the file
    };

    const handleFileInputClick = () => {
        fileInputRef.current.click(); // Programmatically click the file input
    };

    return (
        <div className="home-container">
            <h1>Meeting Extract</h1>
            <p>Summarize your meeting transcripts and extract tasks</p>
            <textarea
                value={transcript}
                onChange={handleTranscriptChange}
                placeholder="Paste your meeting transcript here or upload a document"
                rows="10"
                className="transcript-input"
            ></textarea>
            <div
                className="file-upload"
                onDragOver={handleDragOver} // Handle drag over event
                onDrop={handleDrop} // Handle drop event
                onClick={handleFileInputClick} // Trigger file input on click
            >
                <input 
                    type="file" 
                    accept=".txt,.pdf,.doc,.docx" 
                    onChange={(e) => handleFileChange(e.target.files[0])} 
                    className="file-input"
                    style={{ display: "none" }} // Hide default file input
                    ref={fileInputRef} // Attach the ref
                />
                <p>Drag and drop your PDF or text file here, or click to select a file</p>
            </div>
            <button onClick={handleSubmit} className="submit-btn" disabled={loading}>
                {loading ? 'Processing...' : 'Submit'}
            </button>
            {error && <p className="error">{error}</p>}
            {summary && (
                <div className="output-container">
                    <h3>Summary</h3>
                    <p className="output-text">{summary}</p>
                </div>
            )}
            {tasks && (
                <div className="output-container">
                    <h3>Tasks</h3>
                    <p className="output-text">{tasks}</p>
                </div>
            )}
            {followupEmail && (
                <div className="output-container">
                    <h3>Follow-up Email</h3>
                    <p className="output-text">{followupEmail}</p>
                </div>
            )}
        </div>
    );
};

export default Home;
