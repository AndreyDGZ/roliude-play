import React from 'react';
import { X, Award, MapPin, Film, Play, Star } from 'lucide-react';
import { Professional, Movie } from '../types';

interface ProfessionalModalProps {
  professional: Professional | null;
  onClose: () => void;
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onPlayMovie: (movie: Movie) => void;
}

export const ProfessionalModal: React.FC<ProfessionalModalProps> = ({
  professional,
  onClose,
  movies,
  onSelectMovie,
  onPlayMovie
}) => {
  if (!professional) return null;

  // Find all movies connected to this professional either via film IDs or name match
  const relatedMovies = movies.filter(
    (m) =>
      professional.filmesIds.includes(m.id) ||
      m.direcao.includes(professional.nome) ||
      m.roteiro.includes(professional.nome) ||
      m.elenco.some((e) => e.nome.toLowerCase() === professional.nome.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#170E09] border border-[#442315] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-[#F8F1E7]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-[#E5C9A4] hover:text-white transition"
          title="Fechar perfil"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Profile */}
        <div className="p-6 bg-gradient-to-r from-[#24130A] to-[#1A0E08] border-b border-[#3D2013] flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-[#EA580C] shadow-xl flex-shrink-0 bg-[#2C180E]">
            <img
              src={professional.foto}
              alt={professional.nome}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {professional.funcoes.map((fn, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#C2410C] text-white"
                >
                  {fn}
                </span>
              ))}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Cinzel'] text-[#FAF6EE]">
              {professional.nome}
            </h2>

            <div className="flex items-center justify-center sm:justify-start space-x-1.5 text-xs text-[#FCD34D]">
              <MapPin className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Natural de: <strong>{professional.cidadeNatal} — {professional.estadoNatal}</strong></span>
            </div>

            <p className="text-xs text-[#C89D77] italic">
              Patrimônio e Referência do Audiovisual Brasileiro
            </p>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#E4D5C5]">
          
          {/* Biography */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
              Biografia & Trajetória
            </h4>
            <p className="text-sm leading-relaxed text-[#F3E5D4]">
              {professional.biografia}
            </p>
          </div>

          {/* Awards */}
          {professional.premios.length > 0 && (
            <div className="p-4 rounded-xl bg-[#22120B] border border-[#3E2114] space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span>Reconhecimento & Prêmios Principais</span>
              </h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-[#E5D4C3]">
                {professional.premios.map((pr, i) => (
                  <li key={i}>{pr}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Filmography in catalog */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#EA580C] flex items-center space-x-2">
              <Film className="w-4 h-4" />
              <span>Filmografia no Rolliude Play ({relatedMovies.length})</span>
            </h4>

            {relatedMovies.length === 0 ? (
              <p className="text-xs text-[#8F6647]">Nenhuma produção cadastrada vinculada no momento.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="p-3 rounded-xl bg-[#20120B] border border-[#381E12] flex items-center space-x-3 hover:border-[#EA580C] transition group"
                  >
                    <img
                      src={movie.posterUrl}
                      alt={movie.titulo}
                      className="w-14 h-20 rounded-lg object-cover flex-shrink-0 cursor-pointer"
                      onClick={() => {
                        onClose();
                        onSelectMovie(movie);
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h5 
                        onClick={() => {
                          onClose();
                          onSelectMovie(movie);
                        }}
                        className="text-xs font-bold text-white group-hover:text-[#EA580C] cursor-pointer truncate"
                      >
                        {movie.titulo}
                      </h5>
                      <p className="text-[11px] text-[#A67E5D]">
                        {movie.ano} • {movie.localizacao.municipio} ({movie.localizacao.estadoSigla})
                      </p>
                      <div className="flex items-center space-x-1 text-[10px] text-amber-400 mt-1">
                        <Star className="w-2.5 h-2.5 fill-amber-400" />
                        <span>{movie.notaMedia.toFixed(1)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onPlayMovie(movie);
                      }}
                      className="p-2 rounded-lg bg-[#C2410C]/20 hover:bg-[#C2410C] text-[#FCD34D] hover:text-white transition"
                      title="Assistir agora"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
