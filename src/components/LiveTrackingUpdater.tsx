import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const LiveTrackingUpdater = () => {
  useEffect(() => {
    // Update train locations every 5 seconds
    const updateInterval = setInterval(async () => {
      try {
        await supabase.functions.invoke('update-train-location');
      } catch (error) {
        console.error('Error updating train locations:', error);
      }
    }, 5000);

    return () => clearInterval(updateInterval);
  }, []);

  return null;
};

export default LiveTrackingUpdater;
