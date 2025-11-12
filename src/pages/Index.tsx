import { Train, Clock, MapPin } from "lucide-react";
import TrainSearch from "@/components/TrainSearch";
import InitializeData from "@/components/InitializeData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  const { data: trains, isLoading } = useQuery({
    queryKey: ['trains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trains')
        .select('*')
        .order('train_number');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <>
      <InitializeData />
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
              <Train className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Live Train Tracking System
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8">
            Track any Indian Railway train in real-time with accurate location and schedule information
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 -mt-8">
        <TrainSearch />
      </div>

      {/* Available Trains Section */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">Available Trains</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-24 bg-muted"></CardHeader>
                <CardContent className="h-32 bg-muted/50"></CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trains?.map((train) => (
              <Card 
                key={train.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow border-border/50"
                onClick={() => navigate(`/train/${train.train_number}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{train.train_name}</span>
                    <Badge variant={train.status === 'on-time' ? 'default' : 'destructive'}>
                      {train.status === 'on-time' ? 'On Time' : `Delayed ${train.delay_minutes}m`}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground font-mono">{train.train_number}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                    <div>
                      <p className="font-medium">{train.from_station}</p>
                      <p className="text-muted-foreground">to {train.to_station}</p>
                    </div>
                  </div>
                  {train.current_station && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <p>Currently at: <span className="font-medium text-foreground">{train.current_station}</span></p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl border-t">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Train className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Real-Time Tracking</h3>
            <p className="text-muted-foreground">
              Get live location updates of your train every 5 seconds
            </p>
          </div>
          <div className="text-center p-6">
            <div className="p-3 bg-accent/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Accurate Routes</h3>
            <p className="text-muted-foreground">
              Complete station-by-station journey information with timings
            </p>
          </div>
          <div className="text-center p-6">
            <div className="p-3 bg-success/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Delay Information</h3>
            <p className="text-muted-foreground">
              Stay informed about train delays and current status
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Index;
