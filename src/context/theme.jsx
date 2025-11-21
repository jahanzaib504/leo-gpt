import { useContext, createContext, Children, useState } from "react";
const themeContext = createContext()
const ThemeContextProiver = ({children})=>{
    const {darkMode, setDarkMode} = useState(false);
return(
    <themeContext.Provider value={{darkMode, setDarkMode}}>
        {children}
    </themeContext.Provider>
)
}
export {themeContext, ThemeContextProiver}