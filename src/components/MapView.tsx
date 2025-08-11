import React, { useMemo, useState } from 'react';
import { GoogleMap, MarkerF, InfoWindowF, MarkerClustererF, DirectionsRenderer } from '@react-google-maps/api';
import { ClientRecord } from '../types';
import { getStatusColor } from '../utils/geo';

const containerStyle: React.CSSProperties = { width: '100%', height: '100%' };

export interface MapViewProps {
  clients: ClientRecord[];
  selectedClientId?: string;
  onSelectClient?: (id: string | undefined) => void;
  route?: google.maps.DirectionsResult | null;
}

export default function MapView({ clients, selectedClientId, onSelectClient, route }: MapViewProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const selected = useMemo(() => clients.find((c) => c.id === selectedClientId), [clients, selectedClientId]);

  const center = useMemo(() => {
    const withLocations = clients.filter((c) => c.location);
    if (withLocations.length === 0) return { lat: 25.7617, lng: -80.1918 }; // Miami
    const { lat, lng } = withLocations[0].location!;
    return { lat, lng };
  }, [clients]);

  const onLoad = (m: google.maps.Map) => {
    setMap(m);
    const bounds = new google.maps.LatLngBounds();
    clients.forEach((c) => c.location && bounds.extend(c.location));
    if (!bounds.isEmpty()) m.fitBounds(bounds, 64);
  };

  return (
    <div className="map-container">
      <GoogleMap mapContainerStyle={containerStyle} zoom={11} center={center} onLoad={onLoad} options={{
        styles: undefined,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        backgroundColor: '#0b1220',
      }}>
        <MarkerClustererF>
          {(clusterer) => (
            <>
              {clients.filter((c) => c.location).map((client) => (
                <MarkerF
                  key={client.id}
                  clusterer={clusterer}
                  position={client.location!}
                  onClick={() => onSelectClient?.(client.id)}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: selectedClientId === client.id ? 10 : 7,
                    fillColor: getStatusColor(client.status),
                    fillOpacity: 1,
                    strokeWeight: 1,
                    strokeColor: '#0b1220',
                  }}
                />
              ))}
            </>
          )}
        </MarkerClustererF>

        {selected && selected.location && (
          <InfoWindowF position={selected.location} onCloseClick={() => onSelectClient?.(undefined)}>
            <div className="infowindow">
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{selected.name}</div>
              <div className={`status-badge status-${selected.status}`}>{selected.status}</div>
              <div style={{ marginTop: 6, fontSize: 12 }}>
                <div>{selected.address}</div>
                {selected.nextServiceDate && <div>Next: {selected.nextServiceDate}</div>}
                <div>Cost: ${selected.serviceCost.toFixed(2)}</div>
              </div>
            </div>
          </InfoWindowF>
        )}

        {route && <DirectionsRenderer directions={route} options={{ suppressMarkers: true }} />}
      </GoogleMap>
    </div>
  );
}


