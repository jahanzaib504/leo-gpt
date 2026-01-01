import { useContext } from "react"
import userContext from "./context/user"
import { useNavigate } from "react-router-dom"

const AuthRoute = ({children})=>{
    const {isLoggedIn, loading} = useContext(userContext)
    const navigate = useNavigate()
    if(loading)
        return <></>
    else if(!isLoggedIn)
        navigate("/login")

    return children
}
export default AuthRoute