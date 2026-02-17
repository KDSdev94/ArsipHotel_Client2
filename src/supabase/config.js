import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hasowjueyxcxlocfhtkm.supabase.co';
const supabaseKey = 'sb_publishable_Ezg2DaW25NPOXM2IFS6ISg_g6mNDVDW';

export const supabase = createClient(supabaseUrl, supabaseKey);
