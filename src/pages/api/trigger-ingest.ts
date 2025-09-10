import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await supabaseAdmin.functions.invoke('eia-data-ingest');
    
    if (error) throw error;
    res.status(200).json({ message: 'Data ingestion triggered', result: data });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
