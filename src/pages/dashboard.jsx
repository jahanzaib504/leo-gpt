import supabase from "../supabase";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm";


function GPTResponse(text) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {text}
      </ReactMarkdown>
    </div>
  );
}

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
    const fetchChats = async (chat_id) => {
      if (chat_id) {
        const { data, error } = await supabase.from("chats").select("*").eq("chat_id", chat_id);
        if (error) {
          console.log("An error occured while loading chat")
        }
        else if (!data || data?.length == 0) {
          console.log("Chat not found")
          navigate("/dashboard");
        }
        else setCurrentChat(data);
      }else{
        setCurrentChat([])
      }
      setLoadingChats(false);
    };
    fetchChats(paramChatId);
  }, [paramChatId]);
  useEffect(() => {
    const fetchChatHistory = async () => {
      const { data, error } = await supabase.from("chat_history").select("*");
      if (error) console.log(error);
      else setChatHistory(data.reverse());
      setLoadingChatHistory(false);
    };
    fetchChatHistory();
  }, [])
  return (
    <div className="flex flex-row h-screen bg-white text-gray-900">

      {/* SIDEBAR */}
      <div className="fixed w-64 h-full bg-green-50 border-r border-green-200 px-4 py-6 flex flex-col shadow-sm">
        <h1 className="text-2xl font-extrabold text-green-700 mb-4">
          LeoGPT
        </h1>

        <input
          type="text"
          placeholder="Search chats..."
          className="
          text-sm px-3 py-2 rounded-xl
          bg-white border border-green-200
          focus:outline-none focus:ring-2 focus:ring-green-300
          placeholder:text-gray-400
          mb-4
        "
        />

        {loadingChatHistory ? (
          <div className="text-gray-500">Loading chat history...</div>
        ) : (
          <ul className="flex flex-col gap-2 flex-1 overflow-y-auto">
            <Link to="/dashboard" className="
                  block px-3 py-2 rounded-xl text-sm
                  border border-transparent
                  hover:border-green-400
                  hover:bg-green-100
                  text-gray-800 truncate
                  transition-all
                ">New Chat</Link>

            {chatHistory.map((ch) => (
              <li key={ch.id}>
                <Link
                  to={`/dashboard/${ch.id}`}
                  className={`
                  block px-3 py-2 rounded-xl text-sm
                  ${(paramChatId === ch.id)?"bg-green-300":""}
                  border border-transparent
                  hover:border-green-400
                  hover:bg-green-100
                  text-gray-800 truncate
                  transition-all
                `}
                >
                  {ch.title}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <button className="
        mt-auto py-2 px-4 rounded-xl
        bg-green-600 text-white font-semibold
        hover:bg-green-700 shadow-sm transition
      ">
          Settings
        </button>
      </div>

      {/* CONTENT */}
      <div className="ml-64 flex-1 p-8 bg-white">
        {loadingChats ? (
          <div className="text-gray-500">Loading chats...</div>
        ) : currentChat.length === 0 ? (

          /* ---------- EMPTY STATE ---------- */
          <div className="flex flex-col items-center justify-center mt-32">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to <span className="text-green-700">LeoGPT</span>
            </h1>
            <p className="text-gray-500 mt-2">
              Start a new conversation below
            </p>

            <input
              type="text"
              placeholder="What's on your mind?"
              className="
              mt-5 w-96 px-4 py-3 rounded-xl
              bg-green-50 border border-green-300
              focus:outline-none focus:ring-2 focus:ring-green-300
              placeholder:text-gray-500
            "
              value={prompt}
              onChange={fieldChange}
              onKeyDown={submit}
              disabled={generating}
            />
          </div>

        ) : (

          /* ---------- CHAT THREAD ---------- */
          <div className="flex flex-col gap-4">
            {currentChat.map((c) => (
              <div key={c.id} className="flex flex-col gap-2">

                {/* USER */}
                <div className="
                self-end max-w-xl px-4 py-3 rounded-2xl
                bg-green-600 text-white shadow
              ">
                  {c.prompt}
                </div>

                {/* AI */}
                <div className="
                self-start px-4 py-3 rounded-2xl
                bg-green-50 border border-green-200 text-gray-900 shadow-sm
              ">
                  {GPTResponse(c.response)}
                </div>
              </div>
            ))}

            {/* INPUT */}
            <input
              type="text"
              placeholder="Type your next message..."
              className="
              mt-4 w-96 px-4 py-3 rounded-xl
              bg-white border border-green-300
              focus:outline-none focus:ring-2 focus:ring-green-400
              placeholder:text-gray-500
            "
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
