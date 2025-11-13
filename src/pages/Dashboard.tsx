import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, LogOut, Train, Clock, MapPin, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { NavLink } from "@/components/NavLink";

interface SavedTrain {
  id: string;
  train_id: string;
  notification_enabled: boolean;
  trains: {
    train_number: string;
    train_name: string;
    from_station: string;
    to_station: string;
    current_station: string;
    next_station: string;
    delay_minutes: number;
    status: string;
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [savedTrains, setSavedTrains] = useState<SavedTrain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchProfile(session.user.id);
        fetchSavedTrains(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    
    setProfile(data);
  };

  const fetchSavedTrains = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("saved_trains")
      .select(`
        id,
        train_id,
        notification_enabled,
        trains (
          train_number,
          train_name,
          from_station,
          to_station,
          current_station,
          next_station,
          delay_minutes,
          status
        )
      `)
      .eq("user_id", userId);

    if (error) {
      toast.error("Failed to load saved trains");
    } else {
      setSavedTrains(data || []);
    }
    setLoading(false);
  };

  const toggleNotifications = async (savedTrainId: string, currentState: boolean) => {
    const { error } = await supabase
      .from("saved_trains")
      .update({ notification_enabled: !currentState })
      .eq("id", savedTrainId);

    if (error) {
      toast.error("Failed to update notification settings");
    } else {
      toast.success(`Notifications ${!currentState ? "enabled" : "disabled"}`);
      if (user) fetchSavedTrains(user.id);
    }
  };

  const removeTrain = async (savedTrainId: string) => {
    const { error } = await supabase
      .from("saved_trains")
      .delete()
      .eq("id", savedTrainId);

    if (error) {
      toast.error("Failed to remove train");
    } else {
      toast.success("Train removed from saved list");
      if (user) fetchSavedTrains(user.id);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Train className="h-12 w-12 animate-pulse text-railway-blue mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-railway-blue/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <NavLink to="/" className="flex items-center gap-2">
            <Train className="h-6 w-6 text-railway-blue" />
            <span className="font-bold text-xl">Railway Tracker</span>
          </NavLink>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {profile?.full_name || user?.email}
            </span>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
          <p className="text-muted-foreground">
            Track your saved trains and get delay notifications
          </p>
        </div>

        {/* Saved Trains */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Saved Trains</h2>
            <Button onClick={() => navigate("/")}>
              Browse All Trains
            </Button>
          </div>

          {savedTrains.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Train className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  You haven't saved any trains yet
                </p>
                <Button onClick={() => navigate("/")}>
                  Browse Trains
                </Button>
              </CardContent>
            </Card>
          ) : (
            savedTrains.map((saved) => (
              <Card key={saved.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {saved.trains.train_name}
                        <Badge variant={saved.trains.status === "on-time" ? "default" : "destructive"}>
                          {saved.trains.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Train #{saved.trains.train_number}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleNotifications(saved.id, saved.notification_enabled)}
                      >
                        {saved.notification_enabled ? (
                          <Bell className="h-4 w-4" />
                        ) : (
                          <BellOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTrain(saved.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">From</p>
                      <p className="font-medium">{saved.trains.from_station}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">To</p>
                      <p className="font-medium">{saved.trains.to_station}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Current: {saved.trains.current_station}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Next: {saved.trains.next_station}</span>
                    </div>
                  </div>

                  {saved.trains.delay_minutes > 0 && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Delayed by {saved.trains.delay_minutes} minutes</span>
                    </div>
                  )}

                  <Button
                    onClick={() => navigate(`/train/${saved.trains.train_number}`)}
                    variant="outline"
                    className="w-full"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
