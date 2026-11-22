import React, { useState } from 'react';
import { X, PlusCircle, Pencil, Sparkles, Check } from 'lucide-react';
import { AgeRating, Movie, Region } from '../types';
import { ApiError, CreateMoviePayload } from '../services/api';
import { AGE_RATING_OPTIONS, DEFAULT_COUNTRY, REGIONS_LIST } from '../data/mockData';

interface AdminAddMovieModalProps {
  initialMovie?: Movie;
  onClose: () => void;
  onCreateMovie: (payload: CreateMoviePayload) => Promise<void>;
  onUpdateMovie: (movieId: string, payload: Partial<CreateMoviePayload>) => Promise<void>;
}

type PresetName = 'campina' | 'cabaceiras' | 'doc';

interface FormState {
  titulo: string;
  sinopse: string;
  municipio: string;
  estadoSigla: string;
  estado: string;
  regiao: Region;
  ano: number;
  duracaoMinutos: number;
  generoText: string;
  classificacao: AgeRating;
  direcao: string;
  roteiro: string;
  producao: string;
  elencoText: string;
  fotografia: string;
  trilhaSonora: string;
  curadoriaTag: string;
  posterUrl: string;
  backdropUrl: string;
  videoUrl: string;
  trailerUrl: string;
  produtora: string;
  premiosText: string;
  curiosidadesText: string;
  destaqueCuradoria: boolean;
  popularidade: number;
}

const MAX_URL_LENGTH = 2048;
const MIN_POPULARITY = 0;
const MAX_POPULARITY = 100;

const DEFAULT_FORM: FormState = {
  titulo: '',
  sinopse: '',
  municipio: 'Campina Grande',
  estadoSigla: 'PB',
  estado: 'Paraíba',
  regiao: 'Nordeste',
  ano: 2025,
  duracaoMinutos: 88,
  generoText: 'Drama, Ficção',
  classificacao: '12',
  direcao: 'Cineastas de Campina Grande',
  roteiro: 'Coletivo Paraíba Audiovisual',
  producao: 'Produtora Borborema',
  elencoText: 'Zezita Matos (Dona Carminha), Marcélia Cartaxo (Rosa)',
  fotografia: 'Walter Carvalho',
  trilhaSonora: 'Sivuca e Quinteto da Paraíba',
  curadoriaTag: 'Cinema Paraibano',
  posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  backdropUrl: '',
  videoUrl: '',
  trailerUrl: '',
  produtora: 'Produtora Borborema',
  premiosText: '',
  curiosidadesText: '',
  destaqueCuradoria: true,
  popularidade: 85
};

const PRESETS: Record<PresetName, Partial<FormState>> = {
  campina: {
    titulo: 'O Trem das Memórias de Campina',
    sinopse: 'Nas antigas oficinas da Estação Ferroviária de Campina Grande, velhos maquinistas e poetas do repente relembram os tempos de ouro em que o algodão e as canções viajavam sobre os trilhos da Borborema rumo a todo o Brasil.',
    municipio: 'Campina Grande',
    estadoSigla: 'PB',
    estado: 'Paraíba',
    regiao: 'Nordeste',
    ano: 2024,
    duracaoMinutos: 75,
    generoText: 'Documentário, Memória & Identidade',
    classificacao: 'Livre',
    direcao: 'Marcus Vilar, Bertrand Lira',
    roteiro: 'Marcus Vilar',
    producao: 'UEPB Cine Lab',
    produtora: 'UEPB Cine Lab',
    elencoText: 'Mestre Biliu de Campina (Ele mesmo), Zezita Matos (Narradora)',
    fotografia: 'Beto Martins',
    trilhaSonora: 'Mestre Biliu de Campina e Carlos Malta',
    curadoriaTag: 'Cine Campina Grande',
    posterUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80'
  },
  cabaceiras: {
    titulo: 'Vento das Pedras no Lajedo',
    sinopse: 'No silêncio místico do Lajedo de Pai Mateus, em Cabaceiras, dois geólogos e uma rezadeira local descobrem inscrições rupestres esquecidas que desvendam segredos guardados há séculos sob as rochas do Cariri paraibano.',
    municipio: 'Cabaceiras',
    estadoSigla: 'PB',
    estado: 'Paraíba',
    regiao: 'Nordeste',
    ano: 2025,
    duracaoMinutos: 92,
    generoText: 'Suspense, Cordel & Épico',
    classificacao: '14',
    direcao: 'Torquato Joel',
    roteiro: 'Torquato Joel, W. J. Solha',
    producao: 'Roliúde Produções Cariri',
    produtora: 'Roliúde Produções Cariri',
    elencoText: 'Marcélia Cartaxo (Dona Sebastiana), Nanego Lira (Vicente)',
    fotografia: 'Mauro Pinheiro Jr.',
    trilhaSonora: 'Quinteto de Cordas da Paraíba',
    curadoriaTag: 'Roliúde Nordestina',
    posterUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
  },
  doc: {
    titulo: 'Feira Central: O Universo em Campina',
    sinopse: 'Um retrato imersivo da feira livre de Campina Grande, patrimônio imaterial brasileiro onde convergem farinheiros, repentistas, ervas medicinais, artigos de couro e a alma incontestável do povo nordestino.',
    municipio: 'Campina Grande',
    estadoSigla: 'PB',
    estado: 'Paraíba',
    regiao: 'Nordeste',
    ano: 2026,
    duracaoMinutos: 45,
    generoText: 'Documentário, Cultura Popular',
    classificacao: 'Livre',
    direcao: 'Coletivo Comunicurtas',
    roteiro: 'Pesquisadores da Paraíba',
    producao: 'Cinema da Borborema',
    produtora: 'Cinema da Borborema',
    elencoText: 'Feirantes de Campina Grande (Eles mesmos)',
    fotografia: 'João Carlos Beltrão',
    trilhaSonora: 'Pífano e Sanfona Tradicionais',
    curadoriaTag: 'Patrimônio Cultural PB',
    posterUrl: 'https://images.unsplash.com/photo-1533613220915-609f661a6fe1?auto=format&fit=crop&w=800&q=80'
  }
};

