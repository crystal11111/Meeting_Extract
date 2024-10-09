import React from 'react';

function Summary({ summary }) {
  return (
    <div>
      <h2>Meeting Summary</h2>
      <p>{summary}</p>
    </div>
  );
}

export default Summary;
