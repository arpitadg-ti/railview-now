-- Create trains table
CREATE TABLE public.trains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  train_number TEXT NOT NULL UNIQUE,
  train_name TEXT NOT NULL,
  from_station TEXT NOT NULL,
  to_station TEXT NOT NULL,
  current_station TEXT,
  next_station TEXT,
  current_lat DECIMAL(10, 8),
  current_lng DECIMAL(11, 8),
  delay_minutes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'on-time',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create route_stations table
CREATE TABLE public.route_stations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  train_id UUID NOT NULL REFERENCES public.trains(id) ON DELETE CASCADE,
  station_name TEXT NOT NULL,
  station_code TEXT NOT NULL,
  arrival_time TEXT,
  departure_time TEXT,
  distance_km INTEGER,
  platform TEXT,
  halt_minutes INTEGER DEFAULT 0,
  sequence_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.trains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_stations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (trains are public data)
CREATE POLICY "Trains are publicly readable"
ON public.trains
FOR SELECT
USING (true);

CREATE POLICY "Route stations are publicly readable"
ON public.route_stations
FOR SELECT
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_trains_number ON public.trains(train_number);
CREATE INDEX idx_trains_name ON public.trains(train_name);
CREATE INDEX idx_route_stations_train_id ON public.route_stations(train_id);
CREATE INDEX idx_route_stations_sequence ON public.route_stations(train_id, sequence_number);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_trains_updated_at
BEFORE UPDATE ON public.trains
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for live tracking
ALTER PUBLICATION supabase_realtime ADD TABLE public.trains;