const PRESET_BUTTONS: { name: PresetName; label: string }[] = [
  { name: 'campina', label: 'Campina Grande' },
  { name: 'cabaceiras', label: 'Cabaceiras / Cariri' },
  { name: 'doc', label: 'Documentário Feira' }
];

const fieldClassName =
  'w-full px-3 py-1.5 rounded-xl bg-brand-surface border border-brand-border text-brand-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent';
const compactFieldClassName =
  'w-full px-2 py-1.5 rounded-lg bg-brand-bg border border-brand-border text-brand-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent';
const labelClassName = 'block text-brand-text-muted mb-1 font-semibold';

function splitList(text: string): string[] {
  return text
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function splitLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function parseCast(text: string): CreateMoviePayload['elenco'] {
  return splitList(text).map((item) => {
    const castMatch = item.match(/(.+?)\s*\((.+?)\)/);
    if (castMatch) return { nome: castMatch[1].trim(), personagem: castMatch[2].trim() };
    return { nome: item, personagem: 'Personagem' };
  });
}

function toFormState(movie: Movie): FormState {
  return {
    titulo: movie.titulo,
    sinopse: movie.sinopse,
    municipio: movie.localizacao.municipio,
    estadoSigla: movie.localizacao.estadoSigla,
    estado: movie.localizacao.estado,
    regiao: movie.localizacao.regiao,
    ano: movie.ano,
    duracaoMinutos: movie.duracaoMinutos,
    generoText: movie.genero.join(', '),
    classificacao: movie.classificacaoIndicativa,
    direcao: movie.direcao.join(', '),
    roteiro: movie.roteiro.join(', '),
    producao: movie.producao.join(', '),
    elencoText: movie.elenco.map((member) => `${member.nome} (${member.personagem})`).join(', '),
    fotografia: movie.fotografia,
    trilhaSonora: movie.trilhaSonora,
    curadoriaTag: movie.curadoriaTag ?? '',
    posterUrl: movie.posterUrl,
    backdropUrl: movie.backdropUrl,
    videoUrl: movie.videoUrl,
    trailerUrl: movie.trailerUrl,
    produtora: movie.produtora,
    premiosText: movie.premios.join('\n'),
    curiosidadesText: movie.curiosidades.join('\n'),
    destaqueCuradoria: movie.destaqueCuradoria ?? false,
    popularidade: movie.popularidade
  };
}

function toMovieFormFields(form: FormState): CreateMoviePayload {
  const posterUrl = form.posterUrl.trim();
  const videoUrl = form.videoUrl.trim();
  const curadoriaTag = form.curadoriaTag.trim();

  return {
    titulo: form.titulo.trim(),
    sinopse: form.sinopse.trim(),
    posterUrl,
    backdropUrl: form.backdropUrl.trim() || posterUrl,
    videoUrl,
    trailerUrl: form.trailerUrl.trim() || videoUrl,
    ano: Number(form.ano),
    duracaoMinutos: Number(form.duracaoMinutos),
    genero: splitList(form.generoText),
    classificacaoIndicativa: form.classificacao,
    localizacao: {
      pais: DEFAULT_COUNTRY,
      regiao: form.regiao,
      estado: form.estado.trim(),
      estadoSigla: form.estadoSigla.trim(),
      municipio: form.municipio.trim()
    },
    direcao: splitList(form.direcao),
    roteiro: splitList(form.roteiro),
    producao: splitList(form.producao),
    elenco: parseCast(form.elencoText),
    fotografia: form.fotografia.trim(),
    trilhaSonora: form.trilhaSonora.trim(),
    produtora: form.produtora.trim(),
    premios: splitLines(form.premiosText),
    curiosidades: splitLines(form.curiosidadesText),
    destaqueCuradoria: form.destaqueCuradoria,
    curadoriaTag: curadoriaTag || null,
    popularidade: Number(form.popularidade)
  };
}

function pickChangedFields(current: CreateMoviePayload, original: CreateMoviePayload): Partial<CreateMoviePayload> {
  const changedEntries = Object.entries(current).filter(
    ([key, value]) => JSON.stringify(value) !== JSON.stringify(original[key as keyof CreateMoviePayload])
  );

  return Object.fromEntries(changedEntries);
}

export const AdminAddMovieModal: React.FC<AdminAddMovieModalProps> = ({
  initialMovie,
  onClose,
  onCreateMovie,
  onUpdateMovie
}) => {
  const [form, setForm] = useState<FormState>(() => (initialMovie ? toFormState(initialMovie) : DEFAULT_FORM));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEditing = initialMovie !== undefined;

  const updateField = <Field extends keyof FormState>(field: Field, value: FormState[Field]) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleApplyPreset = (preset: PresetName) => {
    setForm((previous) => ({ ...previous, ...PRESETS[preset] }));
  };

  const saveMovie = async (fields: CreateMoviePayload) => {
    if (!initialMovie) {
      await onCreateMovie(fields);
      return;
    }

    const changedFields = pickChangedFields(fields, toMovieFormFields(toFormState(initialMovie)));
    if (Object.keys(changedFields).length > 0) {
      await onUpdateMovie(initialMovie.id, changedFields);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.titulo.trim() || !form.sinopse.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await saveMovie(toMovieFormFields(form));
      onClose();
    } catch (error) {
      setSubmitError(error instanceof ApiError ? error.message : 'Não foi possível salvar o filme agora. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const HeaderIcon = isEditing ? Pencil : PlusCircle;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-form-title"
        className="relative w-full max-w-3xl bg-brand-bg border border-brand-border rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-brand-text"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="p-5 bg-brand-surface border-b border-brand-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HeaderIcon className="w-5 h-5 text-brand-accent" />
            <div>
              <h2 id="movie-form-title" className="text-lg font-bold text-brand-text font-display">
                {isEditing ? 'Editar Obra do Catálogo' : 'Cadastrar Nova Obra no Catálogo'}
              </h2>
              <p className="text-xs text-brand-text-muted">
                Gestão e enriquecimento do acervo do cinema brasileiro e regional
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="p-1.5 rounded-full bg-black/50 text-brand-text-soft hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isEditing && (
          <div className="bg-brand-surface px-5 py-3 border-b border-brand-border flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-brand-text-soft flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-star" />
              <span>Preenchimento Rápido com Modelos Regionais:</span>
            </span>
            <div className="flex items-center space-x-2">
              {PRESET_BUTTONS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset.name)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-bg hover:bg-brand-surface-raised text-brand-star border border-brand-border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="movie-titulo" className={labelClassName}>Título da Obra</label>
              <input
                id="movie-titulo"
                type="text"
                value={form.titulo}
                onChange={(event) => updateField('titulo', event.target.value)}
                placeholder="Ex: O Canto das Lavadeiras do Cariri"
                required
                className={fieldClassName}
              />
            </div>
            <div>
              <label htmlFor="movie-poster" className={labelClassName}>URL do Pôster / Imagem</label>
              <input
                id="movie-poster"
                type="url"
                value={form.posterUrl}
                onChange={(event) => updateField('posterUrl', event.target.value)}
                required
                maxLength={MAX_URL_LENGTH}
                className={fieldClassName}
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-brand-surface border border-brand-border space-y-2">
            <span className="font-bold text-brand-accent uppercase tracking-wider block">Mídia</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label htmlFor="movie-video" className="block text-brand-text-muted text-[10px]">URL do Vídeo (.mp4)</label>
                <input
                  id="movie-video"
                  type="url"
                  value={form.videoUrl}
                  onChange={(event) => updateField('videoUrl', event.target.value)}
                  placeholder="https://archive.org/download/..."
                  required
                  maxLength={MAX_URL_LENGTH}
                  className={compactFieldClassName}
                />
              </div>
              <div>
                <label htmlFor="movie-trailer" className="block text-brand-text-muted text-[10px]">URL do Trailer (opcional)</label>
                <input
                  id="movie-trailer"
                  type="url"
                  value={form.trailerUrl}
                  onChange={(event) => updateField('trailerUrl', event.target.value)}
                  placeholder="Vazio usa o vídeo"
                  maxLength={MAX_URL_LENGTH}
                  className={compactFieldClassName}
                />
              </div>
              <div>
                <label htmlFor="movie-backdrop" className="block text-brand-text-muted text-[10px]">URL do Fundo (opcional)</label>
                <input
                  id="movie-backdrop"
                  type="url"
                  value={form.backdropUrl}
                  onChange={(event) => updateField('backdropUrl', event.target.value)}
                  placeholder="Vazio usa o pôster"
                  maxLength={MAX_URL_LENGTH}
                  className={compactFieldClassName}
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="movie-sinopse" className={labelClassName}>Sinopse Completa</label>
            <textarea
              id="movie-sinopse"
              rows={3}
              value={form.sinopse}
              onChange={(event) => updateField('sinopse', event.target.value)}
              placeholder="Descreva a narrativa, temática regional e contextualização cultural..."
              required
              className={fieldClassName}
            />
          </div>

          <div className="p-3 rounded-xl bg-brand-surface border border-brand-border space-y-2">
            <span className="font-bold text-brand-accent uppercase tracking-wider block">
              Hierarquia Geográfica (País → Região → Estado → Município)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label htmlFor="movie-regiao" className="block text-brand-text-muted text-[10px]">Região</label>
                <select
                  id="movie-regiao"
                  value={form.regiao}
                  onChange={(event) => updateField('regiao', event.target.value as Region)}
                  className={compactFieldClassName}
                >
                  {REGIONS_LIST.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="movie-sigla" className="block text-brand-text-muted text-[10px]">Sigla Estado</label>
                <input
                  id="movie-sigla"
                  type="text"
                  value={form.estadoSigla}
                  onChange={(event) => updateField('estadoSigla', event.target.value.toUpperCase())}
                  className={compactFieldClassName}
                />
              </div>
              <div>
                <label htmlFor="movie-estado" className="block text-brand-text-muted text-[10px]">Estado por Extenso</label>
                <input
                  id="movie-estado"
                  type="text"
                  value={form.estado}
                  onChange={(event) => updateField('estado', event.target.value)}
                  className={compactFieldClassName}
                />
              </div>
              <div>
                <label htmlFor="movie-municipio" className="block text-brand-text-muted text-[10px]">Município de Destaque</label>
                <input
                  id="movie-municipio"
                  type="text"
                  value={form.municipio}
                  onChange={(event) => updateField('municipio', event.target.value)}
                  className={`${compactFieldClassName} font-medium`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label htmlFor="movie-ano" className={labelClassName}>Ano</label>
              <input
                id="movie-ano"
                type="number"
                value={form.ano}
                onChange={(event) => updateField('ano', Number(event.target.value))}
                className={fieldClassName}
              />
            </div>
            <div>
              <label htmlFor="movie-duracao" className={labelClassName}>Duração (minutos)</label>
              <input
                id="movie-duracao"
                type="number"
                value={form.duracaoMinutos}
                onChange={(event) => updateField('duracaoMinutos', Number(event.target.value))}
                min={1}
                className={fieldClassName}
              />
            </div>
            <div>
              <label htmlFor="movie-classificacao" className={labelClassName}>Classificação</label>
              <select
                id="movie-classificacao"
                value={form.classificacao}
                onChange={(event) => updateField('classificacao', event.target.value as AgeRating)}
                className={fieldClassName}
              >
                {AGE_RATING_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="movie-curadoria" className={labelClassName}>Destaque Curadoria</label>
              <input
                id="movie-curadoria"
                type="text"
                value={form.curadoriaTag}
                onChange={(event) => updateField('curadoriaTag', event.target.value)}
                placeholder="Ex: Cinema Paraibano"
                className={fieldClassName}
              />
            </div>
          </div>

          <div>
            <label htmlFor="movie-genero" className={labelClassName}>Gêneros (separados por vírgula)</label>
            <input
              id="movie-genero"
              type="text"
              value={form.generoText}
              onChange={(event) => updateField('generoText', event.target.value)}
              className={fieldClassName}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="movie-direcao" className={labelClassName}>Diretor(a)</label>
              <input
                id="movie-direcao"
                type="text"
                value={form.direcao}
                onChange={(event) => updateField('direcao', event.target.value)}
                className={fieldClassName}
              />
            </div>
            <div>
              <label htmlFor="movie-roteiro" className={labelClassName}>Roteirista(s)</label>
              <input
                id="movie-roteiro"
                type="text"
                value={form.roteiro}
                onChange={(event) => updateField('roteiro', event.target.value)}
                className={fieldClassName}
              />
            </div>
            <div>
              <label htmlFor="movie-producao" className={labelClassName}>Produção</label>
              <input
                id="movie-producao"
                type="text"
                value={form.producao}
                onChange={(event) => updateField('producao', event.target.value)}
                className={fieldClassName}
              />
            </div>
          </div>

          <div>
            <label htmlFor="movie-elenco" className={labelClassName}>Elenco (Nome e Personagem em parênteses)</label>
            <input
              id="movie-elenco"
              type="text"
              value={form.elencoText}
              onChange={(event) => updateField('elencoText', event.target.value)}
              placeholder="Ex: Zezita Matos (Dona Carminha), Marcélia Cartaxo (Rosa)"
              className={fieldClassName}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="movie-fotografia" className={labelClassName}>Direção de Fotografia</label>
              <input
                id="movie-fotografia"
                type="text"
                value={form.fotografia}
                onChange={(event) => updateField('fotografia', event.target.value)}
                className={fieldClassName}
              />
            </div>
            <div>
              <label htmlFor="movie-trilha" className={labelClassName}>Trilha Sonora</label>
              <input
                id="movie-trilha"
                type="text"
                value={form.trilhaSonora}
                onChange={(event) => updateField('trilhaSonora', event.target.value)}
                className={fieldClassName}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="movie-produtora" className={labelClassName}>Produtora (empresa)</label>
              <input
                id="movie-produtora"
                type="text"
                value={form.produtora}
                onChange={(event) => updateField('produtora', event.target.value)}
                required
                className={fieldClassName}
              />
            </div>
            <div>
              <label htmlFor="movie-popularidade" className={labelClassName}>Popularidade (0 a 100)</label>
              <input
                id="movie-popularidade"
                type="number"
                value={form.popularidade}
                onChange={(event) => updateField('popularidade', Number(event.target.value))}
                min={MIN_POPULARITY}
                max={MAX_POPULARITY}
                step={1}
                className={fieldClassName}
              />
            </div>
            <div className="flex items-end">
              <label htmlFor="movie-destaque" className="flex items-center space-x-2 text-brand-text-soft font-semibold">
                <input
                  id="movie-destaque"
                  type="checkbox"
                  checked={form.destaqueCuradoria}
                  onChange={(event) => updateField('destaqueCuradoria', event.target.checked)}
                  className="accent-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                />
                <span>Destaque na curadoria</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="movie-premios" className={labelClassName}>Prêmios (um por linha)</label>
              <textarea
                id="movie-premios"
                rows={3}
                value={form.premiosText}
                onChange={(event) => updateField('premiosText', event.target.value)}
                className={fieldClassName}
              />
            </div>
            <div>
              <label htmlFor="movie-curiosidades" className={labelClassName}>Curiosidades (uma por linha)</label>
              <textarea
                id="movie-curiosidades"
                rows={3}
                value={form.curiosidadesText}
                onChange={(event) => updateField('curiosidadesText', event.target.value)}
                className={fieldClassName}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-brand-border flex items-center justify-between">
            {submitError ? <span role="alert" className="text-xs text-brand-accent">{submitError}</span> : <span />}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-brand-surface text-brand-text-soft hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-accent text-white font-bold flex items-center space-x-1.5 transition shadow-lg disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmitting ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Salvar no Catálogo'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
