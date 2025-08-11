import React from 'react';
import { ClientRecord } from '../types';

export interface NearbyItem {
  client: ClientRecord;
  distanceMeters: number;
}

export interface NearbyListProps {
  selected?: ClientRecord;
  items: NearbyItem[];
  onSelectClient: (id: string) => void;
}

function formatMeters(m: number): string {
  if (m >= 1000) return `${(m / 1000).toFixed(1)} km`;
  return `${Math.round(m)} m`;
}

export default function NearbyList({ selected, items, onSelectClient }: NearbyListProps) {
  if (!selected) return null;
  return (
    <div className="section">
      <h3>Nearby {selected.name}</h3>
      <div style={{ display: 'grid', gap: 6 }}>
        {items.map(({ client, distanceMeters }) => (
          <div key={client.id} className="client-row" onClick={() => onSelectClient(client.id)}>
            <div style={{ display: 'grid' }}>
              <div style={{ fontWeight: 600 }}>{client.name}</div>
              <div style={{ fontSize: 12, color: '#8aa0bf' }}>{client.address}</div>
            </div>
            <div className="chip">{formatMeters(distanceMeters)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


