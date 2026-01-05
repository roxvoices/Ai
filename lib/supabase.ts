import { supabase } from './supabaseClient';

async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('Login error:', error.message);
    return;
  }

  console.log('Login success:', data);
  return data;
}

// Example usage
login('test@example.com', 'yourpassword');