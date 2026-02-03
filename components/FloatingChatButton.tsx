'use client';

import React, { useState } from 'react';

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="floating-chat-button fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-2xl shadow-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 z-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chat"
      >
        💬
      </button>

      {isOpen && (
        <div className="chat-window fixed bottom-24 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50">
          <div className="chat-header bg-gradient-to-r from-purple-500 to-indigo-600 p-4 text-white flex justify-between items-center rounded-t-xl">
            <h3>Todo Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          <div className="chat-body flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <p>Hello! How can I help you with your tasks today?</p>
          </div>
          <div className="chat-input p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button className="px-4 py-2 bg-purple-500 text-white rounded-r-lg hover:bg-purple-600">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatButton;