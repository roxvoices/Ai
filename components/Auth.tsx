import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    setLoading(false);
  };

  const signup = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) alert(error.message);
    else alert("Account created. You can now log in.");
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto mt-24">
      <h1 className="text-2xl font-black text-white text-center">
        Login to Rox Voices
      </h1>

      <input
        className="p-3 rounded bg-[#050914] border border-white/10 text-white"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="p-3 rounded bg-[#050914] border border-white/10 text-white"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={login}
        disabled={loading}
        className="bg-white text-black font-bold py-3 rounded"
      >
        Login
      </button>

      <button
        onClick={signup}
        disabled={loading}
        className="border border-white/20 text-white py-3 rounded"
      >
        Sign Up
      </button>
    </div>
  );
};
