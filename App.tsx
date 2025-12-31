import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { Layout } from "./components/Layout";
import { Auth } from "./components/Auth";
import { User } from "./types";

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1️⃣ Check existing session on load
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const supaUser = data.session.user;

        const appUser: User = {
          id: supaUser.id,
          email: supaUser.email || "",
          name: supaUser.email?.split("@")[0] || "User",
          history: [],
          charsUsed: 0,
          lastResetDate: new Date().toISOString().split("T")[0],
          customVoices: [],
        };

        setUser(appUser);
      }

      setLoading(false);
    });

    // 2️⃣ React instantly to login / logout
    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          const supaUser = session.user;
          setUser({
            id: supaUser.id,
            email: supaUser.email || "",
            name: supaUser.email?.split("@")[0] || "User",
            history: [],
            charsUsed: 0,
            lastResetDate: new Date().toISOString().split("T")[0],
            customVoices: [],
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Layout user={user} onLogout={() => supabase.auth.signOut()}>
      {!user ? <Auth /> : <div>{/* YOUR EXISTING APP UI */}</div>}
    </Layout>
  );
};

export default App;