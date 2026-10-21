import { useCallback, useEffect, useState } from 'react';
import { moviesApi, type Filme, type StatusFilme } from './api';
import { MovieFormModal } from './MovieFormModal';

const STATUS_LABELS: Record<StatusFilme, string> = {
  RASCUNHO: 'Rascunho',
  PUBLICADO: 'Publicado',
  ARQUIVADO: 'Arquivado',
};

export default function AdminMoviesPage() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editing, setEditing] = useState<Filme | 'new' | null>(null);

  const load = useCallback(async () => {
    try {
      setErrorMessage('');
      const result = await moviesApi.list(search, status);
      setFilmes(result.items);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao carregar');
    }
  }, [search, status]);

  useEffect(() => {
    void load();
  }, [load]);

  function askAdminKey() {
    const adminKey = window.prompt('Chave administrativa');
    if (adminKey) {
      sessionStorage.setItem('adminKey', adminKey);
      void load();
    }
  }

  async function removeFilme(filme: Filme) {
    if (!window.confirm(`Excluir "${filme.titulo}"?`)) return;
    await moviesApi.remove(filme.id);
    await load();
  }

  async function togglePublicado(filme: Filme) {
    await moviesApi.setStatus(filme.id, filme.status === 'PUBLICADO' ? 'RASCUNHO' : 'PUBLICADO');
    await load();
  }

  return (
    <main>
      <header>
        <h1>Filmes</h1>
        <input
          placeholder="Buscar título ou diretor"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">Todos</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button onClick={askAdminKey}>Chave admin</button>
        <button onClick={() => setEditing('new')}>Novo filme</button>
      </header>

      {errorMessage && <p role="alert">{errorMessage}</p>}

      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Diretor</th>
            <th>Ano</th>
            <th>Gêneros</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filmes.map((filme) => (
            <tr key={filme.id}>
              <td>{filme.titulo}</td>
              <td>{filme.diretor}</td>
              <td>{filme.anoLancamento}</td>
              <td>{filme.generos.map((genero) => genero.nome).join(', ')}</td>
              <td>{STATUS_LABELS[filme.status]}</td>
              <td>
                <button onClick={() => setEditing(filme)}>Editar</button>
                <button onClick={() => togglePublicado(filme)}>
                  {filme.status === 'PUBLICADO' ? 'Despublicar' : 'Publicar'}
                </button>
                <button onClick={() => removeFilme(filme)}>Excluir</button>
              </td>
            </tr>
          ))}
          {filmes.length === 0 && (
            <tr>
              <td colSpan={6}>Nenhum filme encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>

      {editing && (
        <MovieFormModal
          filme={editing === 'new' ? undefined : editing}
          onClose={() => setEditing(null)}
          onSubmit={async (data) => {
            if (editing === 'new') await moviesApi.create(data);
            else await moviesApi.update(editing.id, data);
            await load();
          }}
        />
      )}
    </main>
  );
}
