import { useEffect, useState, type FormEvent } from 'react';
import { moviesApi, type Filme, type FilmeFormData, type Genero, type StatusFilme } from './api';

const CLASSIFICACOES = ['L', '10', '12', '14', '16', '18'];

const STATUS_OPTIONS: { value: StatusFilme; label: string }[] = [
  { value: 'RASCUNHO', label: 'Rascunho' },
  { value: 'PUBLICADO', label: 'Publicado' },
  { value: 'ARQUIVADO', label: 'Arquivado' },
];

function buildInitialForm(filme?: Filme): FilmeFormData {
  return {
    titulo: filme?.titulo ?? '',
    sinopse: filme?.sinopse ?? '',
    diretor: filme?.diretor ?? '',
    anoLancamento: filme?.anoLancamento ?? new Date().getFullYear(),
    duracaoMinutos: filme?.duracaoMinutos ?? 90,
    idioma: filme?.idioma ?? 'pt-BR',
    classificacaoIndicativa: filme?.classificacaoIndicativa ?? '',
    posterUrl: filme?.posterUrl ?? '',
    trailerUrl: filme?.trailerUrl ?? '',
    videoUrl: filme?.videoUrl ?? '',
    dominioPublico: filme?.dominioPublico ?? false,
    status: filme?.status ?? 'RASCUNHO',
    generoIds: filme?.generos.map((genero) => genero.id) ?? [],
  };
}

interface MovieFormModalProps {
  filme?: Filme;
  onSubmit: (data: FilmeFormData) => Promise<void>;
  onClose: () => void;
}

export function MovieFormModal({ filme, onSubmit, onClose }: MovieFormModalProps) {
  const [form, setForm] = useState<FilmeFormData>(() => buildInitialForm(filme));
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    moviesApi
      .listGeneros()
      .then(setGeneros)
      .catch((error: unknown) =>
        setErrorMessage(error instanceof Error ? error.message : 'Erro ao carregar gêneros'),
      );
  }, []);

  const setField = <Key extends keyof FilmeFormData>(key: Key, value: FilmeFormData[Key]) =>
    setForm((current) => ({ ...current, [key]: value }));

  function toggleGenero(generoId: string) {
    setField(
      'generoIds',
      form.generoIds.includes(generoId)
        ? form.generoIds.filter((currentId) => currentId !== generoId)
        : [...form.generoIds, generoId],
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage('');
    try {
      await onSubmit(form);
      onClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <dialog open aria-modal="true">
      <form onSubmit={handleSubmit}>
        <h2>{filme ? 'Editar filme' : 'Novo filme'}</h2>

        <label>
          Título*
          <input required value={form.titulo} onChange={(event) => setField('titulo', event.target.value)} />
        </label>
        <label>
          Sinopse*
          <textarea
            required
            minLength={10}
            rows={4}
            value={form.sinopse}
            onChange={(event) => setField('sinopse', event.target.value)}
          />
        </label>
        <label>
          Diretor*
          <input required value={form.diretor} onChange={(event) => setField('diretor', event.target.value)} />
        </label>

        <fieldset>
          <legend>Gêneros*</legend>
          {generos.map((genero) => (
            <label key={genero.id}>
              <input
                type="checkbox"
                checked={form.generoIds.includes(genero.id)}
                onChange={() => toggleGenero(genero.id)}
              />
              {genero.nome}
            </label>
          ))}
        </fieldset>

        <label>
          Ano de lançamento*
          <input
            type="number"
            required
            value={form.anoLancamento}
            onChange={(event) => setField('anoLancamento', Number(event.target.value))}
          />
        </label>
        <label>
          Duração em minutos*
          <input
            type="number"
            required
            min={1}
            value={form.duracaoMinutos}
            onChange={(event) => setField('duracaoMinutos', Number(event.target.value))}
          />
        </label>
        <label>
          Classificação indicativa
          <select
            value={form.classificacaoIndicativa}
            onChange={(event) => setField('classificacaoIndicativa', event.target.value)}
          >
            <option value="">Não informada</option>
            {CLASSIFICACOES.map((classificacao) => (
              <option key={classificacao} value={classificacao}>
                {classificacao}
              </option>
            ))}
          </select>
        </label>
        <label>
          Idioma
          <input value={form.idioma} onChange={(event) => setField('idioma', event.target.value)} />
        </label>
        <label>
          Status
          <select
            value={form.status}
            onChange={(event) =>
              setField('status', STATUS_OPTIONS.find((option) => option.value === event.target.value)?.value ?? 'RASCUNHO')
            }
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.dominioPublico}
            onChange={(event) => setField('dominioPublico', event.target.checked)}
          />
          Domínio público
        </label>
        <label>
          URL do pôster
          <input type="url" value={form.posterUrl} onChange={(event) => setField('posterUrl', event.target.value)} />
        </label>
        <label>
          URL do trailer
          <input type="url" value={form.trailerUrl} onChange={(event) => setField('trailerUrl', event.target.value)} />
        </label>
        <label>
          URL do vídeo
          <input type="url" value={form.videoUrl} onChange={(event) => setField('videoUrl', event.target.value)} />
        </label>

        {errorMessage && <p role="alert">{errorMessage}</p>}

        <button type="button" onClick={onClose}>
          Cancelar
        </button>
        <button type="submit" disabled={saving || form.generoIds.length === 0}>
          {saving ? 'Salvando…' : 'Salvar'}
        </button>
      </form>
    </dialog>
  );
}
