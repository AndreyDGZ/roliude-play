import React, { useMemo, useState } from 'react';
import { Check, Pencil, Plus, X } from 'lucide-react';
import { AdminDeleteButton } from './AdminDeleteButton';
import { AdminStatusMessage } from './AdminStatusMessage';
import { BEHIND_THE_SCENES_TYPES } from '../data/mockData';
import { ApiError, BehindTheScenesPayload } from '../services/api';
import { BehindTheScenesItem, Movie } from '../types';

interface AdminBehindTheScenesSectionProps {
  items: BehindTheScenesItem[];
  movies: Movie[];
  onCreateItem: (payload: BehindTheScenesPayload) => Promise<void>;
  onUpdateItem: (itemId: string, payload: BehindTheScenesPayload) => Promise<void>;
  onDeleteItem: (itemId: string) => Promise<void>;
}

const fieldClassName =
  'w-full px-3 py-2 rounded-xl bg-brand-bg border border-brand-border text-xs text-brand-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent';
const labelClassName = 'block text-xs text-brand-text-muted mb-1 font-semibold';

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function createEmptyForm(firstMovieId: string): BehindTheScenesPayload {
  return {
    filmeId: firstMovieId,
    titulo: '',
    tipo: 'making_of',
    descricao: '',
    thumbnailUrl: '',
    videoUrl: '',
    dataPublicacao: todayIsoDate()
  };
}

function toFormState(item: BehindTheScenesItem): BehindTheScenesPayload {
  return {
    filmeId: item.filmeId,
    titulo: item.titulo,
    tipo: item.tipo,
    descricao: item.descricao,
    thumbnailUrl: item.thumbnailUrl,
    videoUrl: item.videoUrl ?? '',
    dataPublicacao: item.dataPublicacao.slice(0, 10)
  };
}

function toPayload(form: BehindTheScenesPayload): BehindTheScenesPayload {
  const videoUrl = form.videoUrl?.trim();
  return {
    ...form,
    titulo: form.titulo.trim(),
    descricao: form.descricao.trim(),
    thumbnailUrl: form.thumbnailUrl.trim(),
    videoUrl: videoUrl ? videoUrl : undefined
  };
}

export const AdminBehindTheScenesSection: React.FC<AdminBehindTheScenesSectionProps> = ({
  items,
  movies,
  onCreateItem,
  onUpdateItem,
  onDeleteItem
}) => {
  const [form, setForm] = useState<BehindTheScenesPayload | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const movieTitleById = useMemo(() => new Map(movies.map((movie) => [movie.id, movie.titulo])), [movies]);

  const updateField = <Field extends keyof BehindTheScenesPayload>(field: Field, value: BehindTheScenesPayload[Field]) => {
    setForm((previous) => (previous ? { ...previous, [field]: value } : previous));
  };

  const handleOpenForm = (item?: BehindTheScenesItem) => {
    setErrorMessage(null);
    setEditingId(item?.id ?? null);
    setForm(item ? toFormState(item) : createEmptyForm(movies[0]?.id ?? ''));
  };

  const handleCloseForm = () => {
    setForm(null);
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form) return;

    setIsSaving(true);
    setErrorMessage(null);
    try {
      const payload = toPayload(form);
      if (editingId) {
        await onUpdateItem(editingId, payload);
      } else {
        await onCreateItem(payload);
      }
      handleCloseForm();
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : 'Não foi possível salvar o conteúdo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    setErrorMessage(null);
    try {
      await onDeleteItem(itemId);
    } catch {
      setErrorMessage('Não foi possível remover o conteúdo.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => handleOpenForm()}
          disabled={movies.length === 0}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-accent text-white text-xs font-bold transition disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          <Plus className="w-4 h-4" />
          <span>Novo conteúdo</span>
        </button>
      </div>

      {errorMessage && <p role="alert" className="text-xs text-brand-accent">{errorMessage}</p>}

      {form && (
        <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-brand-surface border border-brand-border space-y-3">
          <h3 className="text-sm font-bold font-display text-brand-text">
            {editingId ? 'Editar conteúdo de bastidores' : 'Cadastrar conteúdo de bastidores'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="bts-filme" className={labelClassName}>Filme</label>
              <select id="bts-filme" required value={form.filmeId} onChange={(event) => updateField('filmeId', event.target.value)} className={fieldClassName}>
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.id}>{movie.titulo}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="bts-tipo" className={labelClassName}>Tipo</label>
              <select
                id="bts-tipo"
                value={form.tipo}
                onChange={(event) => updateField('tipo', event.target.value as BehindTheScenesItem['tipo'])}
                className={fieldClassName}
              >
                {BEHIND_THE_SCENES_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="bts-titulo" className={labelClassName}>Título</label>
              <input id="bts-titulo" type="text" required value={form.titulo} onChange={(event) => updateField('titulo', event.target.value)} className={fieldClassName} />
            </div>
            <div>
              <label htmlFor="bts-data" className={labelClassName}>Data de publicação</label>
              <input id="bts-data" type="date" required value={form.dataPublicacao} onChange={(event) => updateField('dataPublicacao', event.target.value)} className={fieldClassName} />
            </div>
            <div>
              <label htmlFor="bts-thumbnail" className={labelClassName}>URL da miniatura</label>
              <input id="bts-thumbnail" type="url" required value={form.thumbnailUrl} onChange={(event) => updateField('thumbnailUrl', event.target.value)} className={fieldClassName} />
            </div>
            <div>
              <label htmlFor="bts-video" className={labelClassName}>URL do vídeo (opcional)</label>
              <input id="bts-video" type="url" value={form.videoUrl ?? ''} onChange={(event) => updateField('videoUrl', event.target.value)} className={fieldClassName} />
            </div>
          </div>
          <div>
            <label htmlFor="bts-descricao" className={labelClassName}>Descrição</label>
            <textarea id="bts-descricao" rows={3} required value={form.descricao} onChange={(event) => updateField('descricao', event.target.value)} className={fieldClassName} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={handleCloseForm} className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl bg-brand-bg text-brand-text-soft text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent">
              <X className="w-3.5 h-3.5" />
              <span>Cancelar</span>
            </button>
            <button type="submit" disabled={isSaving} className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-accent text-white text-xs font-bold disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent">
              <Check className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Salvando...' : 'Salvar'}</span>
            </button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <AdminStatusMessage message="Nenhum conteúdo de bastidores cadastrado." />
      ) : (
        <ul className="divide-y divide-brand-border rounded-xl bg-brand-surface border border-brand-border">
          {items.map((item) => (
            <li key={item.id} className="p-3 flex items-center gap-3">
              <img src={item.thumbnailUrl} alt={`Miniatura de ${item.titulo}`} className="w-14 h-10 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-text truncate">{item.titulo}</p>
                <p className="text-xs text-brand-text-soft truncate">{movieTitleById.get(item.filmeId) ?? 'Filme removido'}</p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenForm(item)}
                aria-label={`Editar ${item.titulo}`}
                className="px-2.5 py-1.5 rounded-lg bg-brand-bg border border-brand-border text-brand-text-soft hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <AdminDeleteButton itemLabel={item.titulo} onConfirm={() => handleDelete(item.id)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
