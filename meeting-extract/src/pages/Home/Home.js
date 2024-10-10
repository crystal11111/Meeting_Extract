import React, { useState } from "react";
import "./Home.css";

export const Home = () => {
    const [transcript, setTranscript] = useState("");
    const [summary, setSummary] = useState("");
    const [tasks, setTasks] = useState("");
    const [followupEmail, setFollowupEmail] = useState("");
    const [loading, setLoading] = useState(false);  // Add loading state
    const [error, setError] = useState("");  // Add error state

    const handleTranscriptChange = (e) => {
        setTranscript(e.target.value);
    };

    const handleSubmit = async () => {
        setLoading(true);  // Set loading state to true when starting the request
        setError("");  // Reset any previous errors
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
            setTasks(data.tasks);  // Update tasks state with the fetched tasks
            setFollowupEmail(data.followup_email);  // Update follow-up email state with the fetched email
        } catch (error) {
            setError("Error fetching data. Please try again later.");
            console.error("Error fetching summary:", error);
        } finally {
            setLoading(false);  // Set loading state back to false after request completes
        }
    };

    return (
        <div className="home-container">
            <h1>Meeting Extract</h1>
            <p>Summarize your meeting transcripts and extract tasks</p>
            <textarea
                value={transcript}
                onChange={handleTranscriptChange}
                placeholder="Paste your meeting transcript here"
                rows="10"
                className="transcript-input"
            ></textarea>
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
