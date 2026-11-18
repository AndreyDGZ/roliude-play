import React, { useState } from 'react';
import { Check, Pencil, Plus, X } from 'lucide-react';
import { AdminDeleteButton } from './AdminDeleteButton';
import { AdminStatusMessage } from './AdminStatusMessage';
import { PROFESSIONAL_ROLES } from '../data/mockData';
import { ApiError, ProfessionalPayload } from '../services/api';
import { Professional } from '../types';

interface AdminProfessionalsSectionProps {
  professionals: Professional[];
  onCreateProfessional: (payload: ProfessionalPayload) => Promise<void>;
  onUpdateProfessional: (professionalId: string, payload: ProfessionalPayload) => Promise<void>;
  onDeleteProfessional: (professionalId: string) => Promise<void>;
}

interface ProfessionalFormState {
  nome: string;
  funcoes: Professional['funcoes'];
  foto: string;
  cidadeNatal: string;
  estadoNatal: string;
  biografia: string;
  premiosText: string;
}

const EMPTY_FORM: ProfessionalFormState = {
  nome: '',
  funcoes: [],
  foto: '',
  cidadeNatal: '',
  estadoNatal: '',
  biografia: '',
  premiosText: ''
};

const fieldClassName =
  'w-full px-3 py-2 rounded-xl bg-brand-bg border border-brand-border text-xs text-brand-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent';
const labelClassName = 'block text-xs text-brand-text-muted mb-1 font-semibold';

function toFormState(professional: Professional): ProfessionalFormState {
  return {
    nome: professional.nome,
    funcoes: professional.funcoes,
    foto: professional.foto,
    cidadeNatal: professional.cidadeNatal,
    estadoNatal: professional.estadoNatal,
    biografia: professional.biografia,
    premiosText: professional.premios.join(', ')
  };
}

function toPayload(form: ProfessionalFormState): ProfessionalPayload {
  return {
    nome: form.nome.trim(),
    funcoes: form.funcoes,
    foto: form.foto.trim(),
    cidadeNatal: form.cidadeNatal.trim(),
    estadoNatal: form.estadoNatal.trim(),
    biografia: form.biografia.trim(),
    premios: form.premiosText
      .split(',')
      .map((premio) => premio.trim())
      .filter((premio) => premio.length > 0)
  };
}

export const AdminProfessionalsSection: React.FC<AdminProfessionalsSectionProps> = ({
  professionals,
  onCreateProfessional,
  onUpdateProfessional,
  onDeleteProfessional
}) => {
  const [form, setForm] = useState<ProfessionalFormState | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateField = <Field extends keyof ProfessionalFormState>(field: Field, value: ProfessionalFormState[Field]) => {
    setForm((previous) => (previous ? { ...previous, [field]: value } : previous));
  };

  const handleOpenForm = (professional?: Professional) => {
    setErrorMessage(null);
    setEditingId(professional?.id ?? null);
    setForm(professional ? toFormState(professional) : EMPTY_FORM);
  };

  const handleCloseForm = () => {
    setForm(null);
    setEditingId(null);
  };

  const handleToggleRole = (role: Professional['funcoes'][number]) => {
    if (!form) return;
    const nextRoles = form.funcoes.includes(role)
      ? form.funcoes.filter((currentRole) => currentRole !== role)
      : [...form.funcoes, role];
    updateField('funcoes', nextRoles);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form) return;
    if (form.funcoes.length === 0) {
      setErrorMessage('Selecione ao menos uma função.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    try {
      const payload = toPayload(form);
      if (editingId) {
        await onUpdateProfessional(editingId, payload);
      } else {
        await onCreateProfessional(payload);
      }
      handleCloseForm();
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : 'Não foi possível salvar o profissional.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (professionalId: string) => {
    setErrorMessage(null);
    try {
      await onDeleteProfessional(professionalId);
    } catch {
      setErrorMessage('Não foi possível remover o profissional.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => handleOpenForm()}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-accent text-white text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          <Plus className="w-4 h-4" />
          <span>Novo profissional</span>
        </button>
      </div>

      {errorMessage && <p role="alert" className="text-xs text-brand-accent">{errorMessage}</p>}

      {form && (
        <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-brand-surface border border-brand-border space-y-3">
          <h3 className="text-sm font-bold font-display text-brand-text">
            {editingId ? 'Editar profissional' : 'Cadastrar profissional'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="professional-nome" className={labelClassName}>Nome</label>
              <input id="professional-nome" type="text" required value={form.nome} onChange={(event) => updateField('nome', event.target.value)} className={fieldClassName} />
            </div>
            <div>
              <label htmlFor="professional-foto" className={labelClassName}>URL da foto</label>
              <input id="professional-foto" type="url" required value={form.foto} onChange={(event) => updateField('foto', event.target.value)} className={fieldClassName} />
            </div>
            <div>
              <label htmlFor="professional-cidade" className={labelClassName}>Cidade natal</label>
              <input id="professional-cidade" type="text" required value={form.cidadeNatal} onChange={(event) => updateField('cidadeNatal', event.target.value)} className={fieldClassName} />
            </div>
            <div>
              <label htmlFor="professional-estado" className={labelClassName}>Estado natal</label>
              <input id="professional-estado" type="text" required value={form.estadoNatal} onChange={(event) => updateField('estadoNatal', event.target.value)} className={fieldClassName} />
            </div>
          </div>
          <fieldset>
            <legend className={labelClassName}>Funções</legend>
            <div className="flex flex-wrap gap-2">
              {PROFESSIONAL_ROLES.map((role) => (
                <label key={role} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-bg border border-brand-border text-xs text-brand-text-soft">
                  <input type="checkbox" checked={form.funcoes.includes(role)} onChange={() => handleToggleRole(role)} className="accent-brand-primary" />
                  <span>{role}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="professional-biografia" className={labelClassName}>Biografia</label>
            <textarea id="professional-biografia" rows={3} required value={form.biografia} onChange={(event) => updateField('biografia', event.target.value)} className={fieldClassName} />
          </div>
          <div>
            <label htmlFor="professional-premios" className={labelClassName}>Prêmios (separados por vírgula)</label>
            <input id="professional-premios" type="text" value={form.premiosText} onChange={(event) => updateField('premiosText', event.target.value)} className={fieldClassName} />
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

      {professionals.length === 0 ? (
        <AdminStatusMessage message="Nenhum profissional cadastrado." />
      ) : (
        <ul className="divide-y divide-brand-border rounded-xl bg-brand-surface border border-brand-border">
          {professionals.map((professional) => (
            <li key={professional.id} className="p-3 flex items-center gap-3">
              <img src={professional.foto} alt={`Foto de ${professional.nome}`} className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-text truncate">{professional.nome}</p>
                <p className="text-xs text-brand-text-soft truncate">{professional.funcoes.join(', ')}</p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenForm(professional)}
                aria-label={`Editar ${professional.nome}`}
                className="px-2.5 py-1.5 rounded-lg bg-brand-bg border border-brand-border text-brand-text-soft hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <AdminDeleteButton itemLabel={professional.nome} onConfirm={() => handleDelete(professional.id)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
