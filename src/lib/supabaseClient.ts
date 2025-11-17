import { createClient } from '@supabase/supabase-js'

// Use hardcoded values for client-side; Docusaurus doesn't expose process.env to browser
const supabaseUrl = 'https://kpyasaicyxmosvwuspcx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtweWFzYWljeXhtb3N2d3VzcGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyODEzNTUsImV4cCI6MjA3ODg1NzM1NX0.FVUPwRp1FJw1620eIJl0wphrEI9riRHA1JxKriiEcgs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
