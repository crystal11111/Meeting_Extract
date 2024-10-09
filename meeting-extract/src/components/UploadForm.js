import React, { useState } from 'react';

function UploadForm({ onSubmit }) {
  const [transcript, setTranscript] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(transcript);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea 
        placeholder="Paste your meeting transcript here" 
        value={transcript} 
        onChange={(e) => setTranscript(e.target.value)} 
      />
      <button type="submit">Summarize</button>
    </form>
  );
}

export default UploadForm;
