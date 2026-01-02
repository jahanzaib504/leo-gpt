import { useContext } from "react"
import userContext from "./context/user"
import { Navigate } from "react-router-dom"

const AuthRoute = ({children})=>{
    const {isLoggedIn, loading} = useContext(userContext)
    if(loading)
        return <></>
    else if(!isLoggedIn)
        return <Navigate to="/login" replace/>

    return children
}
export default AuthRoute