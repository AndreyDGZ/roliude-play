import React from 'react';
import { Users, Award, MapPin, Film, ChevronRight } from 'lucide-react';
import { Professional, Movie } from '../types';

interface ProfessionalsViewProps {
  professionals: Professional[];
  movies: Movie[];
  onSelectProfessional: (prof: Professional) => void;
}

export const ProfessionalsView: React.FC<ProfessionalsViewProps> = ({
  professionals,
  movies,
  onSelectProfessional
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-10 rounded-2xl bg-gradient-to-r from-[#24130A] via-[#1E0F07] to-[#140A04] border border-[#442315] shadow-xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C2410C] text-white">
          <Users className="w-3.5 h-3.5" />
          <span>Valorização de Pessoas e Criadores</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-['Cinzel'] text-[#FAF6EE]">
          Profissionais do Audiovisual
        </h1>
        <p className="text-sm sm:text-base text-[#DCC7B3] max-w-3xl leading-relaxed">
          O Rolliude Play fortalece a visibilidade não apenas das obras, mas dos diretores, atrizes, atores, roteiristas e técnicos que moldaram e continuam revolucionando o cinema regional e nacional.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {professionals.map((prof) => {
          // Count linked movies
          const count = movies.filter(
            m => prof.filmesIds.includes(m.id) ||
                 m.direcao.includes(prof.nome) ||
                 m.roteiro.includes(prof.nome) ||
                 m.elenco.some(e => e.nome.toLowerCase() === prof.nome.toLowerCase())
          ).length;

          return (
            <div
              key={prof.id}
              onClick={() => onSelectProfessional(prof)}
              className="group cursor-pointer rounded-2xl bg-[#1B0F09] border border-[#3A1F13] p-5 hover:border-[#EA580C] hover:shadow-2xl transition duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#522915] group-hover:border-[#EA580C] transition flex-shrink-0 bg-[#29150D]">
                    <img
                      src={prof.foto}
                      alt={prof.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-1 mb-1">
                      {prof.funcoes.slice(0, 2).map((fn, idx) => (
                        <span key={idx} className="px-2 py-0.2 rounded text-[10px] font-bold bg-[#C2410C]/80 text-white">
                          {fn}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#EA580C] transition truncate font-['Cinzel']">
                      {prof.nome}
                    </h3>
                    <p className="text-xs text-[#FCD34D] flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#EA580C]" />
                      <span className="truncate">{prof.cidadeNatal} — {prof.estadoNatal}</span>
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#C89D77] line-clamp-3 leading-relaxed">
                  {prof.biografia}
                </p>

                {prof.premios.length > 0 && (
                  <div className="text-[11px] text-[#E5D4C3] bg-[#22120B] p-2.5 rounded-lg border border-[#381D11] flex items-start space-x-2">
                    <Award className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="truncate">{prof.premios[0]}</span>
                  </div>
                )}
              </div>

              {/* Bottom bar */}
              <div className="mt-4 pt-3 border-t border-[#2D160D] flex items-center justify-between text-xs">
                <span className="text-[#8F6647] flex items-center space-x-1">
                  <Film className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span><strong>{count}</strong> {count === 1 ? 'obra no catálogo' : 'obras no catálogo'}</span>
                </span>
                <span className="text-[#EA580C] font-semibold flex items-center group-hover:translate-x-1 transition">
                  <span>Ver perfil</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
