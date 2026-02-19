import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Ye function server-side operations (like DB fetch) ke liye hai
export const createServerClient = () => {
  return createServerComponentClient({ cookies });
};