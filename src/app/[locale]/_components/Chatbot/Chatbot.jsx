'use client'
import { useState, useRef, useEffect } from 'react';

const CHAT_STORAGE_KEY = 'chatbotMessages';
const CHAT_TIMESTAMP_KEY = 'chatbotMessagesTimestamp';
const EXPIRY_TIME = 72 * 60 * 60 * 1000; // 72 hours in milliseconds
const MAX_MESSAGES = 500;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [hoveredMessageIndex, setHoveredMessageIndex] = useState(null); // State to track hovered message index
  const messagesEndRef = useRef(null); // Reference to the end of the message list
  const chatBodyRef = useRef(null); // Reference to the chat body for scrolling

  // Function to store messages and the timestamp in localStorage
  const saveMessagesToLocalStorage = (messages) => {
    // Limit messages to 500
    const trimmedMessages = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(trimmedMessages));
    localStorage.setItem(CHAT_TIMESTAMP_KEY, Date.now().toString());
  };

  // Function to check if the messages in localStorage have expired (older than 72 hours)
  const loadMessagesFromLocalStorage = () => {
    const storedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
    const storedTimestamp = localStorage.getItem(CHAT_TIMESTAMP_KEY);
    if (storedMessages && storedTimestamp) {
      const timestamp = parseInt(storedTimestamp, 10);
      if (Date.now() - timestamp < EXPIRY_TIME) {
        return JSON.parse(storedMessages);
      } else {
        localStorage.removeItem(CHAT_STORAGE_KEY);
        localStorage.removeItem(CHAT_TIMESTAMP_KEY);
      }
    }
    return [];
  };

  useEffect(() => {
    // Load messages from localStorage on initial load
    const savedMessages = loadMessagesFromLocalStorage();
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    }
  }, []);

  useEffect(() => {
    // Save messages to localStorage whenever they change
    saveMessagesToLocalStorage(messages);
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return; // Prevent sending empty messages

    const newMessages = [...messages, { sender: 'user', text: message }];
    setMessages(newMessages); // Add user message to chat

    setMessage(''); // Clear input field

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          dev_id: "true",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setMessages([...newMessages, { sender: 'bot', text: data }]); // Add bot response
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...newMessages, { sender: 'bot', text: 'Error occurred. Please try again.' }]); // Handle error case
    }
  };

  const handleScroll = () => {
    if (chatBodyRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatBodyRef.current;
      // Show button if scrolled more than 100 pixels from the bottom
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 200);
    }
  };

  useEffect(() => {
    const chatBody = chatBodyRef.current;
    if (chatBody) {
      chatBody.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (chatBody) {
        chatBody.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="chatbotContainer">
      {isOpen ? (
        <div className="chatWindow">
          <div className="chatHeader">
            <div>
              <img width={38} src="https://backend.chatbase.co/storage/v1/object/public/chatbots-profile-pictures/bdad6808-27dd-4db5-994c-571e835b583c/2LEW21_G8B52MtSdiHfCQ.jpg?width=40&amp;height=40&amp;quality=50" alt="AI Sales Agent Avatar" />
              <p className='agentName'>AI Sales Agent</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="closeButton">
              <img src='/close.svg' alt='close' width={20} />
            </button>
          </div>
          <div className="chatBody">
            <div className="messagesContainer">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`messageContainer ${msg.sender === 'user' ? 'userMessageContainer' : 'botMessageContainer'}`}
                  onMouseEnter={() => setHoveredMessageIndex(index)} // Track hover
                  onMouseLeave={() => setHoveredMessageIndex(null)}  // Reset hover state
                >
                  {msg.sender === 'bot' && (
                    <img
                      className="botAvatar"
                      width={34}
                      src="https://backend.chatbase.co/storage/v1/object/public/chatbots-profile-pictures/bdad6808-27dd-4db5-994c-571e835b583c/2LEW21_G8B52MtSdiHfCQ.jpg?width=40&amp;height=40&amp;quality=50"
                      alt="AI Sales Agent Avatar"
                    />
                  )}
                  <div className={`message ${msg.sender === 'user' ? 'userMessage' : 'botMessage'}`}>
                    {msg.text}
                    {msg.sender === 'bot' && hoveredMessageIndex === index && (
                      <button className="copyButton" onClick={() => copyToClipboard(msg.text)}>
                        <img src='/copy.svg' alt='copy' width={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {/* Scroll target */}
              <div ref={messagesEndRef} />
            </div>
            {showScrollButton && (
              <div className='scrollButtonContainer'>
                <button
                  className='scrollButton'
                  onClick={() => {
                    if (messagesEndRef.current) {
                      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <img width={24} src='/arrow-down.svg' alt='scroll down' />
                </button>
              </div>
            )}
          </div>
          <div className='inputContainer'>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="input"
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              maxLength={500}
            />
            <button disabled={!message} onClick={sendMessage} className="sendButton">
              <img className='sendImage' src='/send.svg' width={21} alt='send' />
            </button>
          </div>
        </div>
      ) : (
        <button className='openButton' onClick={() => setIsOpen(true)}>
          <div>
            <img src='/chatbot.svg' alt='chatbot' />
          </div>
        </button>
      )}
    </div>
  );
}