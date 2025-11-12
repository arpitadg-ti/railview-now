import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Train } from 'lucide-react';

interface TrainMapProps {
  currentLat: number;
  currentLng: number;
  trainName: string;
  route?: Array<{
    station_name: string;
    station_code: string;
    sequence_number: number;
  }>;
}

const TrainMap = ({ currentLat, currentLng, trainName, route }: TrainMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainer.current).setView([currentLat, currentLng], 8);
    mapRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Create custom train icon
    const trainIcon = L.divIcon({
      html: `
        <div class="flex items-center justify-center w-10 h-10 bg-accent rounded-full border-4 border-white shadow-lg animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="16" height="16" x="4" y="3" rx="2"/>
            <path d="M4 11h16"/>
            <path d="M12 3v8"/>
            <path d="m8 19-2 3"/>
            <path d="m18 22-2-3"/>
            <path d="M8 15h0"/>
            <path d="M16 15h0"/>
          </svg>
        </div>
      `,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    // Add train marker
    const marker = L.marker([currentLat, currentLng], { icon: trainIcon })
      .addTo(map)
      .bindPopup(`<strong>${trainName}</strong><br/>Live Location`);
    
    markerRef.current = marker;

    // Add route stations if available
    if (route && route.length > 0) {
      const stationIcon = L.divIcon({
        html: `
          <div class="w-3 h-3 bg-primary rounded-full border-2 border-white shadow-md"></div>
        `,
        className: '',
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });

      route.forEach((station) => {
        // For demo, create approximate coordinates along the route
        const latOffset = (station.sequence_number - 1) * 0.5;
        const lngOffset = (station.sequence_number - 1) * 0.3;
        
        L.marker([currentLat + latOffset, currentLng + lngOffset], { icon: stationIcon })
          .addTo(map)
          .bindPopup(`<strong>${station.station_name}</strong><br/>${station.station_code}`);
      });
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update marker position when coordinates change
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng([currentLat, currentLng]);
      mapRef.current?.panTo([currentLat, currentLng]);
    }
  }, [currentLat, currentLng]);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-4 left-4 bg-background/95 backdrop-blur px-4 py-2 rounded-lg shadow-md border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-sm font-medium">Live Tracking</span>
        </div>
      </div>
    </div>
  );
};

export default TrainMap;
