import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto'; // Required for Supabase in React Native 

// In a real production app, these would come from react-native-dotenv or similar
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://mock-url.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // We disable local auth storage because our Zustand store handles session persistence
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
