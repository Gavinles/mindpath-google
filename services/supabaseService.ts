
import { createClient } from '@supabase/supabase-js';

// The URL is usually inferred from the project reference in the key or provided separately.
// Since only the key was provided, we use a placeholder for the URL which the user would typically replace,
// or we use the key to initialize the client where applicable.
const SUPABASE_URL = 'https://project-id.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_rMDNFn5HgZoC-bla_qvoKQ_valnM0AF';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const saveMessage = async (role: string, text: string, type: string = 'text') => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ role, content: text, type, created_at: new Date() }]);
    return { data, error };
  } catch (e) {
    console.warn("Supabase persistence failed: Check table 'messages' exists.", e);
  }
};

export const saveAsset = async (url: string, prompt: string, type: 'image' | 'video') => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .insert([{ url, prompt, type, created_at: new Date() }]);
    return { data, error };
  } catch (e) {
    console.warn("Supabase persistence failed: Check table 'assets' exists.", e);
  }
};

export const fetchHistory = async (type: 'messages' | 'assets') => {
  try {
    const { data, error } = await supabase
      .from(type)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    return data || [];
  } catch (e) {
    return [];
  }
};
