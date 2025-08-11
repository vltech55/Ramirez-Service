import React from 'react';
import { ClientRecord } from '../types';

export interface SidebarProps {
  clients: ClientRecord[];
  selectedClientId?: string;
  onSelectClient: (id: string | undefined) => void;
  onOptimizeRoute: (clientIds: string[]) => void;
}

export default function Sidebar({ clients, selectedClientId, onSelectClient, onOptimizeRoute }: SidebarProps) {
  const [query, setQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'All' | ClientRecord['status']>('All');
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const filtered = clients.filter((c) => {
    const matchesQuery = query.trim().length === 0 || c.name.toLowerCase().includes(query.toLowerCase()) || c.address.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const optimizeDisabled = selectedIds.length < 2;

  return (
    <aside className="sidebar">
      <div className="section">
        <div className="controls">
          <input placeholder="Search name or address" value={query} onChange={(e) => setQuery(e.target.value)} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Clients ({filtered.length})</h3>
        <button className="primary" disabled={optimizeDisabled} onClick={() => onOptimizeRoute(selectedIds)}>Optimize Route</button>
      </div>

      <div style={{ display: 'grid', gap: 6 }}>
        {filtered.map((c) => (
          <div key={c.id} className="client-row" onClick={() => onSelectClient(c.id)} style={{ background: selectedClientId === c.id ? '#18243e' : undefined }}>
            <div style={{ display: 'grid', gap: 4 }}>
              <div style={{ fontWeight: 600, lineHeight: 1 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: '#8aa0bf' }}>{c.address}</div>
              <div className={`status-badge status-${c.status}`} style={{ width: 'fit-content' }}>{c.status}</div>
            </div>
            <div style={{ display: 'grid', gap: 6, justifyItems: 'end' }} onClick={(e) => e.stopPropagation()}>
              <input type="checkbox" checked={selectedIds.includes(c.id)} onChange={() => toggleSelect(c.id)} />
              <div className="chip">${c.serviceCost.toFixed(2)}</div>
              {c.nextServiceDate && <div className="chip">Next {c.nextServiceDate}</div>}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}


