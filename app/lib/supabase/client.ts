import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Ye function browser-side Supabase instance return karega
export const createClient = () => createClientComponentClient();