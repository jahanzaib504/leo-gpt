import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
let supabase;
try{
    supabase = createClient(supabaseUrl, supabaseKey)
    console.log("Supabase client created successfully")
}catch(e){
    console.log(e)
}
export default supabase;
