import React, { useCallback, useEffect, useState } from 'react';
import { Clapperboard, Film, MessageSquare, UserRound, Users } from 'lucide-react';
import { AdminStatusMessage } from './AdminStatusMessage';
import { getAdminOverview } from '../services/api';
import { AdminOverview } from '../types';

type LoadStatus = 'loading' | 'error' | 'ready';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

export const AdminOverviewSection: React.FC = () => {
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [overview, setOverview] = useState<AdminOverview | null>(null);

  const loadOverview = useCallback(() => {
    setStatus('loading');
    getAdminOverview()
      .then((loadedOverview) => {
        setOverview(loadedOverview);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  if (status === 'loading') return <AdminStatusMessage message="Carregando a visão geral..." />;
  if (status === 'error' || !overview) {
    return <AdminStatusMessage message="Não foi possível carregar a visão geral." onRetry={loadOverview} />;
  }

  const totals = [
    { label: 'Filmes', value: overview.totais.filmes, icon: Film },
    { label: 'Profissionais', value: overview.totais.profissionais, icon: Users },
    { label: 'Bastidores', value: overview.totais.bastidores, icon: Clapperboard },
    { label: 'Avaliações', value: overview.totais.avaliacoes, icon: MessageSquare },
    { label: 'Usuários', value: overview.totais.usuarios, icon: UserRound }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {totals.map((total) => {
          const Icon = total.icon;
          return (
            <div key={total.label} className="p-4 rounded-xl bg-brand-surface border border-brand-border">
              <Icon className="w-4 h-4 text-brand-accent mb-2" />
              <p className="text-2xl font-black font-display text-brand-text">{total.value}</p>
              <p className="text-xs text-brand-text-soft">{total.label}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl bg-brand-surface border border-brand-border p-4">
        <h3 className="text-sm font-bold font-display text-brand-text mb-3">Últimos filmes cadastrados</h3>
        {overview.ultimosFilmes.length === 0 ? (
          <p className="text-xs text-brand-text-soft">Nenhum filme cadastrado ainda.</p>
        ) : (
          <ul className="divide-y divide-brand-border">
            {overview.ultimosFilmes.map((movie) => (
              <li key={movie.id} className="py-2 flex items-center justify-between text-xs">
                <span className="text-brand-text">{movie.titulo}</span>
                <span className="font-mono text-brand-text-soft">{dateFormatter.format(new Date(movie.cadastradoEm))}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
