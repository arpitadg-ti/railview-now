import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all trains
    const { data: trains, error } = await supabase
      .from('trains')
      .select('*');

    if (error) throw error;

    // Update each train's location slightly to simulate movement
    for (const train of trains || []) {
      // Simulate movement: small random changes to lat/lng
      const latChange = (Math.random() - 0.5) * 0.01; // Small change
      const lngChange = (Math.random() - 0.5) * 0.01;
      
      const newLat = train.current_lat + latChange;
      const newLng = train.current_lng + lngChange;

      // Randomly update delay (simulate real-time changes)
      let newDelay = train.delay_minutes;
      if (Math.random() > 0.7) {
        newDelay = Math.max(0, newDelay + (Math.random() > 0.5 ? 1 : -1));
      }

      await supabase
        .from('trains')
        .update({
          current_lat: newLat,
          current_lng: newLng,
          delay_minutes: newDelay,
          status: newDelay > 0 ? 'delayed' : 'on-time'
        })
        .eq('id', train.id);
    }

    return new Response(
      JSON.stringify({ 
        message: "Train locations updated successfully",
        updated_count: trains?.length || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
