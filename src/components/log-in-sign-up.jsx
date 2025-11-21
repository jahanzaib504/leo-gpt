
import { useState } from "react";
import supabase from "../supabase";

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

  const [errors, setErrors] = useState({
    fullname: false,
    email: false,
    password: false
  });

  const fieldChange = (e) => {
    setUser((user) => ({ ...user, [e.target.id]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.id]: false })); // remove error on change
  };

  const submit_form = async (e) => {
    e.preventDefault();
    // Fake server validation example:
    if(isLogIn){
        const {data, error} = await supabase.auth.signInWithPassword({

        })}
    else{
        const {data, error } = await supabase.auth.signUp({
            email, password,
            options:{
                data:{
                    full_name:fullname
                }
            }
        })
    }

    console.log("Submitting:", user);
  };
  const OAuth_google = async()=>{
    return 
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 to-emerald-200 p-4">

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
              className={`${input_fields_classname} ${
                errors.fullname
                  ? "border-red-400 shadow-red-300 animate-wiggle"
                  : ""
              }`}
            />

            {errors.fullname && (
              <p className="text-xs text-red-500">fullname is too short.</p>
            )}
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
            className={`${input_fields_classname} ${
              errors.email
                ? "border-red-400 shadow-red-300 animate-wiggle"
                : ""
            }`}
          />

          {errors.email && (
            <p className="text-xs text-red-500">Please enter a valid email.</p>
          )}
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
            className={`${input_fields_classname} ${
              errors.password
                ? "border-red-400 shadow-red-300 animate-wiggle"
                : ""
            }`}
          />

          {errors.password && (
            <p className="text-xs text-red-500">
              Password must be at least 6 characters.
            </p>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-md transition-all"
        >
          Submit
        </button>

        <div className="h-2"></div>

        {/* GOOGLE SIGN IN */}
        <button
          className="w-full py-3 rounded-lg bg-white border border-gray-300 shadow-sm hover:bg-gray-50 font-medium transition-all"
        >
          {isLogIn ? "Login with Google" : "Sign Up with Google"}
        </button>
      </form>
    </div>
  );
};

export default LogInSignUp;
