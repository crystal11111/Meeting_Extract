import React, { useState } from 'react';
import UploadForm from './components/UploadForm';
import Summary from './components/Summary';

function App() {
  const [summary, setSummary] = useState("");

  const handleTranscriptSubmit = async (transcript) => {
    const response = await fetch('http://localhost:8000/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript }),
    });
    const data = await response.json();
    setSummary(data.summary);
  };

  return (
    <div className="App">
      <h1>Meeting Notes Summarizer</h1>
      <UploadForm onSubmit={handleTranscriptSubmit} />
      <Summary summary={summary} />
    </div>
  );
}

export default App;
