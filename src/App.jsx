import { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./components/chatboticon";
import ChatForm from "./components/chatform";
import ChatMessage from "./components/ChatMessage";
import { companyInfo } from "./companyinfo";


const App = () => {
  const [chatHistory, setChatHistory] = useState([{
    hideInChat : true ,
    role : "model",
    text : companyInfo
  }]);
  const [ShowChatBot, setShowChatBot] = useState(false);

  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "Thinking..."), {role: "model" , text , isError}]);
    };

    history = history.map(({role, text}) => ({role, parts: [{text}]}));
    const requestOptions = {
      method: "POST",
      headers:{"Content-Type" : "application/json"},
      body: JSON.stringify({contents : history })
    }

    try{
      const response =await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data =await response.json();
      if(!response.ok) throw new Error(data.error.message || "Something Went Wrong!");

      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(apiResponseText);
    }catch(error){
       updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behaviour: "smooth"});
  },[chatHistory]);

  return (
    <div className={`container ${ShowChatBot ? "show-chatbot": ""}`}>
      <button onClick={() => setShowChatBot((prev) => !prev)} id="chatbot-toggler">
      <span  className="material-symbols-rounded">mode_comment</span>
      <span  className="material-symbols-rounded">close</span>
      </button>
        <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">CAKIE</h2>
          </div>
          <button onClick={() => setShowChatBot((prev) => !prev)} className="material-symbols-rounded">
            keyboard_arrow_down
          </button>
        </div>
        <div ref={chatBodyRef} className="chat-body">
          <div className="mesaage bot-message">
            <ChatbotIcon />
            <p className="message-text">
            Hi there! 🎂 I'm Cakie <br/>your sweet assistant from SRt cakeschocolates!
            </p>
          </div>
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
       
        </div>
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
        </div>
      </div>
    </div>
  );
};

export default App;
