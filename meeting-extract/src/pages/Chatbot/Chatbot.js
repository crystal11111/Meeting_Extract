// import React, { useState } from "react";
// import "./Chatbot.css";

// export const Chatbot = () => {
//     const [message, setMessage] = useState("");
//     const [conversation, setConversation] = useState([]);

//     const handleMessageChange = (e) => {
//         setMessage(e.target.value);
//     };

//     const handleSend = async () => {
//         const userMessage = { sender: "user", text: message };
//         setConversation([...conversation, userMessage]);

//         try {
//             const response = await fetch('http://localhost:5002/chat', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ query: message })
//             });
//             const data = await response.json();
//             const botMessage = { sender: "bot", text: data.response };
//             setConversation([...conversation, userMessage, botMessage]);
//             setMessage("");
//         } catch (error) {
//             console.error("Error sending message:", error);
//         }
//     };

//     return (
//         <div className="chatbot-container">
//             <h1>Chat with the Bot</h1>
//             <div className="chat-window">
//                 {conversation.map((msg, index) => (
//                     <div key={index} className={`message ${msg.sender}`}>
//                         <p>{msg.text}</p>
//                     </div>
//                 ))}
//             </div>
//             <input
//                 type="text"
//                 value={message}
//                 onChange={handleMessageChange}
//                 placeholder="Type your message..."
//                 className="chat-input"
//             />
//             <button onClick={handleSend} className="send-btn">Send</button>
//         </div>
//     );
// };

// export default Chatbot;
