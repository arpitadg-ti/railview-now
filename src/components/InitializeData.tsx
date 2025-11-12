import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Database, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const InitializeData = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [checking, setChecking] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkForData();
  }, []);

  const checkForData = async () => {
    try {
      const { data, error } = await supabase
        .from('trains')
        .select('id')
        .limit(1);

      if (error) throw error;
      setHasData((data && data.length > 0) || false);
    } catch (error) {
      console.error('Error checking data:', error);
    } finally {
      setChecking(false);
    }
  };

  const initializeData = async () => {
    setIsInitializing(true);
    try {
      const { error } = await supabase.functions.invoke('init-train-data');
      
      if (error) throw error;

      toast({
        title: "Success!",
        description: "Train data has been initialized. Please refresh the page."
      });
      
      setHasData(true);
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error('Error initializing data:', error);
      toast({
        title: "Initialization failed",
        description: "Please try again or check the console for errors",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  if (checking) {
    return null;
  }

  if (hasData) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="p-4 bg-primary/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <Database className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Initialize Train Data</h2>
        <p className="text-muted-foreground mb-6">
          The database is empty. Click below to load sample Indian Railway train data with routes and live tracking.
        </p>
        <Button 
          onClick={initializeData} 
          disabled={isInitializing}
          size="lg"
          className="w-full"
        >
          {isInitializing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initializing...
            </>
          ) : (
            'Initialize Train Data'
          )}
        </Button>
      </Card>
    </div>
  );
};

export default InitializeData;
