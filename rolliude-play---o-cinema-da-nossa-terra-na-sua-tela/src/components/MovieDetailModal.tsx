import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Heart, 
  Star, 
  MapPin, 
  Calendar, 
  Clock, 
  Award, 
  Clapperboard, 
  Users, 
  Music, 
  Camera, 
  Building2, 
  HelpCircle, 
  Share2, 
  MessageSquare,
  Send,
  Check
} from 'lucide-react';
import { Movie, BehindTheScenesItem, Review } from '../types';

interface MovieDetailModalProps {
  movie: Movie | null;
  onClose: () => void;
  onPlay: (movie: Movie) => void;
  isFavorite: boolean;
  onToggleFavorite: (movieId: string) => void;
  onSelectProfessionalName?: (name: string) => void;
  onOpenBehindTheScenes?: (bts: BehindTheScenesItem) => void;
  allBtsItems: BehindTheScenesItem[];
  onAddReview: (movieId: string, review: Review) => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  onClose,
  onPlay,
  isFavorite,
  onToggleFavorite,
  onSelectProfessionalName,
  onOpenBehindTheScenes,
  allBtsItems,
  onAddReview
}) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'ficha' | 'bastidores' | 'avaliacoes'>('geral');
  const [userRating, setUserRating] = useState<number>(5);
  const [userComment, setUserComment] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userCity, setUserCity] = useState<string>('');
  const [copiedShare, setCopiedShare] = useState(false);

  if (!movie) return null;

  // Filter BTS items linked to this movie
  const relatedBts = allBtsItems.filter(b => b.filmeId === movie.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      autor: userName.trim(),
      cidade: userCity.trim() || 'Brasil',
      nota: userRating,
      data: new Date().toLocaleDateString('pt-BR'),
      comentario: userComment.trim()
    };

    onAddReview(movie.id, newRev);
    setUserComment('');
    setUserName('');
    setUserCity('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#170E09] border border-[#442315] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-[#F8F1E7]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-black/90 text-[#E5C9A4] hover:text-white transition"
          title="Fechar ficha técnica"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Backdrop Banner */}
        <div className="relative h-60 sm:h-72 w-full flex-shrink-0 bg-[#25140C] overflow-hidden">
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt={movie.titulo}
            className="w-full h-full object-cover filter brightness-[0.4] contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#170E09] via-[#170E09]/60 to-transparent" />

          {/* Quick info over backdrop */}
          <div className="absolute bottom-4 left-4 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#C2410C] text-white">
                  {movie.curadoriaTag || 'Acervo Regional'}
                </span>
                <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-medium bg-[#2E180E] border border-[#522915] text-[#FCD34D]">
                  <MapPin className="w-3 h-3 text-[#EA580C]" />
                  <span>{movie.localizacao.municipio} — {movie.localizacao.estadoSigla}</span>
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-['Cinzel'] text-[#FAF6EE] drop-shadow">
                {movie.titulo}
              </h2>
              {movie.tituloOriginal && movie.tituloOriginal !== movie.titulo && (
                <p className="text-xs text-[#C89D77] italic">Título original: {movie.tituloOriginal}</p>
              )}
            </div>

            {/* Quick Action buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPlay(movie)}
                className="px-5 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#EA580C] text-white text-xs sm:text-sm font-bold flex items-center space-x-2 shadow-lg transition"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Reproduzir</span>
              </button>

              <button
                onClick={() => onToggleFavorite(movie.id)}
                className={`p-2.5 rounded-xl border transition ${
                  isFavorite 
                    ? 'bg-[#C2410C]/20 border-[#EA580C] text-[#EA580C]'
                    : 'bg-[#29150D] border-[#4E2716] text-[#D8B490] hover:text-white'
                }`}
                title="Favoritar obra"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#EA580C]' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-[#29150D] border border-[#4E2716] text-[#D8B490] hover:text-white transition"
                title="Compartilhar obra"
              >
                {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation for Ficha Técnica */}
        <div className="border-b border-[#381E13] bg-[#20120B] px-4 sm:px-6 flex space-x-4 sm:space-x-8 overflow-x-auto">
          {[
            { id: 'geral', label: 'Sinopse & Visão Geral', icon: Clapperboard },
            { id: 'ficha', label: 'Ficha Técnica Completa', icon: Users },
            { id: 'bastidores', label: `Bastidores & Entrevistas (${relatedBts.length})`, icon: Camera },
            { id: 'avaliacoes', label: `Avaliações (${movie.reviews?.length || 0})`, icon: MessageSquare }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-3 border-b-2 text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                  isActive
                    ? 'border-[#EA580C] text-[#EA580C] font-semibold'
                    : 'border-transparent text-[#B89271] hover:text-white hover:border-[#522915]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-[#E4D5C5]">
          
          {/* TAB 1: VISÃO GERAL */}
          {activeTab === 'geral' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Poster */}
                <div className="hidden sm:block aspect-[2/3] rounded-xl overflow-hidden bg-[#24130A] border border-[#462415] shadow-lg">
                  <img src={movie.posterUrl} alt={movie.titulo} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="md:col-span-2 space-y-4">
                  {/* Meta strip */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#C89D77] pb-3 border-b border-[#331A0E]">
                    <div className="flex items-center space-x-1 text-amber-400 font-bold">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{movie.notaMedia.toFixed(1)} / 5.0</span>
                    </div>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-[#EA580C]" />
                      <span>{movie.ano}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-[#EA580C]" />
                      <span>{movie.duracaoMinutos} minutos</span>
                    </span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded bg-[#2D160D] border border-[#502715] text-[#FCD34D] font-bold">
                      {movie.classificacaoIndicativa === 'Livre' ? 'Livre' : `+${movie.classificacaoIndicativa}`}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#EA580C] mb-1">Sinopse</h4>
                    <p className="text-sm leading-relaxed text-[#F3E5D4]">
                      {movie.sinopse}
                    </p>
                  </div>

                  {/* Hierarquia Geográfica Documentada */}
                  <div className="p-3.5 rounded-xl bg-[#22120B] border border-[#3E2114] space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#EA580C] flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Hierarquia Geográfica da Produção</span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-[#9E7B5D] block">País</span>
                        <strong className="text-white">{movie.localizacao.pais}</strong>
                      </div>
                      <div>
                        <span className="text-[#9E7B5D] block">Região</span>
                        <strong className="text-white">{movie.localizacao.regiao}</strong>
                      </div>
                      <div>
                        <span className="text-[#9E7B5D] block">Estado</span>
                        <strong className="text-white">{movie.localizacao.estado} ({movie.localizacao.estadoSigla})</strong>
                      </div>
                      <div>
                        <span className="text-[#9E7B5D] block">Município</span>
                        <strong className="text-[#FCD34D]">{movie.localizacao.municipio}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Direção & Gênero */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[#9E7B5D]">Direção: </span>
                      {movie.direcao.map((dir, idx) => (
                        <button
                          key={idx}
                          onClick={() => onSelectProfessionalName && onSelectProfessionalName(dir)}
                          className="font-semibold text-[#F8F1E7] hover:text-[#EA580C] underline decoration-[#EA580C]/40 mr-2"
                        >
                          {dir}
                        </button>
                      ))}
                    </div>

                    <div>
                      <span className="text-[#9E7B5D]">Gêneros: </span>
                      <span className="text-[#F8F1E7] font-medium">{movie.genero.join(', ')}</span>
                    </div>

                    <div>
                      <span className="text-[#9E7B5D]">Produtora: </span>
                      <span className="text-[#F8F1E7] font-medium">{movie.produtora}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premiações e Curiosidades */}
              {movie.premios.length > 0 && (
                <div className="p-4 rounded-xl bg-[#24130A] border border-[#442315] space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#FCD34D] flex items-center space-x-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Premiações e Festivais</span>
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-[#E5D4C3]">
                    {movie.premios.map((premio, i) => (
                      <li key={i}>{premio}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FICHA TÉCNICA COMPLETA */}
          {activeTab === 'ficha' && (
            <div className="space-y-6 text-xs sm:text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Elenco Completo */}
                <div className="p-4 rounded-xl bg-[#22120B] border border-[#3E2114] space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#EA580C] flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Elenco & Personagens</span>
                  </h4>
                  <div className="space-y-2">
                    {movie.elenco.map((actor) => (
                      <div 
                        key={actor.id} 
                        onClick={() => onSelectProfessionalName && onSelectProfessionalName(actor.nome)}
                        className="flex items-center justify-between p-2 rounded-lg bg-[#190D08] hover:bg-[#2F170D] cursor-pointer transition border border-[#361A0F]"
                      >
                        <span className="font-semibold text-white hover:text-[#EA580C]">{actor.nome}</span>
                        <span className="text-xs text-[#B89271] italic">{actor.personagem}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Equipe Técnica */}
                <div className="p-4 rounded-xl bg-[#22120B] border border-[#3E2114] space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#EA580C] flex items-center space-x-2">
                    <Clapperboard className="w-4 h-4" />
                    <span>Equipe Criativa & Técnica</span>
                  </h4>
                  
                  <div className="space-y-2.5 text-xs">
                    <div className="border-b border-[#2F170D] pb-1.5">
                      <span className="text-[#9E7B5D] block">Direção</span>
                      <strong className="text-white">{movie.direcao.join(', ')}</strong>
                    </div>

                    <div className="border-b border-[#2F170D] pb-1.5">
                      <span className="text-[#9E7B5D] block">Roteiro</span>
                      <strong className="text-white">{movie.roteiro.join(', ')}</strong>
                    </div>

                    <div className="border-b border-[#2F170D] pb-1.5">
                      <span className="text-[#9E7B5D] block">Produção</span>
                      <strong className="text-white">{movie.producao.join(', ')}</strong>
                    </div>

                    <div className="border-b border-[#2F170D] pb-1.5">
                      <span className="text-[#9E7B5D] flex items-center space-x-1">
                        <Camera className="w-3 h-3 text-[#EA580C]" />
                        <span>Direção de Fotografia</span>
                      </span>
                      <strong className="text-white">{movie.fotografia}</strong>
                    </div>

                    <div className="border-b border-[#2F170D] pb-1.5">
                      <span className="text-[#9E7B5D] flex items-center space-x-1">
                        <Music className="w-3 h-3 text-[#EA580C]" />
                        <span>Trilha Sonora & Desenho de Som</span>
                      </span>
                      <strong className="text-white">{movie.trilhaSonora}</strong>
                    </div>

                    <div>
                      <span className="text-[#9E7B5D] flex items-center space-x-1">
                        <Building2 className="w-3 h-3 text-[#EA580C]" />
                        <span>Produtora / Realização</span>
                      </span>
                      <strong className="text-white">{movie.produtora}</strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* Curiosidades de Produção */}
              {movie.curiosidades.length > 0 && (
                <div className="p-4 rounded-xl bg-[#24130A] border border-[#442315] space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#FCD34D] flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>Curiosidades e Contexto de Gravação</span>
                  </h4>
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-[#E5D4C3]">
                    {movie.curiosidades.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ESPAÇO BASTIDORES & DIREÇÃO VINCULADOS */}
          {activeTab === 'bastidores' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#B89271]">
                  Conteúdos especiais, making of, entrevistas e pesquisas visuais registradas na realização de <strong>{movie.titulo}</strong>.
                </p>
              </div>

              {relatedBts.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-[#20120B] border border-[#3E2114] text-[#B89271]">
                  <Camera className="w-8 h-8 text-[#EA580C] mx-auto mb-2 opacity-60" />
                  <p className="text-sm">Nenhum conteúdo de bastidores específico publicado ainda para este título.</p>
                  <p className="text-xs mt-1 text-[#8F6647]">A equipe de curadoria está digitalizando novos materiais de acervo.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedBts.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onOpenBehindTheScenes && onOpenBehindTheScenes(item)}
                      className="group cursor-pointer rounded-xl bg-[#22120B] border border-[#3E2114] overflow-hidden hover:border-[#EA580C] transition shadow-md"
                    >
                      <div className="relative aspect-video bg-[#2D160C]">
                        <img src={item.thumbnailUrl} alt={item.titulo} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-[#EA580C] text-white flex items-center justify-center shadow-md">
                            <Play className="w-4 h-4 fill-white ml-0.5" />
                          </div>
                        </div>
                        {item.duracao && (
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 text-[10px] text-white font-mono">
                            {item.duracao}
                          </span>
                        )}
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#C2410C] text-[10px] font-bold text-white uppercase">
                          {item.tipo.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="p-3">
                        <h5 className="font-bold text-xs sm:text-sm text-white group-hover:text-[#EA580C] transition line-clamp-1">
                          {item.titulo}
                        </h5>
                        <p className="text-[11px] text-[#C89D77] line-clamp-2 mt-1">
                          {item.descricao}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AVALIAÇÕES DA COMUNIDADE */}
          {activeTab === 'avaliacoes' && (
            <div className="space-y-6">
              {/* Form to submit review */}
              <form onSubmit={handleReviewSubmit} className="p-4 rounded-xl bg-[#22120B] border border-[#3E2114] space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#EA580C] flex items-center space-x-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Avaliar Filme & Deixar Resenha</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#A67E5D] mb-1">Seu Nome / Apelido</label>
                    <input
                      type="text"
                      placeholder="Ex: João Ferreira"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      className="w-full px-3 py-1.5 rounded-lg bg-[#190D08] border border-[#482515] text-xs text-white placeholder-[#7C5539] focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#A67E5D] mb-1">Sua Cidade / Estado</label>
                    <input
                      type="text"
                      placeholder="Ex: Campina Grande - PB"
                      value={userCity}
                      onChange={(e) => setUserCity(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#190D08] border border-[#482515] text-xs text-white placeholder-[#7C5539] focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[#A67E5D] mb-1">Sua Nota (1 a 5 estrelas)</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="p-1 text-amber-400 hover:scale-125 transition"
                      >
                        <Star className={`w-5 h-5 ${star <= userRating ? 'fill-amber-400' : 'text-stone-600'}`} />
                      </button>
                    ))}
                    <span className="text-xs text-[#E5D4C3] font-semibold ml-2">{userRating} / 5</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[#A67E5D] mb-1">Seu Comentário / Resenha</label>
                  <textarea
                    rows={2}
                    placeholder="Compartilhe suas impressões sobre a narrativa, fotografia e atuação..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 rounded-lg bg-[#190D08] border border-[#482515] text-xs text-white placeholder-[#7C5539] focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#C2410C] hover:bg-[#EA580C] text-white text-xs font-bold flex items-center space-x-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publicar Avaliação</span>
                </button>
              </form>

              {/* List of existing reviews */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#C89D77]">
                  Opiniões da Comunidade ({movie.reviews?.length || 0})
                </h5>

                {(!movie.reviews || movie.reviews.length === 0) ? (
                  <p className="text-xs text-[#8F6647] italic">Seja o primeiro a avaliar esta produção!</p>
                ) : (
                  movie.reviews.map((rev) => (
                    <div key={rev.id} className="p-3.5 rounded-xl bg-[#1F110A] border border-[#3A1F13] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <strong className="text-xs text-white">{rev.autor}</strong>
                          <span className="text-[10px] text-[#9E7B5D] ml-2">({rev.cidade})</span>
                        </div>
                        <div className="flex items-center space-x-1 text-amber-400 text-xs">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{rev.nota}/5</span>
                        </div>
                      </div>
                      <p className="text-xs text-[#E5D4C3] leading-relaxed">
                        {rev.comentario}
                      </p>
                      <span className="text-[10px] text-[#7C5539] block">{rev.data}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
