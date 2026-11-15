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
  Sparkles
} from 'lucide-react';
import { Logo } from './Logo';
import { CordelPattern } from './CordelPattern';

interface HeaderProps {
  activeTab: 'inicio' | 'catalogo' | 'curadoria' | 'bastidores' | 'profissionais' | 'favoritos';
  setActiveTab: (tab: 'inicio' | 'catalogo' | 'curadoria' | 'bastidores' | 'profissionais' | 'favoritos') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  favoritesCount: number;
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  favoritesCount,
  onOpenAddModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'inicio', label: 'Início', icon: Film },
    { id: 'catalogo', label: 'Catálogo & Filtros', icon: Compass },
    { id: 'curadoria', label: 'Curadoria Local', icon: Sparkles },
    { id: 'bastidores', label: 'Bastidores & Direção', icon: Clapperboard },
    { id: 'profissionais', label: 'Profissionais', icon: Users },
    { id: 'favoritos', label: 'Minha Lista', icon: Heart, count: favoritesCount },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-[#160E0A]/95 backdrop-blur-md border-b border-[#3E2114]/80 shadow-2xl">
      {/* Top micro bar with cultural reference */}
      <div className="bg-[#24130A] border-b border-[#3A1E11] px-4 py-1 text-[11px] flex justify-between items-center text-[#E5C9A4]">
        <div className="flex items-center space-x-2">
          <MapPin className="w-3 h-3 text-[#EA580C]" />
          <span>Sede Cultural: <strong>Campina Grande & Cabaceiras — Paraíba</strong></span>
        </div>
        <div className="hidden sm:flex items-center space-x-3 text-[#C89D77]">
          <span>Acervo Histórico Regional</span>
          <span>•</span>
          <span className="text-[#F97316] font-medium">O cinema da nossa terra na sua tela</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div 
            onClick={() => setActiveTab('inicio')}
            className="cursor-pointer flex items-center transform transition hover:scale-[1.02]"
            title="Ir para o início do Rolliude Play"
          >
            <Logo size="md" showSlogan={false} />
          </div>

          {/* Search Bar central */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A87B57]" />
              <input
                type="text"
                placeholder="Buscar filmes, diretores, atores, cidades (ex: Cabaceiras, Aruanda)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#23140C] border border-[#4D2716] rounded-full text-sm text-[#F7EFE6] placeholder-[#8F6647] focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#C89D77] hover:text-white"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Action buttons Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#2A160E] hover:bg-[#3D1E12] text-[#FBD0A4] border border-[#EA580C]/40 hover:border-[#EA580C] transition shadow-sm"
              title="Cadastrar nova obra ou carregar modelos de exemplo"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>+ Nova Obra</span>
            </button>

            <button
              onClick={() => setActiveTab('favoritos')}
              className="relative p-2 rounded-full bg-[#23140C] hover:bg-[#351C10] text-[#E5C9A4] border border-[#482515] transition"
              title="Ver minha lista de filmes favoritos"
            >
              <Heart className="w-4 h-4 text-[#EA580C]" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#EA580C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setActiveTab('favoritos')}
              className="relative p-2 text-[#E5C9A4]"
            >
              <Heart className="w-5 h-5 text-[#EA580C]" />
              {favoritesCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#EA580C] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#E5C9A4] hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Navigation tabs row */}
        <nav className="hidden md:flex items-center space-x-1 border-t border-[#311A0E] py-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  isActive
                    ? 'bg-[#C2410C] text-white shadow-md font-semibold'
                    : 'text-[#D7B797] hover:text-[#FFF] hover:bg-[#28150D]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#EA580C]'}`} />
                <span>{item.label}</span>
                {'count' in item && item.count !== undefined && item.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-black/30 text-white' : 'bg-[#EA580C] text-white'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1A0F0A] border-b border-[#3D2013] px-4 pt-3 pb-5 space-y-3">
          {/* Mobile search */}
          <div className="relative w-full mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A87B57]" />
            <input
              type="text"
              placeholder="Buscar no catálogo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#25140D] border border-[#4F2817] rounded-lg text-sm text-[#F7EFE6] placeholder-[#8F6647]"
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
                      ? 'bg-[#C2410C] text-white font-semibold'
                      : 'text-[#D7B797] bg-[#22120B] hover:bg-[#2C180E]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#EA580C]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              onOpenAddModal();
              setMobileMenuOpen(false);
            }}
            className="w-full mt-2 flex items-center justify-center space-x-2 py-2 rounded-lg bg-[#2E170F] text-[#FBD0A4] border border-[#EA580C]/40 text-xs font-medium"
          >
            <PlusCircle className="w-4 h-4 text-[#EA580C]" />
            <span>+ Cadastrar Obra no Catálogo</span>
          </button>
        </div>
      )}

      {/* Thin cordel accent ribbon */}
      <CordelPattern className="border-t border-[#29150C] py-0.5" />
    </header>
  );
};
