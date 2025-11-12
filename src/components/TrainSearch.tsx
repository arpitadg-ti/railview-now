import { useState } from 'react';
import { Search, Train } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Train {
  id: string;
  train_number: string;
  train_name: string;
  from_station: string;
  to_station: string;
  current_station: string | null;
  status: string;
  delay_minutes: number;
}

const TrainSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Train[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Please enter a train name or number",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('trains')
        .select('*')
        .or(`train_number.ilike.%${searchQuery}%,train_name.ilike.%${searchQuery}%`);

      if (error) throw error;

      setSearchResults(data || []);
      
      if (!data || data.length === 0) {
        toast({
          title: "No trains found",
          description: "Try searching with a different train name or number"
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by train name or number (e.g., Rajdhani, 12302)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-3">
          {searchResults.map((train) => (
            <Card
              key={train.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/train/${train.train_number}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3 flex-1">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Train className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{train.train_name}</h3>
                      <Badge variant="outline">{train.train_number}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {train.from_station} → {train.to_station}
                    </p>
                    {train.current_station && (
                      <p className="text-sm font-medium mt-1">
                        Current: {train.current_station}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={train.status === 'on-time' ? 'default' : 'destructive'}
                    className={train.status === 'on-time' ? 'bg-success' : ''}
                  >
                    {train.status === 'on-time' ? 'On Time' : `Delayed ${train.delay_minutes}m`}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainSearch;
