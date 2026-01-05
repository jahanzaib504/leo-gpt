import { createContext, useContext, useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import supabase from "../supabase"

const AuthContext = createContext()
export const AuthContextProvider = ({children})=>{
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
 
    useEffect(()=>{
        supabase.auth.getSession().then(({data:{session}})=>{
            setUser(session?.user ?? null)
            setLoading(false)
            console("Initial user fetch")
        }).catch(()=>console.log("User not logged in"))
        const {data:{subscription}} = supabase.auth.onAuthStateChange((_event, session)=>{
            setUser(session?.user ?? null)
            setLoading(false)
            console.log("onAuthStateChange triggered")
        })
        return ()=>{subscription.unsubscribe()}
    }, [])
    return <AuthContext.Provider value={{user, loading}}>{children}</AuthContext.Provider>
}
export const useAuth = ()=>{
    const context = useContext(AuthContext)
    if(context == undefined){
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}