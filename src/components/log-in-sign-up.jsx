
import { useState, useContext } from "react";
import supabase from "../supabase";
import userContext from "../context/user"
import { Link, Navigate } from "react-router-dom";
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom"
const Wiggle = ({ children, error, id }) => {
  const isError = error[id];
  return (<div className={(isError) ? "animate-wiggle" : ""}>
    {children}
  </div>)
}
const InputField = ({ label, fieldChange, minLength, type = "text", id, error, errorOccured }) => {
  return (<div className="mb-4">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <Wiggle id={id} error={error}><input
      id={id}
      type={type}
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
      minLength={minLength}
      required
      autoComplete="true"
      onInvalid={errorOccured}
    />
    </Wiggle>
  </div>)
}

const LogInSignUp = ({ isLogIn = true }) => {
  const [user, setUser] = useState({ fullname: "", password: "", email: "" });
  const { setUser: setUserInfo, } = useContext(userContext);
  const [error, setError] = useState({ username: false, email: false, password: false })
  const navigate = useNavigate()
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
        email: user.email, password: user.password
      })
      if (error || !data.user) {
        console.log("Error occured while log in", error)
        if (error.status === 400 || error.status === 401) {
          toast.error("Incorrect email or password")
          setError(prev => ({ ...prev, email: true, password: true }))
        } else { toast.error("An error occured while log in") }
        return
      }
      navigate("/dashboard", { replace: true });
    }
    else {
      const { data, error } = await supabase.auth.signUp({
        email: user.email, password: user.password,
        options: {
          data: {
            full_name: user?.fullname
          }
        }
      })
      if (error || !data.user) {
        console.log(error)
        toast.error("An error occured while signUp")
      } else {
        navigate("/verify")
      }
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
        {!isLogIn && <InputField label="Full Name" minLength={4} id="fullname" fieldChange={fieldChange} error={error} errorOccured={errorOccured} />}
        {/* Email */}
        <InputField label="Email" minLength={0} id="email" fieldChange={fieldChange} type="email" error={error} errorOccured={errorOccured} />
        {/* Password */}
        <InputField label="Password" minLength={6} id="password" fieldChange={fieldChange} type="password" error={error} errorOccured={errorOccured} />
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
        <GoogleSignInUp isLogIn={isLogIn} />

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
const GoogleSignInUp = ({ isLogIn }) => {
  const OAuth_google = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) console.log(error);
  }
  return (<button
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
  </button>);
};
export default LogInSignUp;
