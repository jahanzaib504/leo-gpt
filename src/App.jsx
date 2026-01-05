
import LogInSignUp from "./components/log-in-sign-up"
import Dashboard from './pages/dashboard'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import { ThemeContextProiver } from './context/theme'
import Home from "./pages/home"
import {ProtectedRoute} from './routes/protectedRoute'
import { ToastContainer } from 'react-toastify'
import {Verify} from "./pages/verify"
import { AuthContextProvider } from './context/Auth'
function App() {

  return (
<ThemeContextProiver> 
  <AuthContextProvider>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>

     
      <Route path="/dashboard/:chatId" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}></Route>
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}></Route>
   

      <Route path="/login" element={<LogInSignUp isLogIn={true}/>}></Route>
      <Route path="/signup" element={<LogInSignUp isLogIn={false}/>}></Route>
      <Route path="/verify" element={<Verify/>}/>
    </Routes>
  </BrowserRouter>
  </AuthContextProvider>
  <ToastContainer/>
</ThemeContextProiver>
  )
}

export default App
