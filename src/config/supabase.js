import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qwdviomjxdthpuqqineq.supabase.co';
const supabaseAnonKey = 'sb_publishable_fNmCjCKgVisvURMwgSQkpQ_jRdvaxjA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
