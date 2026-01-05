import { ClipLoader } from "react-spinners"
import { useAuth } from "../context/Auth"
import { Navigate } from "react-router-dom"

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth()
    console.log("loading")
    if (loading) {
        return (<div className="flex flex-row items-center justify-center h-dvh backdrop-blur-xs">
            <ClipLoader size={20} color="#00fa00" />
        </div>)
    }
    if(!loading && !user)
        return <Navigate to="/login" replace/>

    return children
}