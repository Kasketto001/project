import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

// Validate environment variables
if (!env.supabaseUrl || !env.supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  throw new Error(
    'Please make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file'
  );
}

// Validate URL format
try {
  new URL(env.supabaseUrl);
} catch (error) {
  console.error('Invalid Supabase URL format');
  throw new Error('VITE_SUPABASE_URL must be a valid URL');
}

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Test the connection
supabase.from('tasks').select('count', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      throw new Error('Failed to connect to Supabase');
    }
  })
  .catch((error) => {
    console.error('Supabase initialization error:', error.message);
  });

export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assignee_id: string;
  created_at: string;
  due_date: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
};