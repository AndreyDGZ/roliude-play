import React from 'react';
import { MapPin, Film, Heart, Shield, Award, ExternalLink } from 'lucide-react';
import { Logo } from './Logo';
import { CordelPattern } from './CordelPattern';

interface FooterProps {
  onNavigateTab: (tab: 'inicio' | 'catalogo' | 'curadoria' | 'bastidores' | 'profissionais') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="bg-[#120A06] border-t border-[#381E12] text-[#B89271] mt-16 select-none">
      {/* Decorative Cordel Pattern Header */}
      <CordelPattern className="border-b border-[#29140B] bg-[#170D08]" variant="subtle" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Logo & Vision */}
          <div className="md:col-span-1 space-y-4">
            <Logo size="sm" showSlogan={true} />
            <p className="text-xs text-[#A67E5D] leading-relaxed pt-2">
              Plataforma cultural brasileira dedicada à valorização, circulação e preservação do cinema brasileiro e regional.
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-[#E5C9A4]">
              <MapPin className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Campina Grande & Cabaceiras — Paraíba</span>
            </div>
          </div>

          {/* Col 2: Navegação Rápida */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FCD34D]">
              Navegação da Plataforma
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigateTab('inicio')} className="hover:text-white transition">
                  Início & Destaques
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('catalogo')} className="hover:text-white transition">
                  Catálogo & Filtros Geográficos
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('curadoria')} className="hover:text-white transition">
                  Curadorias Locais & Temáticas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('bastidores')} className="hover:text-white transition">
                  Espaço Bastidores & Direção
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('profissionais')} className="hover:text-white transition">
                  Perfis de Profissionais
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Polos Regionais de Destaque */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FCD34D]">
              Polos & Acervos em Foco
            </h4>
            <ul className="space-y-2 text-xs text-[#9E7B5D]">
              <li>
                <strong className="text-[#E5D4C3]">Cabaceiras (PB)</strong> — A Roliúde Nordestina e Lajedo de Pai Mateus
              </li>
              <li>
                <strong className="text-[#E5D4C3]">Campina Grande (PB)</strong> — Feira Central, UEPB & Festival Comunicurtas
              </li>
              <li>
                <strong className="text-[#E5D4C3]">João Pessoa (PB)</strong> — Berço de Aruanda & Fest Aruanda
              </li>
              <li>
                <strong className="text-[#E5D4C3]">Sertão & Cariri</strong> — Resistência, Quilombo do Talhado e Memória
              </li>
              <li>
                <strong className="text-[#E5D4C3]">Recife & Interior PE</strong> — Cinema Pernambucano Contemporâneo
              </li>
            </ul>
          </div>

          {/* Col 4: Referência Documental */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FCD34D]">
              Projeto & Planejamento
            </h4>
            <p className="text-xs leading-relaxed">
              Baseado na especificação oficial do projeto <em>Rolliude Play</em> (Campina Grande — PB, Agosto de 2026).
            </p>
            <div className="p-3 rounded-xl bg-[#1A0E08] border border-[#3A1F13] text-[11px] space-y-1 text-[#C89D77]">
              <div className="flex items-center space-x-1 text-amber-400 font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>Preservação Audiovisual</span>
              </div>
              <p>Valorizando quem cria e conta a história da nossa terra.</p>
            </div>
          </div>

        </div>

        {/* Bottom copyright and dedication */}
        <div className="mt-8 pt-6 border-t border-[#29150C] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8F6647] gap-3">
          <p>© 2026 Rolliude Play • O cinema da nossa terra na sua tela.</p>
          <p className="flex items-center space-x-1">
            <span>Desenvolvido com respeito à identidade e cultura nordestina</span>
            <Heart className="w-3.5 h-3.5 text-[#EA580C] fill-[#EA580C]" />
          </p>
        </div>
      </div>
    </footer>
  );
};
