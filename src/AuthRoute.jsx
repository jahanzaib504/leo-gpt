import { useContext } from "react"
import userContext from "./context/user"
import { Navigate } from "react-router-dom"

const AuthRoute = ({children})=>{
    const {user, loading} = useContext(userContext)
    if(loading)
        return <></>
    else if(!user)
        return <Navigate to="/login" replace/>

    return children
}
export default AuthRoute