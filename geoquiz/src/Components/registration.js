"use client";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          alert("Account created successfully!");
        } catch (error) {
          setError(error.message);
        }
      };
      return (
        <div>
          <h2>Register</h2>
          {error && <p>{error}</p>}
          <form onSubmit={handleRegister}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit">Register</button>
          </form>
        </div>
      );
    };
    export default Register;