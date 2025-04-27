// import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { Platform } from 'react-native';
// import { SUPABASE_AON_KEY } from '@env';

const SUPABASE_AON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0aXlxb25wcGNpcnFud2hkd21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMDM5MjEsImV4cCI6MjA0ODc3OTkyMX0.pxfHxTXZ3Hy1LfeRDE-pDQ9hY5smIqGdSRx-aOjgrX4'
const supabaseUrl = 'https://ktiyqonppcirqnwhdwma.supabase.co'

let AsyncStorage;
if (Platform.OS !== 'web') {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
}

export const supabase = createClient(supabaseUrl, SUPABASE_AON_KEY, {
  auth: {
    ...(Platform.OS !== 'web'
      ? {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      }
      : {
        // Web-safe auth config (e.g., use localStorage automatically)
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      }),
  },
})

