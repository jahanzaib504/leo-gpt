
import { useState, useContext } from "react";
import supabase from "../supabase";
import userContext from "../context/user"
import { Link } from "react-router-dom";
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
  const [error, setError] = useState({ username: false, email: false, password: false })

  const fieldChange = (e) => {
    setUser((user) => ({ ...user, [e.target.id]: e.target.value }));
    setError((error) => ({ ...error, [e.target.id]: false }))
  };
  const errorOccured = (e) => {
    setError((error) => ({ ...error, [e.target.id]: true }))
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
    else {
      setUserInfo(data.user)
      setLoggedIn(true)
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4">

      <form
        onSubmit={submit_form}
        className="
      w-full max-w-md p-7 rounded-3xl
      bg-white
      border border-green-200
      shadow-[0_15px_40px_rgba(34,197,94,0.12)]
      hover:shadow-[0_20px_50px_rgba(34,197,94,0.18)]
      transition-all duration-300
    "
      >
        <h1 className="text-3xl font-extrabold text-center mb-6">
          <span className="text-gray-900">
            {isLogIn ? "Welcome Back" : "Create Account"}
          </span>
          <span className="text-green-600"> • LeoGPT</span>
        </h1>

        {/* Fullname (signup only) */}
        {!isLogIn && (
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="fullname"
              type="text"
              onChange={fieldChange}
              className="
            w-full mt-1 px-3 py-2 rounded-xl
            border border-green-200
            bg-green-50/40
            focus:bg-white
            focus:border-green-400
            focus:ring-2 focus:ring-green-300
            outline-none
            transition-all
          "
              minLength={6}
              required
            />
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            onChange={fieldChange}
            className="
          w-full mt-1 px-3 py-2 rounded-xl
          border border-green-200
          bg-green-50/40
          focus:bg-white
          focus:border-green-400
          focus:ring-2 focus:ring-green-300
          outline-none
          transition-all
        "
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            onChange={fieldChange}
            className="
          w-full mt-1 px-3 py-2 rounded-xl
          border border-green-200
          bg-green-50/40
          focus:bg-white
          focus:border-green-400
          focus:ring-2 focus:ring-green-300
          outline-none
          transition-all
        "
            minLength={6}
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="
        w-full py-3 rounded-xl
        bg-green-600 text-white font-semibold
        shadow-[0_8px_20px_rgba(34,197,94,0.35)]
        hover:bg-green-700
        hover:shadow-[0_10px_28px_rgba(34,197,94,0.45)]
        transition-all
      "
        >
          {isLogIn ? "Login" : "Create Account"}
        </button>

        <div className="h-3" />

        {/* Google */}
        <button
          onClick={OAuth_google}
          className="
        w-full py-3 rounded-xl
        bg-white border border-green-300
        text-green-700 font-medium
        hover:bg-green-50
        transition-all
      "
        >
          {isLogIn ? "Continue with Google" : "Sign Up with Google"}
        </button>

        {/* Switch mode */}
        <p className="text-sm text-gray-700 text-center mt-4">
          {isLogIn ? (
            <>Don’t have an account? <Link className="text-green-700 font-semibold" to="/signup">Sign Up</Link></>
          ) : (
            <>Already have an account? <Link className="text-green-700 font-semibold" to="/login">Log In</Link></>
          )}
        </p>
      </form>
    </div>

  );
};

export default LogInSignUp;
