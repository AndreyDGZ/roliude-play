import { BehindTheScenesItem, Professional, UserRole } from '../types';

export const MUNICIPALITIES_LIST = [
  'Cabaceiras',
  'Campina Grande',
  'João Pessoa',
  'Cajazeiras',
  'Sousa',
  'Santa Luzia / Serra do Talhado',
  'Lagoa Seca',
  'Pocinhos',
  'Parelhas / Seridó (Divisa PB/RN)',
  'Recife',
  'Contagem',
  'Rio de Janeiro e Sertão'
];

export const STATES_LIST = [
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' }
];

export const GENRES_LIST = [
  'Todos',
  'Comédia Regional',
  'Cordel & Épico',
  'Documentário',
  'Drama',
  'Curta-Metragem',
  'Ficção Científica',
  'Suspense',
  'Memória & Identidade',
  'Mulheres no Audiovisual',
  'Estrada / Road Movie'
];

export const PROFESSIONAL_ROLES: Professional['funcoes'] = [
  'Diretor(a)',
  'Ator/Atriz',
  'Roteirista',
  'Produtor(a)',
  'Diretor(a) de Fotografia',
  'Compositor(a)'
];

export const BEHIND_THE_SCENES_TYPES: { value: BehindTheScenesItem['tipo']; label: string }[] = [
  { value: 'making_of', label: 'Making of' },
  { value: 'entrevista', label: 'Entrevista' },
  { value: 'minidoc', label: 'Minidoc' },
  { value: 'depoimento', label: 'Depoimento' },
  { value: 'curiosidade', label: 'Curiosidade' },
  { value: 'galeria_fotos', label: 'Galeria de fotos' }
];

export const USER_ROLES = {
  usuario: 'USUARIO',
  admin: 'ADMIN'
} as const satisfies Record<string, UserRole>;
