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
                style={{
                    border: "2px dashed #ccc",
                    borderRadius: "5px",
                    padding: "20px",
                    textAlign: "center",
                    margin: "10px 0",
                    cursor: "pointer", // Change cursor to pointer for better UX
                }}
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
                <div className="summary-output">
                    <h3>Summary</h3>
                    <p>{summary}</p>
                </div>
            )}
            {tasks && (
                <div className="tasks-output">
                    <h3>Tasks</h3>
                    <p>{tasks}</p>
                </div>
            )}
            {followupEmail && (
                <div className="followup-output">
                    <h3>Follow-up Email</h3>
                    <p>{followupEmail}</p>
                </div>
            )}
        </div>
    );
};

export default Home;
