import { createClient } from '@supabase/supabase-js'

// Prefer env vars at build time; fall back to provided project values for GH Pages.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://kpyasaicyxmosvwuspcx.supabase.co'

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtweWFzYWljeXhtb3N2d3VzcGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyODEzNTUsImV4cCI6MjA3ODg1NzM1NX0.FVUPwRp1FJw1620eIJl0wphrEI9riRHA1JxKriiEcgs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


