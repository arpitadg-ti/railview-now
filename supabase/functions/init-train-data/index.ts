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

    // Sample train data
    const trains = [
      {
        train_number: "12321",
        train_name: "Kolkata Mail",
        from_station: "Howrah Junction",
        to_station: "New Delhi",
        current_station: "Kanpur Central",
        next_station: "Aligarh Junction",
        current_lat: 26.4499,
        current_lng: 80.3319,
        delay_minutes: 15,
        status: "delayed"
      },
      {
        train_number: "12833",
        train_name: "Howrah Express",
        from_station: "Ahmedabad Junction",
        to_station: "Howrah Junction",
        current_station: "Raipur Junction",
        next_station: "Bilaspur Junction",
        current_lat: 21.2514,
        current_lng: 81.6296,
        delay_minutes: 0,
        status: "on-time"
      },
      {
        train_number: "12302",
        train_name: "Rajdhani Express",
        from_station: "New Delhi",
        to_station: "Howrah Junction",
        current_station: "Patna Junction",
        next_station: "Mokameh Junction",
        current_lat: 25.5941,
        current_lng: 85.1376,
        delay_minutes: 5,
        status: "delayed"
      },
      {
        train_number: "12246",
        train_name: "Duronto Express",
        from_station: "Howrah Junction",
        to_station: "Mumbai Central",
        current_station: "Nagpur Junction",
        next_station: "Bhusawal Junction",
        current_lat: 21.1458,
        current_lng: 79.0882,
        delay_minutes: 0,
        status: "on-time"
      },
      {
        train_number: "12951",
        train_name: "Mumbai Rajdhani",
        from_station: "Mumbai Central",
        to_station: "New Delhi",
        current_station: "Vadodara Junction",
        next_station: "Ratlam Junction",
        current_lat: 22.3072,
        current_lng: 73.1812,
        delay_minutes: 10,
        status: "delayed"
      }
    ];

    // Insert or update trains
    for (const train of trains) {
      const { data: existingTrain } = await supabase
        .from('trains')
        .select('id')
        .eq('train_number', train.train_number)
        .maybeSingle();

      if (existingTrain) {
        await supabase
          .from('trains')
          .update(train)
          .eq('train_number', train.train_number);
      } else {
        const { data: newTrain } = await supabase
          .from('trains')
          .insert(train)
          .select()
          .single();

        if (newTrain) {
          // Insert route stations based on train
          const routes: Record<string, any[]> = {
            "12321": [
              { station_name: "Howrah Junction", station_code: "HWH", arrival_time: null, departure_time: "06:35", distance_km: 0, platform: "9", sequence_number: 1 },
              { station_name: "Asansol Junction", station_code: "ASN", arrival_time: "08:50", departure_time: "08:55", distance_km: 213, platform: "3", sequence_number: 2 },
              { station_name: "Dhanbad Junction", station_code: "DHN", arrival_time: "10:10", departure_time: "10:15", distance_km: 326, platform: "2", sequence_number: 3 },
              { station_name: "Gaya Junction", station_code: "GAYA", arrival_time: "12:15", departure_time: "12:20", distance_km: 473, platform: "1", sequence_number: 4 },
              { station_name: "Mughalsarai Junction", station_code: "MGS", arrival_time: "14:30", departure_time: "14:40", distance_km: 602, platform: "5", sequence_number: 5 },
              { station_name: "Allahabad Junction", station_code: "ALD", arrival_time: "16:25", departure_time: "16:30", distance_km: 730, platform: "4", sequence_number: 6 },
              { station_name: "Kanpur Central", station_code: "CNB", arrival_time: "19:05", departure_time: "19:15", distance_km: 926, platform: "6", sequence_number: 7 },
              { station_name: "Aligarh Junction", station_code: "ALJN", arrival_time: "22:50", departure_time: "22:52", distance_km: 1170, platform: "2", sequence_number: 8 },
              { station_name: "New Delhi", station_code: "NDLS", arrival_time: "01:15", departure_time: null, distance_km: 1441, platform: "7", sequence_number: 9 }
            ],
            "12833": [
              { station_name: "Ahmedabad Junction", station_code: "ADI", arrival_time: null, departure_time: "19:50", distance_km: 0, platform: "5", sequence_number: 1 },
              { station_name: "Vadodara Junction", station_code: "BRC", arrival_time: "21:20", departure_time: "21:25", distance_km: 102, platform: "4", sequence_number: 2 },
              { station_name: "Surat", station_code: "ST", arrival_time: "23:10", departure_time: "23:15", distance_km: 264, platform: "2", sequence_number: 3 },
              { station_name: "Nagpur Junction", station_code: "NGP", arrival_time: "09:45", departure_time: "09:55", distance_km: 920, platform: "3", sequence_number: 4 },
              { station_name: "Raipur Junction", station_code: "R", arrival_time: "14:30", departure_time: "14:40", distance_km: 1210, platform: "1", sequence_number: 5 },
              { station_name: "Bilaspur Junction", station_code: "BSP", arrival_time: "16:35", departure_time: "16:45", distance_km: 1330, platform: "5", sequence_number: 6 },
              { station_name: "Jharsuguda Junction", station_code: "JSG", arrival_time: "20:05", departure_time: "20:10", distance_km: 1560, platform: "2", sequence_number: 7 },
              { station_name: "Rourkela Junction", station_code: "ROU", arrival_time: "21:20", departure_time: "21:25", distance_km: 1640, platform: "4", sequence_number: 8 },
              { station_name: "Howrah Junction", station_code: "HWH", arrival_time: "04:40", departure_time: null, distance_km: 2020, platform: "8", sequence_number: 9 }
            ],
            "12302": [
              { station_name: "New Delhi", station_code: "NDLS", arrival_time: null, departure_time: "16:55", distance_km: 0, platform: "2", sequence_number: 1 },
              { station_name: "Kanpur Central", station_code: "CNB", arrival_time: "21:35", departure_time: "21:40", distance_km: 441, platform: "3", sequence_number: 2 },
              { station_name: "Allahabad Junction", station_code: "ALD", arrival_time: "23:48", departure_time: "23:50", distance_km: 637, platform: "6", sequence_number: 3 },
              { station_name: "Mughalsarai Junction", station_code: "MGS", arrival_time: "01:50", departure_time: "01:55", distance_km: 765, platform: "2", sequence_number: 4 },
              { station_name: "Patna Junction", station_code: "PNBE", arrival_time: "05:45", departure_time: "05:50", distance_km: 997, platform: "5", sequence_number: 5 },
              { station_name: "Mokameh Junction", station_code: "MKA", arrival_time: "06:45", departure_time: "06:47", distance_km: 1080, platform: "1", sequence_number: 6 },
              { station_name: "Howrah Junction", station_code: "HWH", arrival_time: "10:15", departure_time: null, distance_km: 1441, platform: "12", sequence_number: 7 }
            ],
            "12246": [
              { station_name: "Howrah Junction", station_code: "HWH", arrival_time: null, departure_time: "14:00", distance_km: 0, platform: "14", sequence_number: 1 },
              { station_name: "Rourkela Junction", station_code: "ROU", arrival_time: "19:10", departure_time: "19:15", distance_km: 374, platform: "3", sequence_number: 2 },
              { station_name: "Jharsuguda Junction", station_code: "JSG", arrival_time: "20:25", departure_time: "20:27", distance_km: 454, platform: "2", sequence_number: 3 },
              { station_name: "Raipur Junction", station_code: "R", arrival_time: "00:05", departure_time: "00:10", distance_km: 810, platform: "4", sequence_number: 4 },
              { station_name: "Nagpur Junction", station_code: "NGP", arrival_time: "04:45", departure_time: "04:55", distance_km: 1110, platform: "6", sequence_number: 5 },
              { station_name: "Bhusawal Junction", station_code: "BSL", arrival_time: "09:00", departure_time: "09:05", distance_km: 1430, platform: "1", sequence_number: 6 },
              { station_name: "Mumbai Central", station_code: "BCT", arrival_time: "14:50", departure_time: null, distance_km: 1840, platform: "9", sequence_number: 7 }
            ],
            "12951": [
              { station_name: "Mumbai Central", station_code: "BCT", arrival_time: null, departure_time: "16:40", distance_km: 0, platform: "7", sequence_number: 1 },
              { station_name: "Surat", station_code: "ST", arrival_time: "20:20", departure_time: "20:25", distance_km: 263, platform: "5", sequence_number: 2 },
              { station_name: "Vadodara Junction", station_code: "BRC", arrival_time: "22:10", departure_time: "22:15", distance_km: 394, platform: "2", sequence_number: 3 },
              { station_name: "Ratlam Junction", station_code: "RTM", arrival_time: "01:30", departure_time: "01:35", distance_km: 656, platform: "4", sequence_number: 4 },
              { station_name: "Kota Junction", station_code: "KOTA", arrival_time: "04:40", departure_time: "04:45", distance_km: 905, platform: "3", sequence_number: 5 },
              { station_name: "Mathura Junction", station_code: "MTJ", arrival_time: "08:30", departure_time: "08:32", distance_km: 1252, platform: "6", sequence_number: 6 },
              { station_name: "New Delhi", station_code: "NDLS", arrival_time: "10:10", departure_time: null, distance_km: 1384, platform: "11", sequence_number: 7 }
            ]
          };

          const routeStations = routes[train.train_number] || [];
          for (const station of routeStations) {
            await supabase
              .from('route_stations')
              .insert({
                train_id: newTrain.id,
                ...station
              });
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ message: "Train data initialized successfully" }),
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
