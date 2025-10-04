'use client';

import { useState, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const sampleLocations = [
  { id: '1', name: 'Urban Loft', position: { lat: 40.748817, lng: -73.985428 } },
  { id: '2', name: 'Forest Clearing', position: { lat: 34.052235, lng: -118.243683 } },
  { id: '3', name: 'Downtown Cafe', position: { lat: 41.878113, lng: -87.629799 } },
  { id: '4', name: 'Suburban House', position: { lat: 34.1288, lng: -118.4451 } },
  { id: '5', name: 'Abandoned Warehouse', position: { lat: 40.7128, lng: -74.0060 } },
];

export default function LocationScoutingPage() {
  const [selectedLocation, setSelectedLocation] = useState<typeof sampleLocations[0] | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  const center = useMemo(() => ({
    lat: 40.7128,
    lng: -74.0060
  }), []);

  const handleMarkerClick = (location: typeof sampleLocations[0]) => {
    setSelectedLocation(location);
  };
  
  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Location Scouting</h1>
        <p className="text-muted-foreground">
          Manage and visualize potential filming locations.
        </p>
      </div>

      <Card className="h-[600px]">
        <CardContent className="p-0 h-full">
          {loadError && (
              <div className="flex items-center justify-center h-full">
                <p className="text-destructive-foreground">Error loading maps. Please check your API key.</p>
              </div>
          )}
          {!isLoaded && !loadError && (
              <Skeleton className="w-full h-full" />
          )}
          {isLoaded && !loadError && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
              options={mapOptions}
            >
              {sampleLocations.map(location => (
                <Marker
                  key={location.id}
                  position={location.position}
                  onClick={() => handleMarkerClick(location)}
                />
              ))}

              {selectedLocation && (
                <InfoWindow
                  position={selectedLocation.position}
                  onCloseClick={() => setSelectedLocation(null)}
                >
                  <div>
                    <h4 className="font-bold">{selectedLocation.name}</h4>
                    <p>Lat: {selectedLocation.position.lat}, Lng: {selectedLocation.position.lng}</p>
                    <Button variant="link" className="p-0 h-auto" asChild>
                      <Link href="/dashboard/legal">Generate Contract</Link>
                    </Button>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )}
        </CardContent>
      </Card>
      
       <div className="mt-8">
          <Link href="/dashboard/pre-production">
            <Button variant="outline">Back to Pre-Production Hub</Button>
          </Link>
        </div>
    </div>
  );
}
