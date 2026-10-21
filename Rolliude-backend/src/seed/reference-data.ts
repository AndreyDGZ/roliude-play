import { RegiaoBrasil } from '@prisma/client';

export interface StateSeed {
  uf: string;
  nome: string;
  regiao: RegiaoBrasil;
  municipios: string[];
}

export const GENRE_NAMES = [
  'Ação',
  'Animação',
  'Aventura',
  'Comédia',
  'Documentário',
  'Drama',
  'Experimental',
  'Ficção científica',
  'Musical',
  'Romance',
  'Suspense',
  'Terror'
];

export const STATE_SEEDS: StateSeed[] = [
  { uf: 'AC', nome: 'Acre', regiao: 'NORTE', municipios: ['Rio Branco'] },
  { uf: 'AL', nome: 'Alagoas', regiao: 'NORDESTE', municipios: ['Maceió'] },
  { uf: 'AP', nome: 'Amapá', regiao: 'NORTE', municipios: ['Macapá'] },
  { uf: 'AM', nome: 'Amazonas', regiao: 'NORTE', municipios: ['Manaus'] },
  { uf: 'BA', nome: 'Bahia', regiao: 'NORDESTE', municipios: ['Salvador'] },
  { uf: 'CE', nome: 'Ceará', regiao: 'NORDESTE', municipios: ['Fortaleza'] },
  { uf: 'DF', nome: 'Distrito Federal', regiao: 'CENTRO_OESTE', municipios: ['Brasília'] },
  { uf: 'ES', nome: 'Espírito Santo', regiao: 'SUDESTE', municipios: ['Vitória'] },
  { uf: 'GO', nome: 'Goiás', regiao: 'CENTRO_OESTE', municipios: ['Goiânia'] },
  { uf: 'MA', nome: 'Maranhão', regiao: 'NORDESTE', municipios: ['São Luís'] },
  { uf: 'MT', nome: 'Mato Grosso', regiao: 'CENTRO_OESTE', municipios: ['Cuiabá'] },
  { uf: 'MS', nome: 'Mato Grosso do Sul', regiao: 'CENTRO_OESTE', municipios: ['Campo Grande'] },
  { uf: 'MG', nome: 'Minas Gerais', regiao: 'SUDESTE', municipios: ['Belo Horizonte'] },
  { uf: 'PA', nome: 'Pará', regiao: 'NORTE', municipios: ['Belém'] },
  { uf: 'PB', nome: 'Paraíba', regiao: 'NORDESTE', municipios: ['Campina Grande', 'João Pessoa', 'Patos'] },
  { uf: 'PR', nome: 'Paraná', regiao: 'SUL', municipios: ['Curitiba'] },
  { uf: 'PE', nome: 'Pernambuco', regiao: 'NORDESTE', municipios: ['Recife'] },
  { uf: 'PI', nome: 'Piauí', regiao: 'NORDESTE', municipios: ['Teresina'] },
  { uf: 'RJ', nome: 'Rio de Janeiro', regiao: 'SUDESTE', municipios: ['Rio de Janeiro'] },
  { uf: 'RN', nome: 'Rio Grande do Norte', regiao: 'NORDESTE', municipios: ['Natal'] },
  { uf: 'RS', nome: 'Rio Grande do Sul', regiao: 'SUL', municipios: ['Porto Alegre'] },
  { uf: 'RO', nome: 'Rondônia', regiao: 'NORTE', municipios: ['Porto Velho'] },
  { uf: 'RR', nome: 'Roraima', regiao: 'NORTE', municipios: ['Boa Vista'] },
  { uf: 'SC', nome: 'Santa Catarina', regiao: 'SUL', municipios: ['Florianópolis'] },
  { uf: 'SP', nome: 'São Paulo', regiao: 'SUDESTE', municipios: ['São Paulo'] },
  { uf: 'SE', nome: 'Sergipe', regiao: 'NORDESTE', municipios: ['Aracaju'] },
  { uf: 'TO', nome: 'Tocantins', regiao: 'NORTE', municipios: ['Palmas'] }
];
