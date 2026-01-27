
import { createClient } from '@supabase/supabase-js';

/**
 * Strips all invisible characters, formatting marks, and extra quotes
 * that often get copied into credentials from chat or documentation.
 */
const clean = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/[\u200B-\u200D\uFEFF\u200E\u200F\s]/g, '') // Remove all spaces and invisible marks
    .replace(/^["']|["']$/g, '')                    // Remove surrounding quotes
    .trim();
};

// These credentials allow access to the Auth layer. 
// Sensitive Gemini API keys are never stored here.
const supabaseUrl = clean('https://huysermpjlasdenslxiy.supabase.co');
const supabaseAnonKey = clean('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1eXNlcm1wamxhc2RlbnNseGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDY2NDUsImV4cCI6MjA4MjY4MjY0NX0.OZBI_zM-aEENeFLSCyigo7-G_MpeCCSMtucslDrLxoI');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);