import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LogInSignUp from "./components/log-in-sign-up"
import Dashboard from './pages/dashboard'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import { ThemeContextProiver } from './context/theme'
function App() {
  const [count, setCount] = useState(0)

  return (
<ThemeContextProiver>
  <BrowserRouter>
    <Routes>

      <Route path="/dashboard/:chatId" element={<Dashboard/>}></Route>
      <Route path="/dashboard" element={<Dashboard/>}></Route>
      
    </Routes>
  </BrowserRouter>
</ThemeContextProiver>
  )
}

export default App
