// Supabase Configuration
export const supabaseConfig = {
  url: 'https://cegioqsqxqlxffaaxyen.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlZ2lvcXNxeHFseGZmYWF4eWVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODg5MDEsImV4cCI6MjA3NDY2NDkwMX0.5vj09vbmQ4801aA_SkfuSVBmj7_9Yl-MEsuMjIinc1M'
};

// Environment variables for production (optional)
export const getSupabaseConfig = () => {
  return {
    url: process.env.VITE_SUPABASE_URL || supabaseConfig.url,
    anonKey: process.env.VITE_SUPABASE_ANON_KEY || supabaseConfig.anonKey
  };
};