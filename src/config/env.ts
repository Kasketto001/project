interface EnvConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

// Add validation for environment variables
const validateEnvVar = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

export const env: EnvConfig = {
  supabaseUrl: validateEnvVar('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL),
  supabaseAnonKey: validateEnvVar('VITE_SUPABASE_ANON_KEY', import.meta.env.VITE_SUPABASE_ANON_KEY),
};