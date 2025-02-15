import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ktiyqonppcirqnwhdwma.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0aXlxb25wcGNpcnFud2hkd21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMDM5MjEsImV4cCI6MjA0ODc3OTkyMX0.pxfHxTXZ3Hy1LfeRDE-pDQ9hY5smIqGdSRx-aOjgrX4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

