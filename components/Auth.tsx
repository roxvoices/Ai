import { useState } from "react";
import { supabase } from "../lib/supabase";

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
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {
      // 🔑 CONNECT SUPABASE → YOUR APP
      onLogin(email, password);
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
      return;
    }

    alert("Account created! You can now log in.");
    onRegister(name || email.split("@")[0], email, password);
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Login / Register</h2>

      <input
        placeholder="Name (signup only)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 20, padding: 8 }}
      />

      <button onClick={login} disabled={loading} style={{ marginRight: 10 }}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <button onClick={signup} disabled={loading}>
        Sign up
      </button>
    </div>
  );
};