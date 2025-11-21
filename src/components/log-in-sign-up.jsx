
import { useState, useContext } from "react";
import supabase from "../supabase";
import userContext from "../context/user"
const input_fields_classname = `
  w-full
  p-3 
  rounded-lg
  text-lg 
  bg-white/90 
  border border-gray-300
  shadow-sm
  focus:outline-none 
  focus:ring-1 
  focus:ring-green-300 
  focus:border-green-400
  focus:shadow-[0_0_10px_rgba(34,197,94,0.3)]
  transition-all
`;

const LogInSignUp = ({ isLogIn = true }) => {
  const [user, setUser] = useState({ fullname: "", password: "", email: "" });
  const { setUser: setUserInfo, setLoggedIn } = useContext(userContext);
  const [error, setError] = useState({username:false, email:false, password:false})

  const fieldChange = (e) => {
    setUser((user) => ({ ...user, [e.target.id]: e.target.value }));
    setError((error) => ({...error, [e.target.id]:false}))
  };
  const errorOccured = (e)=>{
    setError((error) => ({...error, [e.target.id]:true}))
  }
  const submit_form = async (e) => {
    e.preventDefault();
  
    if (isLogIn) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email, password
      })
      if (error || !data.user) {

      } else {

        setUserInfo(data.user)
        setLoggedIn(true)
      }
    }
    else {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: {
          data: {
            full_name: fullname
          }
        }
      })
      if (error || !data.user) {

      } else {
        setUserInfo(data.user)
        setLoggedIn(true);
      }
    }

  };
  const OAuth_google = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',

    });

    if (error || !data.user) console.log(error);
    else{
      setUserInfo(data.user)
      setLoggedIn(true)
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-green-100 to-emerald-200 p-4">

      <form
        className="w-full max-w-md p-6 rounded-2xl bg-white/70 backdrop-blur-xl shadow-xl border border-white/40"
        onSubmit={submit_form}
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-emerald-600">
          {isLogIn ? "Login" : "Sign Up"}
        </h1>

        {/* fullname (only in signup) */}
        {!isLogIn && (
          <div className="flex flex-col gap-1 mb-4">
            <label htmlFor="fullname" className="text-sm text-gray-700">
              fullname
            </label>

            <input
              type="text"
              id="fullname"
              onChange={fieldChange}
              className={`${input_fields_classname}`}
              required
              minLength="6"
              maxLength="20"
              onInvalid={errorOccured}
            />

          </div>
        )}

        {/* EMAIL */}
        <div className="flex flex-col gap-1 mb-4 peer-focus-within:text-green-600">
          <label htmlFor="email" className="text-sm text-gray-700">
            Email
          </label>

          <input
            type="text"
            id="email"
            onChange={fieldChange}
            onInvalid={errorOccured}
            minLength="6"
            className={`${input_fields_classname} ${error.email?"animate-wiggle":""}`}
          />


        </div>

        {/* PASSWORD */}
        <div className="flex flex-col gap-1 mb-6">
          <label htmlFor="password" className="text-sm text-gray-700">
            Password
          </label>

          <input
            type="password"
            id="password"
            onChange={fieldChange}
            onInvalid={errorOccured}
            className={`${input_fields_classname} `}
            required
            minLength="6"
          />


        </div>

        {/* SUBMIT BUTTON */}
        <input
          type="submit"
          className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-md transition-all"
        placeholder="Submit"/>
         

        <div className="h-2"></div>

        {/* GOOGLE SIGN IN */}
        <button
          className="w-full py-3 rounded-lg bg-white border border-gray-300 shadow-sm hover:bg-gray-50 font-medium transition-all"
          onClick={OAuth_google}
        >
          {isLogIn ? "Login with Google" : "Sign Up with Google"}
        </button>
      </form>
    </div>
  );
};

export default LogInSignUp;
