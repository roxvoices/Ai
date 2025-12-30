import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

const supabase = createClient(
  "https://huysermpjlasdenslxiy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1eXNlcm1wamxhc2RlbnNseGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDY2NDUsImV4cCI6MjA4MjY4MjY0NX0.OZBI_zM-aEENeFLSCyigo7-G_MpeCCSMtucslDrLxoI"
);

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    if (data.session) {
      localStorage.setItem("userId", data.user.id);
      window.location.reload(); // 🔑 THIS IS THE FIX
    }
  };

  const signup = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Account created! Now log in.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20 }}>
      <h2>Login / Signup</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: 10, width: "100%" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: 10, width: "100%" }}
      />

      <button onClick={login} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <button onClick={signup} disabled={loading} style={{ marginLeft: 10 }}>
        Sign up
      </button>
    </div>
  );
};