# Conteúdo de referência: fluxo de cadastro

Conteúdo extraído do protótipo standalone `rolliúde-play tela cadastro/` antes de sua remoção
(reorganização de repositório). Ainda não foi integrado ao fluxo real em
`Rolliude-front/src/pages/Cadastro.tsx`, que hoje só coleta nome/e-mail/senha.
Integrar este conteúdo exige trabalho de feature própria, fora do escopo de uma limpeza
de repositório: o modelo `Usuario` no `Rolliude-backend/prisma/schema.prisma` não tem
campos de estado/município/perfil, então seria necessária uma migration nova, campos na
API e no formulário.

## Texto de Termos de Uso e Privacidade

1. **Apresentação e Missão** — O Rolliúde Play é uma plataforma cultural e audiovisual
   brasileira concebida para a valorização, difusão e preservação do cinema nacional e
   regional, sob o lema "O cinema da nossa terra na sua tela." Projeto desenvolvido no
   âmbito acadêmico pelo Centro Universitário de Patos (UNIFIP) - Curso de Análise e
   Desenvolvimento de Sistemas (ADS).
2. **Proteção de Dados e Segurança (RNF01 / LGPD)** — Em estrita conformidade com os
   requisitos de segurança de software e as diretrizes da Lei Geral de Proteção de Dados
   (LGPD):
   - As senhas de acesso são criptografadas com hash irreversível, nunca sendo salvas em
     texto simples.
   - Os dados cadastrais (nome, e-mail, estado e município) destinam-se exclusivamente à
     personalização do acervo e recomendações regionais do catálogo.
   - Nenhum dado pessoal é comercializado ou compartilhado com terceiros sem
     consentimento explícito.
3. **Perfis e Curadoria Cultural** — O usuário pode definir seu perfil como espectador,
   cinéfilo, profissional do audiovisual ou produtora. As produções exibidas respeitam os
   direitos autorais e de propriedade intelectual dos cineastas, coletivos e produtoras
   parceiras.
4. **Direitos do Usuário** — O usuário poderá a qualquer momento solicitar a atualização,
   retificação ou exclusão permanente de sua conta e histórico de navegação através das
   configurações de perfil.

## Opções de perfil de usuário

- Espectador / Amante de Cinema (`espectador`)
- Cinéfilo (Cinema Brasileiro & Independente) (`cinefilo`)
- Profissional do Audiovisual (Direção, Ator, Produção) (`profissional`)
- Produtora / Coletivo Cultural (`produtora`)
- Pesquisador / Estudante Universitário (`pesquisador`)

## Estados brasileiros por região

| UF | Nome | Região |
|---|---|---|
| PB | Paraíba | Nordeste |
| PE | Pernambuco | Nordeste |
| RN | Rio Grande do Norte | Nordeste |
| CE | Ceará | Nordeste |
| BA | Bahia | Nordeste |
| AL | Alagoas | Nordeste |
| MA | Maranhão | Nordeste |
| PI | Piauí | Nordeste |
| SE | Sergipe | Nordeste |
| AC | Acre | Norte |
| AP | Amapá | Norte |
| AM | Amazonas | Norte |
| PA | Pará | Norte |
| RO | Rondônia | Norte |
| RR | Roraima | Norte |
| TO | Tocantins | Norte |
| DF | Distrito Federal | Centro-Oeste |
| GO | Goiás | Centro-Oeste |
| MT | Mato Grosso | Centro-Oeste |
| MS | Mato Grosso do Sul | Centro-Oeste |
| ES | Espírito Santo | Sudeste |
| MG | Minas Gerais | Sudeste |
| RJ | Rio de Janeiro | Sudeste |
| SP | São Paulo | Sudeste |
| PR | Paraná | Sul |
| RS | Rio Grande do Sul | Sul |
| SC | Santa Catarina | Sul |
