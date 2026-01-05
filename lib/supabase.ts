
import { createClient } from '@supabase/supabase-js';

/**
 * Aggressively cleans strings of invisible formatting characters (like U+200E) 
 * and surrounding quotes that often break API headers.
 */
const cleanString = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/[\u200B-\u200D\uFEFF\u200E\u200F]/g, '') // Remove invisible marks
    .replace(/^["']|["']$/g, '')                    // Remove surrounding quotes
    .trim();                                         // Trim whitespace
};

const supabaseUrl = cleanString('https://huysermpjlasdenslxiy.supabase.co');
const supabaseAnonKey = cleanString('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1eXNlcm1wamxhc2RlbnNseGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDY2NDUsImV4cCI6MjA4MjY4MjY0NX0.OZBI_zM-aEENeFLSCyigo7-G_MpeCCSMtucslDrLxoI');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
