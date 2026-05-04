// ============================================================
// ALGOLEAP LMS — Supabase Configuration
// Replace the values below with your actual Supabase credentials
// Found at: Supabase Dashboard → Project Settings → API
// ============================================================

const SUPABASE_URL = 'https://uftlmjfhljgqgixdioyh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_lv0olLAB_WMEToTLnuw8FQ_UFrD3M9H';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
