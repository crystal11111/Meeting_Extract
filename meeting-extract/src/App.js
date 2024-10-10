import React from "react";
import "./App.css";
import Home from "./pages/Home/Home";
//import Chatbot from "./pages/Chatbot/Chatbot";
import Navbar from "./components/Navbar";  

function App() {
  return (
    <div className="App">
      <Navbar /> 
      <section id="home">
        <Home />
      </section>
      {/* <section id="chatbot">
        <Chatbot />
      </section> */}
    </div>
  );
}

export default App;
