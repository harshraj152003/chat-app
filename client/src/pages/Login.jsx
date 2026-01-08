import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    const success = await login(currState === "Sign up" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio,
    });
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* ------- Left Side (Orbit Branding) ------- */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
          
          {/* Modern Abstract CSS Logo for Orbit */}
          <div className="relative w-20 h-20 md:w-24 md:h-24">
             <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-full animate-pulse blur-xl opacity-50"></div>
             <div className="relative bg-slate-900 border-2 border-white/20 w-full h-full rounded-full flex items-center justify-center shadow-2xl">
                <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-[spin_3s_linear_infinite]"></div>
                <div className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_15px_#fff]"></div>
             </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-6xl md:text-7xl font-extrabold text-white tracking-tighter">
              Orbit
            </h1>
            <p className="text-xl md:text-2xl font-light text-indigo-300/80 tracking-wide">
              Stay in the loop. <br /> 
              <span className="text-gray-400 text-lg">Connect with your world in real-time.</span>
            </p>
          </div>

          <div className="hidden md:flex gap-4 items-center text-gray-500 text-sm">
             <span className="px-3 py-1 border border-white/10 rounded-full bg-white/5">✦ End-to-End Encrypted</span>
             <span className="px-3 py-1 border border-white/10 rounded-full bg-white/5">✦ Fast Sync</span>
          </div>
        </div>

        {/* -------- Right Side (Form) ------ */}
        <form
          onSubmit={onSubmitHandler}
          className="w-full max-w-md bg-[#0f172a]/60 backdrop-blur-2xl border border-white/10 p-10 flex flex-col gap-6 rounded-[2.5rem] shadow-2xl shadow-indigo-500/10"
        >
          <div className="space-y-1">
            <h2 className="font-bold text-3xl text-white tracking-tight">
              {currState === "Sign up" ? "Join Orbit" : "Welcome Back"}
            </h2>
            <p className="text-gray-500 text-sm">
              {isDataSubmitted ? "Just one more thing..." : "Enter your details to continue"}
            </p>
          </div>

          <div className="space-y-4">
            {isDataSubmitted && (
              <button 
                type="button"
                onClick={() => setIsDataSubmitted(false)}
                className="flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300 transition-colors mb-2"
              >
                <img src={assets.arrow_icon} alt="Back" className="w-3 invert opacity-70 rotate-180" />
                Go Back
              </button>
            )}

            {currState === "Sign up" && !isDataSubmitted && (
              <input
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
                type="text"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white placeholder-gray-600 outline-none focus:border-indigo-500 focus:bg-white/10 transition-all"
                placeholder="Full Name"
                required
              />
            )}

            {!isDataSubmitted && (
              <>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white placeholder-gray-600 outline-none focus:border-indigo-500 focus:bg-white/10 transition-all"
                  placeholder="Email Address"
                  required
                />
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white placeholder-gray-600 outline-none focus:border-indigo-500 focus:bg-white/10 transition-all"
                  placeholder="Password"
                  required
                />
              </>
            )}

            {currState === "Sign up" && isDataSubmitted && (
              <textarea
                onChange={(e) => setBio(e.target.value)}
                value={bio}
                rows={4}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white placeholder-gray-600 outline-none focus:border-indigo-500 focus:bg-white/10 transition-all resize-none"
                placeholder="Write a short bio about yourself..."
                required
              ></textarea>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all transform active:scale-95"
          >
            {currState === "Sign up" ? (isDataSubmitted ? "Launch Account" : "Get Started") : "Sign In"}
          </button>

          <div className="text-center">
            {currState === "Sign up" ? (
              <p className="text-sm text-gray-500">
                Already an Orbiter?{" "}
                <span
                  onClick={() => {
                    setCurrState("Login");
                    setIsDataSubmitted(false);
                  }}
                  className="font-semibold text-indigo-400 cursor-pointer hover:text-white transition-colors"
                >
                  Login
                </span>
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                New here?{" "}
                <span
                  onClick={() => setCurrState("Sign up")}
                  className="font-semibold text-indigo-400 cursor-pointer hover:text-white transition-colors"
                >
                  Create Account
                </span>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;