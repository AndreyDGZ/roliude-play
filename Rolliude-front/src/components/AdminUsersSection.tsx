import React, { useCallback, useEffect, useState } from 'react';
import { ShieldCheck, UserRound } from 'lucide-react';
import { AdminPagination } from './AdminPagination';
import { AdminStatusMessage } from './AdminStatusMessage';
import { ApiError, getUsers, updateUserRole } from '../services/api';
import { USER_ROLES } from '../data/mockData';
import { PageResult, User } from '../types';

interface AdminUsersSectionProps {
  currentUserId: string;
}

type LoadStatus = 'loading' | 'error' | 'ready';

export const AdminUsersSection: React.FC<AdminUsersSectionProps> = ({ currentUserId }) => {
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [page, setPage] = useState<PageResult<User> | null>(null);
  const [pagina, setPagina] = useState(1);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadUsers = useCallback(() => {
    setStatus('loading');
    getUsers(pagina)
      .then((loadedPage) => {
        setPage(loadedPage);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [pagina]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleToggleRole = async (user: User) => {
    setActionError(null);
    try {
      const updatedUser = await updateUserRole(user.id, user.papel === USER_ROLES.admin ? USER_ROLES.usuario : USER_ROLES.admin);
      setPage((previous) =>
        previous
          ? { ...previous, items: previous.items.map((item) => (item.id === updatedUser.id ? updatedUser : item)) }
          : previous
      );
    } catch (error) {
      setActionError(error instanceof ApiError ? error.message : 'Não foi possível alterar o papel.');
    }
  };

  if (status === 'loading') return <AdminStatusMessage message="Carregando usuários..." />;
  if (status === 'error' || !page) {
    return <AdminStatusMessage message="Não foi possível carregar os usuários." onRetry={loadUsers} />;
  }
  if (page.items.length === 0) return <AdminStatusMessage message="Nenhum usuário cadastrado." />;

  return (
    <div className="space-y-4">
      {actionError && <p role="alert" className="text-xs text-brand-accent">{actionError}</p>}
      <ul className="divide-y divide-brand-border rounded-xl bg-brand-surface border border-brand-border">
        {page.items.map((user) => {
          const isAdmin = user.papel === USER_ROLES.admin;
          const isCurrentUser = user.id === currentUserId;
          const RoleIcon = isAdmin ? ShieldCheck : UserRound;
          return (
            <li key={user.id} className="p-3 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-text truncate">
                  {user.nome} {isCurrentUser && <span className="text-xs text-brand-text-soft">(você)</span>}
                </p>
                <p className="text-xs text-brand-text-soft truncate">{user.email}</p>
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${isAdmin ? 'bg-brand-primary text-white' : 'bg-brand-bg text-brand-text-soft border border-brand-border'}`}>
                <RoleIcon className="w-3.5 h-3.5" />
                <span>{isAdmin ? 'Administrador' : 'Usuário'}</span>
              </span>
              <button
                type="button"
                onClick={() => handleToggleRole(user)}
                disabled={isCurrentUser}
                className="px-3 py-1.5 rounded-lg bg-brand-bg border border-brand-border text-xs text-brand-text-soft hover:text-brand-text disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              >
                {isAdmin ? 'Tornar usuário' : 'Tornar administrador'}
              </button>
            </li>
          );
        })}
      </ul>
      <AdminPagination pagina={page.pagina} totalPaginas={page.totalPaginas} onChangePage={setPagina} />
    </div>
  );
};
