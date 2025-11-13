import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Navigation, Train as TrainIcon, Heart, HeartOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import TrainMap from '@/components/TrainMap';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';

interface Train {
  id: string;
  train_number: string;
  train_name: string;
  from_station: string;
  to_station: string;
  current_station: string | null;
  next_station: string | null;
  current_lat: number;
  current_lng: number;
  delay_minutes: number;
  status: string;
}

interface RouteStation {
  id: string;
  station_name: string;
  station_code: string;
  arrival_time: string | null;
  departure_time: string | null;
  distance_km: number;
  platform: string;
  sequence_number: number;
}

const TrainDetail = () => {
  const { trainNo } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [train, setTrain] = useState<Train | null>(null);
  const [route, setRoute] = useState<RouteStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savedTrainId, setSavedTrainId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchTrainDetails = async () => {
      try {
        // Fetch train data
        const { data: trainData, error: trainError } = await supabase
          .from('trains')
          .select('*')
          .eq('train_number', trainNo)
          .single();

        if (trainError) throw trainError;
        setTrain(trainData);

        // Fetch route stations
        const { data: routeData, error: routeError } = await supabase
          .from('route_stations')
          .select('*')
          .eq('train_id', trainData.id)
          .order('sequence_number');

        if (routeError) throw routeError;
        setRoute(routeData || []);

        // Check if train is saved by current user
        if (user) {
          const { data: savedData } = await supabase
            .from('saved_trains')
            .select('id')
            .eq('user_id', user.id)
            .eq('train_id', trainData.id)
            .single();
          
          if (savedData) {
            setIsSaved(true);
            setSavedTrainId(savedData.id);
          }
        }

      } catch (error) {
        console.error('Error fetching train details:', error);
        toast({
          title: "Failed to load train details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (trainNo) {
      fetchTrainDetails();
    }

    // Subscribe to real-time updates
    const channel = supabase
      .channel('train-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'trains',
          filter: `train_number=eq.${trainNo}`
        },
        (payload) => {
          setTrain(payload.new as Train);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [trainNo, toast, user]);

  const handleToggleSave = async () => {
    if (!user) {
      sonnerToast.error("Please sign in to save trains");
      navigate("/auth");
      return;
    }

    if (!train) return;

    try {
      if (isSaved && savedTrainId) {
        // Remove from saved
        const { error } = await supabase
          .from('saved_trains')
          .delete()
          .eq('id', savedTrainId);

        if (error) throw error;
        setIsSaved(false);
        setSavedTrainId(null);
        sonnerToast.success("Train removed from saved list");
      } else {
        // Add to saved
        const { data, error } = await supabase
          .from('saved_trains')
          .insert({
            user_id: user.id,
            train_id: train.id,
            notification_enabled: true
          })
          .select()
          .single();

        if (error) throw error;
        setIsSaved(true);
        setSavedTrainId(data.id);
        sonnerToast.success("Train saved! You'll receive delay notifications.");
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      sonnerToast.error("Failed to update saved trains");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-center">
          <TrainIcon className="h-12 w-12 mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading train details...</p>
        </div>
      </div>
    );
  }

  if (!train) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Train not found</h2>
          <p className="text-muted-foreground mb-4">The train you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>

        {/* Train Header */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{train.train_name}</h1>
                <Badge variant="outline" className="text-lg">{train.train_number}</Badge>
              </div>
              <p className="text-lg text-muted-foreground">
                {train.from_station} → {train.to_station}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge 
                variant={train.status === 'on-time' ? 'default' : 'destructive'}
                className={`text-lg px-4 py-2 ${train.status === 'on-time' ? 'bg-success' : ''}`}
              >
                {train.status === 'on-time' ? 'On Time' : `Delayed ${train.delay_minutes}m`}
              </Badge>
              <Button
                variant={isSaved ? "default" : "outline"}
                size="lg"
                onClick={handleToggleSave}
              >
                {isSaved ? <Heart className="h-5 w-5 mr-2 fill-current" /> : <HeartOff className="h-5 w-5 mr-2" />}
                {isSaved ? "Saved" : "Save Train"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Current Station</p>
                <p className="font-semibold">{train.current_station || 'Unknown'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Navigation className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Next Station</p>
                <p className="font-semibold">{train.next_station || 'Unknown'}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Live Map */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Live Location
          </h2>
          <TrainMap
            currentLat={train.current_lat}
            currentLng={train.current_lng}
            trainName={train.train_name}
            route={route}
          />
        </Card>

        {/* Route Timeline */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Route & Schedule
          </h2>
          <div className="space-y-4">
            {route.map((station, index) => (
              <div key={station.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    station.station_name === train.current_station 
                      ? 'bg-accent border-accent' 
                      : 'bg-primary border-primary'
                  }`} />
                  {index < route.length - 1 && (
                    <div className="w-0.5 h-16 bg-border" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{station.station_name}</h3>
                      <p className="text-sm text-muted-foreground">{station.station_code}</p>
                    </div>
                    {station.station_name === train.current_station && (
                      <Badge variant="default" className="bg-accent">Current</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {station.arrival_time && (
                      <div>
                        <p className="text-muted-foreground">Arrival</p>
                        <p className="font-medium">{station.arrival_time}</p>
                      </div>
                    )}
                    {station.departure_time && (
                      <div>
                        <p className="text-muted-foreground">Departure</p>
                        <p className="font-medium">{station.departure_time}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground">Distance</p>
                      <p className="font-medium">{station.distance_km} km</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Platform</p>
                      <p className="font-medium">{station.platform}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TrainDetail;
