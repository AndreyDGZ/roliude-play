import React, { useState } from 'react';
import {
  Film,
  Search,
  Heart,
  Compass,
  Clapperboard,
  Users,
  PlusCircle,
  MapPin,
  Menu,
  X,
  Sparkles,
  LayoutDashboard,
  LogIn,
  LogOut,
  UserRound
} from 'lucide-react';
import { Logo } from './Logo';
import { CordelPattern } from './CordelPattern';
import { AppTab, User } from '../types';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  favoritesCount: number;
  currentUser: User | null;
  isAdmin: boolean;
  onOpenAddModal: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  notificationBell: React.ReactNode;
}

interface NavItem {
  id: AppTab;
  label: string;
  icon: typeof Film;
  count?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  favoritesCount,
  currentUser,
  isAdmin,
  onOpenAddModal,
  onOpenAuthModal,
  onLogout,
  notificationBell
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'inicio', label: 'Início', icon: Film },
    { id: 'catalogo', label: 'Catálogo & Filtros', icon: Compass },
    { id: 'curadoria', label: 'Curadoria Local', icon: Sparkles },
    { id: 'bastidores', label: 'Bastidores & Direção', icon: Clapperboard },
    { id: 'profissionais', label: 'Profissionais', icon: Users },
    { id: 'favoritos', label: 'Minha Lista', icon: Heart, count: favoritesCount },
    ...(isAdmin ? [{ id: 'admin' as const, label: 'Painel Admin', icon: LayoutDashboard }] : [])
  ];

  const accountButton = currentUser ? (
    <div className="flex items-center gap-2">
      <span className="hidden xl:inline-flex items-center gap-1 text-xs text-brand-text-soft max-w-40 truncate">
        <UserRound className="w-3.5 h-3.5 text-brand-accent" />
        {currentUser.nome}
      </span>
      <button
        onClick={onLogout}
        aria-label="Sair da conta"
        title="Sair da conta"
        className="p-2 rounded-full bg-brand-surface hover:bg-brand-surface-raised text-brand-text-soft border border-brand-border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
      >
        <LogOut className="w-4 h-4 text-brand-accent" />
      </button>
    </div>
  ) : (
    <button
      onClick={onOpenAuthModal}
      className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-primary hover:bg-brand-accent text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
    >
      <LogIn className="w-3.5 h-3.5" />
      <span>Entrar</span>
    </button>
  );

  return (
    <header className="sticky top-0 z-40 bg-brand-bg/95 backdrop-blur-md border-b border-brand-surface-raised/80 shadow-2xl">
      <div className="bg-brand-surface border-b border-brand-border px-4 py-1 text-[11px] flex justify-between items-center text-brand-text-soft">
        <div className="flex items-center space-x-2">
          <MapPin className="w-3 h-3 text-brand-accent" />
          <span>Sede Cultural: <strong>Campina Grande & Cabaceiras, Paraíba</strong></span>
        </div>
        <div className="hidden sm:flex items-center space-x-3 text-brand-text-soft">
          <span>Acervo Histórico Regional</span>
          <span>•</span>
          <span className="text-brand-accent font-medium">O cinema da nossa terra na sua tela</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <div 
            onClick={() => setActiveTab('inicio')}
            className="cursor-pointer flex items-center transform transition hover:scale-[1.02]"
            title="Ir para o início do Rolliude Play"
          >
            <Logo size="md" showSlogan={false} />
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
              <input
                type="text"
                placeholder="Buscar filmes, diretores, atores, cidades (ex: Cabaceiras, Aruanda)..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-brand-surface border border-brand-border rounded-full text-sm text-brand-text placeholder-brand-text-muted focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-text-soft hover:text-white"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {notificationBell}
            <div className="hidden md:flex items-center">{accountButton}</div>
            <div className="hidden lg:flex items-center space-x-3">
              {isAdmin && (
                <button
                  onClick={onOpenAddModal}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-surface hover:bg-brand-surface-raised text-brand-text border border-brand-accent/40 hover:border-brand-accent transition shadow-sm"
                  title="Cadastrar nova obra ou carregar modelos de exemplo"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-brand-accent" />
                  <span>+ Nova Obra</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('favoritos')}
                className="relative p-2 rounded-full bg-brand-surface hover:bg-brand-surface-raised text-brand-text-soft border border-brand-border transition"
                title="Ver minha lista de filmes favoritos"
              >
                <Heart className="w-4 h-4 text-brand-accent" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {favoritesCount}
                  </span>
                )}
              </button>
            </div>

            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={() => setActiveTab('favoritos')}
                className="relative p-2 text-brand-text-soft"
              >
                <Heart className="w-5 h-5 text-brand-accent" />
                {favoritesCount > 0 && (
                  <span className="absolute top-0 right-0 bg-brand-accent text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-brand-text-soft hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-1 border-t border-brand-border py-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-primary text-white shadow-md font-semibold'
                    : 'text-brand-text-soft hover:text-white hover:bg-brand-surface-raised'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-brand-accent'}`} />
                <span>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-black/30 text-white' : 'bg-brand-accent text-white'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-bg border-b border-brand-border px-4 pt-3 pb-5 space-y-3">
          <div className="relative w-full mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
            <input
              type="text"
              placeholder="Buscar no catálogo..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-brand-surface border border-brand-border rounded-lg text-sm text-brand-text placeholder-brand-text-muted"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-brand-primary text-white font-semibold'
                      : 'text-brand-text-soft bg-brand-surface hover:bg-brand-surface-raised'
                  }`}
                >
                  <Icon className="w-4 h-4 text-brand-accent" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {isAdmin && (
            <button
              onClick={() => {
                onOpenAddModal();
                setMobileMenuOpen(false);
              }}
              className="w-full mt-2 flex items-center justify-center space-x-2 py-2 rounded-lg bg-brand-surface text-brand-text border border-brand-accent/40 text-xs font-medium"
            >
              <PlusCircle className="w-4 h-4 text-brand-accent" />
              <span>+ Cadastrar Obra no Catálogo</span>
            </button>
          )}

          <button
            onClick={() => {
              if (currentUser) {
                onLogout();
              } else {
                onOpenAuthModal();
              }
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center space-x-2 py-2 rounded-lg bg-brand-primary text-white text-xs font-semibold"
          >
            {currentUser ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>{currentUser ? `Sair (${currentUser.nome})` : 'Entrar ou criar conta'}</span>
          </button>
        </div>
      )}

      <CordelPattern className="border-t border-brand-border py-0.5" />
    </header>
  );
};
