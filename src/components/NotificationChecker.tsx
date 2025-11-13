import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function NotificationChecker() {
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const setupNotifications = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Subscribe to train updates for saved trains
      channel = supabase
        .channel('train-updates')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'trains'
          },
          async (payload) => {
            // Check if user has this train saved
            const { data: savedTrain } = await supabase
              .from('saved_trains')
              .select('*, trains(*)')
              .eq('user_id', session.user.id)
              .eq('train_id', payload.new.id)
              .eq('notification_enabled', true)
              .single();

            if (savedTrain) {
              const newData = payload.new as any;
              const oldData = payload.old as any;

              // Notify if delay increased
              if (newData.delay_minutes > oldData.delay_minutes && newData.delay_minutes > 0) {
                toast.error(
                  `${savedTrain.trains.train_name} is delayed by ${newData.delay_minutes} minutes`,
                  { duration: 10000 }
                );
              }

              // Notify if train reached destination (last few km)
              if (newData.current_station !== oldData.current_station) {
                toast.info(
                  `${savedTrain.trains.train_name} has reached ${newData.current_station}`,
                  { duration: 5000 }
                );
              }
            }
          }
        )
        .subscribe();
    };

    setupNotifications();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return null;
}
