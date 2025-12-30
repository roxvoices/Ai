import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

const supabase = createClient(
  "https://huysermpjlasdenslxiy.supabase.co",
  "YOUR_PUBLIC_ANON_KEY"
);

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  const signup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
  };

  return (
    <div>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
      <button onClick={signup}>Sign up</button>
    </div>
  );
};