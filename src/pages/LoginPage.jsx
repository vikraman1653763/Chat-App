import React, { useState } from "react";
import assets from "../assets/assets";

const LoginPage = () => {

  const [currState, setCurrState] = useState("Sign up");
 
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
 
  const onSumbitHandler =(event)=>{
    event.preventDefault()
    if(currState ==='Sign up' && !isDataSubmitted){
      setIsDataSubmitted(true)
      return
    }
  }

  return (
    <div className=" min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      <img src={assets.logo_big} alt="" className="w-[min(30vw,250px)]" />

      <form
       onSubmit={onSumbitHandler}
       className=" border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">
        <h2 className=" font-medium text-2xl flex justify-between items-center ">
          {currState}
        {isDataSubmitted &&
          <img
          src={assets.arrow_icon}
        onClick={()=>setIsDataSubmitted(false)}
          alt="arrow icon"
          className=" w-5  cursor-pointer"
          />
        }
        </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <input
            type="text"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Full Name"
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              type="email"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </>
        )}

        {currState === "Sign up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="provide a short bio..."
            required
          ></textarea>
        )}
        <button
          type="submit"
          className=" py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer hover:from-purple-300 hover:to-violet-500 "
        >

          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>
        <div className=" flex items-center gap-2 text-sm text-gray-500">
          <input
            type="checkbox"
            className="w-4 h-4 accent-violet-500 rounded-full"
          />
          <p>Agree to the terms of use & privacy policy</p>
        </div>

        <div className=" flex flex-col gap-2">
          {currState === "Sign up" ? (
            <p className=" text-sm text-gray-600">
              Already have an account ?
              <span
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSubmitted(false);
                }}
                className=" font-medium text-violet-500 cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className=" text-sm text-gray-600">
              Create an account
              <span
                className=" font-medium text-violet-500 cursor-pointer"
                onClick={() => {
                  setCurrState("Sign up");
                }}
              >
                Sign Up here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
