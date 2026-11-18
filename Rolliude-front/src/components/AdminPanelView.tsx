import React, { useState } from 'react';
import { Clapperboard, Film, LayoutDashboard, MessageSquare, ShieldCheck, UserRound, Users } from 'lucide-react';
import { AdminOverviewSection } from './AdminOverviewSection';
import { AdminMoviesSection } from './AdminMoviesSection';
import { AdminProfessionalsSection } from './AdminProfessionalsSection';
import { AdminBehindTheScenesSection } from './AdminBehindTheScenesSection';
import { AdminReviewsSection } from './AdminReviewsSection';
import { AdminUsersSection } from './AdminUsersSection';
import { BehindTheScenesPayload, ProfessionalPayload } from '../services/api';
import { BehindTheScenesItem, Movie, Professional, User } from '../types';

type AdminSection = 'visao-geral' | 'filmes' | 'profissionais' | 'bastidores' | 'avaliacoes' | 'usuarios';

interface AdminPanelViewProps {
  currentUser: User;
  movies: Movie[];
  professionals: Professional[];
  btsItems: BehindTheScenesItem[];
  onCreateMovie: () => void;
  onEditMovie: (movie: Movie) => void;
  onToggleMovieHighlight: (movie: Movie) => Promise<void>;
  onDeleteMovie: (movieId: string) => Promise<void>;
  onCreateProfessional: (payload: ProfessionalPayload) => Promise<void>;
  onUpdateProfessional: (professionalId: string, payload: ProfessionalPayload) => Promise<void>;
  onDeleteProfessional: (professionalId: string) => Promise<void>;
  onCreateBtsItem: (payload: BehindTheScenesPayload) => Promise<void>;
  onUpdateBtsItem: (itemId: string, payload: BehindTheScenesPayload) => Promise<void>;
  onDeleteBtsItem: (itemId: string) => Promise<void>;
  onReviewRemoved: (movieId: string) => void;
}

const SECTIONS = [
  { id: 'visao-geral', label: 'Visão geral', icon: LayoutDashboard },
  { id: 'filmes', label: 'Filmes', icon: Film },
  { id: 'profissionais', label: 'Profissionais', icon: Users },
  { id: 'bastidores', label: 'Bastidores', icon: Clapperboard },
  { id: 'avaliacoes', label: 'Avaliações', icon: MessageSquare },
  { id: 'usuarios', label: 'Usuários', icon: UserRound }
] as const;

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  currentUser,
  movies,
  professionals,
  btsItems,
  onCreateMovie,
  onEditMovie,
  onToggleMovieHighlight,
  onDeleteMovie,
  onCreateProfessional,
  onUpdateProfessional,
  onDeleteProfessional,
  onCreateBtsItem,
  onUpdateBtsItem,
  onDeleteBtsItem,
  onReviewRemoved
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('visao-geral');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-7 h-7 text-brand-accent" />
        <div>
          <h1 className="text-2xl font-black font-display text-brand-text">Painel Administrativo</h1>
          <p className="text-xs text-brand-text-soft">Olá, {currentUser.nome}. Gerencie o acervo, a comunidade e os acessos.</p>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Seções do painel administrativo">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                isActive ? 'bg-brand-primary text-white' : 'bg-brand-surface text-brand-text-soft hover:bg-brand-surface-raised'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{section.label}</span>
            </button>
          );
        })}
      </nav>

      {activeSection === 'visao-geral' && <AdminOverviewSection />}

      {activeSection === 'filmes' && (
        <AdminMoviesSection
          movies={movies}
          onCreateMovie={onCreateMovie}
          onEditMovie={onEditMovie}
          onToggleHighlight={onToggleMovieHighlight}
          onDeleteMovie={onDeleteMovie}
        />
      )}

      {activeSection === 'profissionais' && (
        <AdminProfessionalsSection
          professionals={professionals}
          onCreateProfessional={onCreateProfessional}
          onUpdateProfessional={onUpdateProfessional}
          onDeleteProfessional={onDeleteProfessional}
        />
      )}

      {activeSection === 'bastidores' && (
        <AdminBehindTheScenesSection
          items={btsItems}
          movies={movies}
          onCreateItem={onCreateBtsItem}
          onUpdateItem={onUpdateBtsItem}
          onDeleteItem={onDeleteBtsItem}
        />
      )}

      {activeSection === 'avaliacoes' && <AdminReviewsSection onReviewRemoved={onReviewRemoved} />}

      {activeSection === 'usuarios' && <AdminUsersSection currentUserId={currentUser.id} />}
    </div>
  );
};
