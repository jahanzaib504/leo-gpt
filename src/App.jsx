import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LogInSignUp from "./components/log-in-sign-up"
import Dashboard from './pages/dashboard'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import { ThemeContextProiver } from './context/theme'
import supabase from './supabase'
import userContext from './context/user'
import Home from "./pages/home"

function App() {
  const { user, setUser } = useState(null);
  const {loading, setLoading} = useState(true);
  const {isLoggedIn, setLoggedIn} = useState(false);
  //Fetch user info when website loads
  useEffect(()=>{
   const getUser = async()=>{
    const {data, error} = await supabase.getUser()
    if(error || !data.user)
      setLoggedIn(false);
    else{
      setUser(data.user)
      setLoggedIn(true)
    }
    setLoading(false)
   }
  }, [])

  return (
<ThemeContextProiver>  
  <userContext.Provider value={{user, setUser, loading, setLoading, isLoggedIn, setLoggedIn}}>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/dashboard/:chatId" element={<Dashboard/>}></Route>
      <Route path="/dashboard" element={<Dashboard/>}></Route>
      <Route path="/login" element={<LogInSignUp isLogIn={true}/>}></Route>
      <Route path="/signup" element={<LogInSignUp isLogIn={false}/>}></Route>
    </Routes>
  </BrowserRouter>
  </userContext.Provider>
</ThemeContextProiver>
  )
}

export default App
