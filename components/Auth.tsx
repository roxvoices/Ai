import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

const supabase = createClient(
  "https://huysermpjlasdenslxiy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1eXNlcm1wamxhc2RlbnNseGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDY2NDUsImV4cCI6MjA4MjY4MjY0NX0.OZBI_zM-aEENeFLSCyigo7-G_MpeCCSMtucslDrLxoI"
);

interface AuthProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (name: string, email: string, password: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    // 🔥 THIS IS WHAT WAS MISSING
    if (data.user) {
      onLogin(email, password);
    }
  };

  const signup = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    onRegister(name || email.split("@")[0], email, password);
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Login / Register</h2>

      <input
        placeholder="Name (for signup)"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 20 }}
      />

      <button onClick={login} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <button onClick={signup} disabled={loading} style={{ marginLeft: 10 }}>
        Sign Up
      </button>
    </div>
  );
};
