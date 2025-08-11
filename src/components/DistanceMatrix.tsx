import React from 'react';
import { ClientRecord } from '../types';

export interface DistanceCell {
  distanceText: string;
  durationText: string;
  distanceMeters: number;
}

export interface DistanceMatrixProps {
  clients: ClientRecord[];
  matrix: Record<string, Record<string, DistanceCell>>; // originId -> destinationId -> cell
}

export default function DistanceMatrix({ clients, matrix }: DistanceMatrixProps) {
  if (clients.length === 0) return null;

  const shortestByRow: Record<string, number> = {};
  for (const origin of clients) {
    const row = matrix[origin.id] || {};
    let min = Number.POSITIVE_INFINITY;
    for (const dest of clients) {
      if (origin.id === dest.id) continue;
      const cell = row[dest.id];
      if (cell && cell.distanceMeters < min) min = cell.distanceMeters;
    }
    shortestByRow[origin.id] = min;
  }

  return (
    <div className="section">
      <h3>Distance Matrix</h3>
      <div style={{ overflow: 'auto', maxHeight: 320 }}>
        <table className="table">
          <thead>
            <tr>
              <th>From \ To</th>
              {clients.map((c) => (
                <th key={c.id}>{c.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.map((origin) => (
              <tr key={origin.id}>
                <td style={{ position: 'sticky', left: 0, background: '#121a2b' }}>{origin.name}</td>
                {clients.map((dest) => {
                  if (origin.id === dest.id) return <td key={dest.id} style={{ color: '#8aa0bf' }}>—</td>;
                  const cell = matrix[origin.id]?.[dest.id];
                  const isShortest = cell && cell.distanceMeters === shortestByRow[origin.id];
                  return (
                    <td key={dest.id} style={{ background: isShortest ? 'rgba(29,185,84,0.1)' : undefined }}>
                      {cell ? (
                        <span title={`${cell.durationText}`}>{cell.distanceText}</span>
                      ) : (
                        '…'
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


