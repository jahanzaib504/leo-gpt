import supabase from "../supabase";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { chatId: paramChatId } = useParams();
  const navigate = useNavigate()
  const [loadingChatHistory, setLoadingChatHistory] = useState(true);
  const [loadingChats, setLoadingChats] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [chatHistory, setChatHistory] = useState([]); // {id, title}
  const [currentChat, setCurrentChat] = useState([]); // {chat_id, prompt, response, id}
  const [prompt, setPrompt] = useState("");

  const fieldChange = (e) => setPrompt(e.target.value);

  // Fetch response from LLM
  const getLlmResponse = async (promptText, chat_id = null) => {
    if (!promptText.trim()) return;

    setGenerating(true);

    const { data, error } = await supabase.functions.invoke("llm_response", {
      body: { prompt: promptText, chat_id },
    });

    setGenerating(false);

    if (error) {
      console.log(error);
      return;
    }

    // Append new chat response
    setCurrentChat((prev) => [
      ...prev,
      {
        chat_id: data.chat_id,
        prompt: promptText,
        response: data.response,
        id: data.id,
      },
    ]);

    // If it's a new chat session, update chat history
    if (!chat_id) {
      setChatHistory((prev) => [{ id: data.chat_id, title: data.title }, ...prev]);
    }

    setPrompt("");
  };

  const submit = (e) => {
    if (e.key === "Enter" && !generating) {
      getLlmResponse(prompt, currentChat[0]?.chat_id);
    }
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      const { data, error } = await supabase.from("chat_history").select("*");
      if (error) console.log(error);
      else setChatHistory(data.reverse());
      setLoadingChatHistory(false);
    };

    const fetchChats = async (chat_id) => {
      if (chat_id) {
        const { data, error } = await supabase.from("chats").select("*").eq("chat_id", chat_id);
        if (error){
          console.log("An error occured while loading chat")
        }
        else if(!data || data?.length == 0){
            console.log("Chat not found")
            navigate("/dashboard");
        }
        else setCurrentChat(data);
      }
      setLoadingChats(false);
    };

    fetchChatHistory();
    fetchChats(paramChatId);
  }, [paramChatId]);

  return (
    <div className="flex flex-row h-screen bg-gray-950 text-white">
      {/* SIDEBAR */}
      <div className="fixed w-64 h-full bg-gray-900 px-4 py-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-4">LeoGPT</h1>
        <input
          type="text"
          placeholder="Search History"
          className="text-lg rounded-lg px-3 py-2 mb-4 w-full text-white"
        />

        {loadingChatHistory ? (
          <div className="text-gray-400">Loading chat history...</div>
        ) : (
          <ul className="flex flex-col gap-2 flex-1 overflow-y-auto scroll-smooth scrollbar-transparent">
            {chatHistory.map((ch) => (
              <li key={ch.id}>
                <Link
                  to={`/dashboard/${ch.id}`}
                  className="block p-2 text-lg rounded-lg border-2 border-transparent hover:border-green-500 hover:shadow-md truncate transition-all duration-200"
                >
                  {ch.title}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <button className="mt-auto py-2 px-4 bg-green-600 rounded-lg hover:bg-green-700 transition-all">
          Settings
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="ml-64 flex-1 p-6 overflow-y-auto">
        {loadingChats ? (
          <div className="text-gray-400">Loading chats...</div>
        ) : currentChat.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-32">
            <h1 className="text-3xl font-semibold mb-4">Welcome to LeoGPT</h1>
            <input
              type="text"
              placeholder="What's on your mind today?"
              className="text-xl py-2 px-3 w-96 rounded-lg text-white"
              value={prompt}
              onChange={fieldChange}
              onKeyDown={submit}
              disabled={generating}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {currentChat.map((c) => (
              <div key={c.id} className="flex flex-col gap-2">
                <div className="self-end bg-green-800 text-white p-3 rounded-xl max-w-md break-words">
                  {c.prompt}
                </div>
                <div className="self-start bg-gray-800 text-white p-3 rounded-xl max-w-md break-words">
                  {c.response}
                </div>
              </div>
            ))}
            <input
              type="text"
              placeholder="Type your next message..."
              className="text-xl py-2 px-3 w-96 rounded-lg text-gray-900 mt-4"
              value={prompt}
              onChange={fieldChange}
              onKeyDown={submit}
              disabled={generating}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
