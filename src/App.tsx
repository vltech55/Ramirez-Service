import React from 'react';
import { LoadScript } from '@react-google-maps/api';
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';
import DistanceMatrix from './components/DistanceMatrix';
import NearbyList from './components/NearbyList';
import { sampleClients } from './data/sampleClients';
import { ClientRecord } from './types';
import { computeNearbyClients } from './utils/geo';

const libraries: Array<'places'> = ['places'];

export default function App() {
  const [clients] = React.useState<ClientRecord[]>(sampleClients);
  const [selectedId, setSelectedId] = React.useState<string | undefined>(clients[0]?.id);
  const [matrix, setMatrix] = React.useState<Record<string, Record<string, { distanceText: string; durationText: string; distanceMeters: number }>>>({});
  const [route, setRoute] = React.useState<google.maps.DirectionsResult | null>(null);
  const [googleReady, setGoogleReady] = React.useState(false);

  const selected = clients.find((c) => c.id === selectedId);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

  const computeMatrix = async (subset?: ClientRecord[]) => {
    const items = (subset ?? clients).filter((c) => c.location);
    if (items.length < 2 || !apiKey || !googleReady || typeof google === 'undefined') return;
    const svc = new google.maps.DistanceMatrixService();
    const origins = items.map((c) => c.location!);
    const destinations = items.map((c) => c.location!);
    const response = await svc.getDistanceMatrix({
      origins,
      destinations,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    const next: typeof matrix = {};
    response.rows.forEach((row, i) => {
      const originId = items[i].id;
      next[originId] = {};
      row.elements.forEach((el, j) => {
        const destId = items[j].id;
        if (el.status === 'OK' && el.distance && el.duration) {
          next[originId][destId] = {
            distanceText: el.distance.text,
            durationText: el.duration.text,
            distanceMeters: el.distance.value,
          };
        }
      });
    });
    setMatrix(next);
  };

  const handleOptimizeRoute = async (clientIds: string[]) => {
    if (clientIds.length < 2 || !apiKey) return;
    const points = clientIds.map((id) => clients.find((c) => c.id === id)!).filter((c) => c.location);
    if (points.length < 2) return;
    const origin = points[0].location!;
    const destination = points[points.length - 1].location!;
    const waypoints = points.slice(1, -1).map((c) => ({ location: c.location! }));
    const directions = new google.maps.DirectionsService();
    const result = await directions.route({
      origin,
      destination,
      waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true,
    });
    setRoute(result);
  };

  React.useEffect(() => {
    computeMatrix();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleReady]);

  const nearby = selected ? computeNearbyClients(selected, clients, 5) : [];

  return (
    <div className="app">
      <header>
        <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>Service Map</div>
          <div className="legend">
            <span><span className="swatch green"></span>Active</span>
            <span><span className="swatch orange"></span>Paused</span>
            <span><span className="swatch red"></span>Cancelled</span>
          </div>
        </div>
        <div>
          <span className="chip">Clients: {clients.length}</span>
        </div>
      </header>

      <Sidebar
        clients={clients}
        selectedClientId={selectedId}
        onSelectClient={(id) => setSelectedId(id)}
        onOptimizeRoute={handleOptimizeRoute}
      />

      <div className="map-pane">
        {apiKey ? (
          <LoadScript googleMapsApiKey={apiKey} libraries={libraries} loadingElement={<div style={{padding: 20}}>Loading map…</div>} onLoad={() => setGoogleReady(true)}>
            <MapView clients={clients} selectedClientId={selectedId} onSelectClient={setSelectedId} route={route} />
          </LoadScript>
        ) : (
          <div style={{ padding: 24 }}>
            <strong>Missing Google Maps API key.</strong> Add `VITE_GOOGLE_MAPS_API_KEY` to your `.env` file, then restart dev server.
          </div>
        )}

        <div style={{ position: 'absolute', right: 12, top: 64, width: 420, background: '#121a2b', border: '1px solid #1d2a44', borderRadius: 8, padding: 12, maxHeight: '80vh', overflow: 'auto' }}>
          <NearbyList selected={selected} items={nearby} onSelectClient={(id) => setSelectedId(id)} />
          <DistanceMatrix clients={clients} matrix={matrix} />
        </div>
      </div>
    </div>
  );
}


