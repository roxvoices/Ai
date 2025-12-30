import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

const supabase = createClient(
  "https://huysermpjlasdenslxiy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1eXNlcm1wamxhc2RlbnNseGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDY2NDUsImV4cCI6MjA4MjY4MjY0NX0.OZBI_zM-aEENeFLSCyigo7-G_MpeCCSMtucslDrLxoI"
);

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) alert(error.message);
    else alert("Account created!");
  }

  async function login() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    else {
      localStorage.setItem("userId", data.user.id);
      alert("Logged in!");
    }
  }

  return (
    <div>
      <h2>Login / Signup</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>Login</button>
      <button onClick={signUp}>Sign Up</button>
    </div>
  );
}