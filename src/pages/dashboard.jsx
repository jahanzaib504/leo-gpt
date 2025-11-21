import supabase from "../supabase"
import { useState, useEffect, useContext } from "react"
import { themeContext } from "../context/theme"
import { useParams } from "react-router-dom"
const Dashboard = () => {
    const {chatId} = useParams()
    const [loadingChatHistory, setLoadingChatHistory] = useState(true); 
    const [loadingChats, setLoadingChats] = useState(true);
    const [generating, setGenerating] = useState(false); //If set to true the input tag does not accepts anything

    const [chatHistory, setChatHistory] = useState([
        { id: "7fha67hf", userId: "fiua776d", title: "Palestine Issue" },
        { id: "7fha67f", userId: "fiua776d", title: "Balfour Declaration" },
        { id: "7fhdfa7hf", userId: "fiua776d", title: "9/11 Tragedy/Conspiracy lufy gcgcg  cttf gcgcgfc" },
        { id: "7fh67hafdf", userId: "fiua776d", title: "Sadam Hussain Regime" },
        { id: "7fha67hfad", userId: "fiua776d", title: "Colonel Ghadafi" },
        { id: "7fha67hfdf", userId: "fiua776d", title: "Bohr Theory" },
    ]); //{id, userId, title} and timestamps
    const [currentChat, setCurrentChat] = useState([
         ]); //{chatId, id, prompt, response} and timestamps

    const get_llm_response = async (prompt, chatId = null) => {
        //make a request to llm_response edge function
        if (prompt.length > 0) {
            
            const { data, error } = await supabase.functions.invoke("llm_response", {
                body: { prompt, chatId }
            })

            if (error)
                console.log(error)
            else {
                setCurrentChat()
                setChatHistory([...chatHistory, {}]);
            }
        }
    }

    useEffect(() => {
        const fetchChatHistory = async () => {
            //Fetch all the sessions
            const { data, error } = await supabase.from("chat_history").select("*");
            if (error)
                console.log(error)
            else {
                console.log(data)
                setChatHistory(data)
            }
            setLoading(false);
        }

        const fetchChats = async (chatId) => {
            if (chatId) {
                const { data, error } = await supabase.from("chats").select("*");
                if (error)
                    console.log(error)
                else {
                    setCurrentChat(data);
                }
            }
        }

        fetchChatHistory();
        fetchChats();
    })

    const fetch_chat = async (e) => {
        const chatId = e.target.key;
        const { data, error } = await supabase.from("chats").select("*");
        //This gives as an array containing objects {chatId, id, prompt, response}

    }

    return (
        <div className="flex flex-row bg-gray-950 text-white h-screen">

    {/* SIDEBAR */}
    <div className="fixed w-64 h-screen bg-gray-950 px-2 flex flex-col">
        <div className="mt-4 text-xl">LeoGPT</div>
        <input type="text" placeholder="Search History"
               className="text-lg rounded-lg my-2 w-full px-2 py-1" />

        <ul className="flex flex-col gap-1">
            {chatHistory.map((ch) => (
                <li key={ch.id}>
                   <button className="
    p-2 text-lg w-full text-left
    rounded-lg
    border border-transparent
    transition-all
    hover:border-green-500
    hover:shadow-[0_0_10px_rgba(16,185,129,0.7)]
    whitespace-nowrap overflow-hidden text-ellipsis
">
    {ch.title}
</button>

                </li>
            ))}
        </ul>

        <button className="mt-auto">Settings</button>
    </div>

    {/* CONTENT AREA */}
    <div className="ml-64 flex-1 p-4">
        {currentChat.length === 0 ? (
            <div className="flex flex-col items-center mt-32">
                <h1 className="text-2xl mb-2">Welcome to LeoGPT</h1>
                <input type="text" className="text-xl py-1 px-2 w-96 rounded-lg"
                       placeholder="What's on your mind today?" />
            </div>
        ) : (
            <div>
                {currentChat.map((c) => (
                    <div key={c.id} className="flex flex-col mb-4">
                        <h2 className="bg-gray-800 p-2 rounded-md w-1/3 text-lg self-end">{c.prompt}</h2>
                        
                        <p className="bg-gray-800 p-2 rounded-md w-1/3">{c.response}</p>
                    </div>
                ))}
            </div>
        )}
    </div>

</div>
    )
}
export default Dashboard