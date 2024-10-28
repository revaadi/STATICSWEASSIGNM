"use client";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import axios from "axios";
import { useRouter } from "next/navigation";
import "../../Styles/AuthStyles/LoginFormStyles.css";

function LoginForm() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken(true);
      console.log('Token:', idToken);

      const response = await axios.post("http://localhost:5000/api/login", { idToken });

      if(response.status === 200){
        alert("Login successful!");

        router.push("/flashcardpage");
      }
      else{
        throw new Error('Login failed on backend');
      }
      

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="form-content">

      <h1 className="title">Login</h1>
      <form className="margin" onSubmit={handleLogin}>

        <h2 className="sub-title">
          Email
        </h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <h2 className="sub-title">
          Password
        </h2>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        {error && <p className="error">{error}</p>}

        <button 
          type="submit"
          className="button"
        >
          Login
        </button> 
      </form>
    </div>
  )
}

export default LoginForm;