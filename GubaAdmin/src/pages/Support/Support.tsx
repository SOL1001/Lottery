import { useState } from "react";
import Header from "../../components/Header";

type SupportMessage = {
  id: number;
  userName: string;
  userEmail: string;
  message: string;
  adminResponse?: string;
};

export default function AdminSupportPage() {
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: 1,
      userName: "John Doe",
      userEmail: "john@example.com",
      message: "I can't log into my account.",
    },
    {
      id: 2,
      userName: "Jane Smith",
      userEmail: "jane@example.com",
      message: "How do I reset my password?",
    },
  ]);

  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(
    null
  );
  const [response, setResponse] = useState("");

  const handleSendResponse = () => {
    if (selectedMessage) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === selectedMessage.id
            ? { ...msg, adminResponse: response }
            : msg
        )
      );
      setResponse("");
      setSelectedMessage(null);
    }
  };

  return (
    <div>
      <Header title="Support" />

      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* <h1 className="text-3xl font-bold mb-6 text-[#00A16A]">
            Support Messages
          </h1> */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Message List Column */}
            <div className="lg:col-span-1 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#00A16A]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
                Incoming Messages
              </h2>
              <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`border p-4 rounded-lg cursor-pointer transition-all ${
                      selectedMessage?.id === msg.id
                        ? "border-[#00A16A] bg-[#00A16A]/10"
                        : "border-gray-200 hover:border-[#00A16A]/50"
                    }`}
                    onClick={() => setSelectedMessage(msg)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-[#00A16A]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="font-medium text-gray-800">
                          {msg.userName}
                        </span>
                      </div>
                      {msg.adminResponse && (
                        <span className="bg-[#00A16A] text-white text-xs px-2 py-1 rounded-full">
                          Responded
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {msg.message}
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                      {msg.userEmail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Column */}
            <div className="lg:col-span-2 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              {selectedMessage ? (
                <div className="h-full flex flex-col">
                  <h2 className="text-xl font-semibold mb-1 text-gray-800">
                    Reply to{" "}
                    <span className="text-[#00A16A]">
                      {selectedMessage.userName}
                    </span>
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">
                    {selectedMessage.userEmail}
                  </p>

                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Original Message:
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <p className="text-gray-700">{selectedMessage.message}</p>
                    </div>
                  </div>

                  <div className="flex-grow">
                    <label
                      htmlFor="response"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Your Response
                    </label>
                    <textarea
                      id="response"
                      className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A16A] focus:border-transparent resize-none mb-4"
                      placeholder="Type your response here..."
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
                      onClick={() => setSelectedMessage(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-[#00A16A] hover:bg-[#008a5b] text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                      onClick={handleSendResponse}
                      disabled={!response.trim()}
                    >
                      Send Response
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <p className="text-lg">Select a message to respond</p>
                  <p className="text-sm mt-1">
                    Choose from the list on the left to view details and reply
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
