import ChatbotIcon from "./chatboticon";

const ChatMessage = ({chat}) => {
  return (
    !chat.hideInChat &&( 
    <div className={`mesaage ${chat.role === "model" ? "bot" : "user"}-message  ${chat.isError ? "error" : ""}`}>
        {chat.role === "model" && <ChatbotIcon />}
    <p className="message-text">{chat.text}</p>
  </div>
  )
  );
};

export default ChatMessage;
