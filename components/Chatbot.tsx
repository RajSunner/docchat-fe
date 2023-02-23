import React, { useState, useEffect, useRef } from 'react';

const Chatbot = ({name, url}) => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const messageListRef = useRef(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    const messageList = messageListRef.current;
    messageList.scrollTop = messageList.scrollHeight;
  }, [messages]);

  // Focus on text field on load
  useEffect(() => {
    textAreaRef.current.focus();
  }, []);

  const handleError = () => {
    setMessages([
      ...messages,
      { "message": "Oops! There seems to be an error. Please try again.", "user": false }
    ]);
    setUserMessage('');
    setLoading(false);
  }

  const handleMessage = async () => {
    setLoading(true);
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: userMessage,
        history: history,
        file_name: name,
        url: url,
        dname : "Report",
      })
    });

    if (!response.ok) {
      handleError();
      return;
    }
    setUserMessage('');

    const data = await response.json();
    console.log(data);
    if (data.result.error === "Unauthorized") {
      handleError();
      return;
    }
    setMessages([
        ...messages,
        { "message": userMessage, "user": true },
        { "message": data.result.answer, "user": false }
      ]);
    setLoading(false);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && userMessage) {
      if (!e.shiftKey && userMessage) {
        handleMessage(e);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (messages.length >= 3) {
      console.log(history)
      setHistory([[messages[messages.length - 2].message, messages[messages.length - 1].message]]);
    }
  }, [messages])

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <div ref={messageListRef} className="mb-4">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`flex ${
              message.user ? 'justify-end' : 'justify-start'
            } mb-2`}
          >
            <div
              className={`bg-gray-300 p-2 rounded-lg ${
                message.user ? 'bg-gray-500 text-white' : ''
              }`}
            >
              {message.user ? (
                <div>
                    <span className="font-bold">User: </span>
                    {message.message}
                </div>
              ) : (
                <div>
                  <span className="font-bold">Bot: </span>
                  {message.message}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex mb-4">
        <input
          type="text"
          className="flex-grow rounded-lg border-gray-300 border p-2 mr-2"
          value={userMessage}
          ref={textAreaRef}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyDown={handleEnter}
        />
        <button
          className="bg-blue-500 text-white rounded-lg p-2"
          onClick={handleMessage}
        >
          Send
        </button>
      </div>
      {loading && <div className="text-center">Loading...</div>}
    </div>
  );
};

export default Chatbot;
