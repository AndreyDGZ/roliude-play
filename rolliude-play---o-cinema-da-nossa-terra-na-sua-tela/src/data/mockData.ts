import { Movie, Professional, BehindTheScenesItem } from '../types';

export const INITIAL_PROFESSIONALS: Professional[] = [
  {
    id: 'prof-marcelia-cartaxo',
    nome: 'Marcélia Cartaxo',
    funcoes: ['Ator/Atriz', 'Diretor(a)'],
    foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    cidadeNatal: 'Cajazeiras',
    estadoNatal: 'Paraíba',
    biografia: 'Consagrada atriz e realizadora paraibana, Marcélia Cartaxo conquistou o prestigioso Urso de Prata de Melhor Atriz no Festival Internacional de Cinema de Berlim (1986) por sua atuação histórica como Macabéa em "A Hora da Estrela". É um dos maiores expoentes da interpretação cinematográfica brasileira, com forte presença no cinema nordestino independente.',
    premios: [
      'Urso de Prata de Melhor Atriz - Festival de Berlim (1986)',
      'Melhor Atriz - Festival de Cinema de Gramado (2019)',
      'Melhor Atriz - Festival de Brasília do Cinema Brasileiro (1985)',
      'Homenageada com Troféu Pedra Bonita - Fest Aruanda'
    ],
    filmesIds: ['filme-rebento', 'filme-auto-compadecida', 'filme-hora-estrela', 'filme-pacarrete']
  },
  {
    id: 'prof-linduarte-noronha',
    nome: 'Linduarte Noronha',
    funcoes: ['Diretor(a)', 'Roteirista'],
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    cidadeNatal: 'Ferreiros / João Pessoa',
    estadoNatal: 'Paraíba',
    biografia: 'Cineasta, jornalista e professor paraibano, Linduarte Noronha foi pioneiro fundamental do cinema paraibano e uma das maiores inspirações estéticas do Cinema Novo brasileiro com a obra-prima documental "Aruanda" (1960), filmada nos remanescentes do quilombo do Talhado na Serra do Cariri paraibano.',
    premios: [
      'Prêmio Especial do Júri - Festival de Cinema do Uruguai (1962)',
      'Patrono Histórico do Fest Aruanda do Audiovisual Brasileiro',
      'Ordem do Mérito Cultural do Brasil'
    ],
    filmesIds: ['filme-aruanda', 'filme-salario-morte']
  },
  {
    id: 'prof-zezita-matos',
    nome: 'Zezita Matos',
    funcoes: ['Ator/Atriz'],
    foto: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=600&q=80',
    cidadeNatal: 'Campina Grande',
    estadoNatal: 'Paraíba',
    biografia: 'Nascida em Campina Grande, Zezita Matos é reverenciada como a "Primeira Dama do Teatro e do Audiovisual Paraibano". Com mais de cinco décadas de trajetória nas artes cênicas, atuou em filmes emblemáticos como "O Céu de Suely", "Baixio das Bestas", "Deserto Particular" e diversas produções filmadas no Cariri e em Campina Grande.',
    premios: [
      'Prêmio de Melhor Atriz Coadjuvante - Festival de Gramado',
      'Troféu Cidade de Campina Grande - Festival Comunicurtas',
      'Comenda Talento Cultural Paraibano'
    ],
    filmesIds: ['filme-rebento', 'filme-homem-engoliu-pb', 'filme-beico-estrada']
  },
  {
    id: 'prof-kleber-mendonca',
    nome: 'Kleber Mendonça Filho',
    funcoes: ['Diretor(a)', 'Roteirista', 'Produtor(a)'],
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    cidadeNatal: 'Recife',
    estadoNatal: 'Pernambuco',
    biografia: 'Cineasta e crítico brasileiro, Kleber Mendonça Filho é uma das vozes contemporâneas mais celebradas do cinema mundial. Suas obras, gravadas no Nordeste do Brasil, como "Bacurau", "Aquarius" e "O Som ao Redor", receberam premiações internacionais em Cannes e festivais globais.',
    premios: [
      'Prêmio do Júri - Festival de Cannes (2019, Bacurau)',
      'Melhor Direção - Festival de Lima',
      'Grande Prêmio do Cinema Brasileiro'
    ],
    filmesIds: ['filme-bacurau', 'filme-som-ao-redor']
  },
  {
    id: 'prof-marcus-vilar',
    nome: 'Marcus Vilar',
    funcoes: ['Diretor(a)', 'Roteirista'],
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    cidadeNatal: 'Campina Grande',
    estadoNatal: 'Paraíba',
    biografia: 'Importante cineasta e agitador cultural de Campina Grande, Marcus Vilar dirigiu curtas e longas que marcaram o renascimento do audiovisual paraibano nos anos 90 e 2000, incluindo "A Canga" e "O Homem que Engoliu a Paraíba", além de ser figura central no cenário universitário e cineclubista paraibano.',
    premios: [
      'Melhor Curta de Ficção - Cine PE Festival do Audiovisual',
      'Melhor Direção de Arte - Festival de Gramado',
      'Destaque Regional - Festival Comunicurtas UEPB'
    ],
    filmesIds: ['filme-canga', 'filme-homem-engoliu-pb']
  },
  {
    id: 'prof-matheus-nachtergaele',
    nome: 'Matheus Nachtergaele',
    funcoes: ['Ator/Atriz', 'Diretor(a)'],
    foto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    cidadeNatal: 'São Paulo',
    estadoNatal: 'São Paulo',
    biografia: 'Um dos mais premiados atores da cinematografia brasileira, Matheus Nachtergaele imortalizou o personagem João Grilo em "O Auto da Compadecida", inteiramente rodado na cidade de Cabaceiras (Roliúde Nordestina), no Cariri paraibano. Atuou também em marcos como "Central do Brasil" e "Cidade de Deus".',
    premios: [
      'Grande Prêmio do Cinema Brasileiro - Melhor Ator',
      'Prêmio APCA de Melhor Ator',
      'Melhor Ator - Festival do Rio'
    ],
    filmesIds: ['filme-auto-compadecida', 'filme-central-brasil']
  },
  {
    id: 'prof-torquato-joel',
    nome: 'Torquato Joel',
    funcoes: ['Diretor(a)', 'Roteirista'],
    foto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    cidadeNatal: 'Campina Grande',
    estadoNatal: 'Paraíba',
    biografia: 'Diretor e roteirista paraibano com expressiva carreira no curta-metragem e no documentário lírico. Vencedor de múltiplos prêmios com "Passadouro", "Moacir: Arte Bruta" e "A Alma do Gesto", Torquato captura a poética do sertão paraibano com rigor visual e sensibilidade antropológica singular.',
    premios: [
      'Melhor Curta-Metragem - Festival de Brasília do Cinema Brasileiro',
      'Melhor Direção - Festival de Cinema de Tiradentes',
      'Troféu Candango de Contribuição Artística'
    ],
    filmesIds: ['filme-passadouro', 'filme-moacir-arte-bruta']
  }
];

export const INITIAL_BEHIND_THE_SCENES: BehindTheScenesItem[] = [
  {
    id: 'bts-cabaceiras-lajedo',
    filmeId: 'filme-auto-compadecida',
    titulo: 'Cabaceiras: Como a Cidade se Tornou a Roliúde Nordestina',
    tipo: 'making_of',
    descricao: 'Imersão no Lajedo de Pai Mateus e no casario histórico de Cabaceiras (PB). Entenda a logística de filmagem que transformou o pequeno município do Cariri paraibano na capital cinematográfica do sertão brasileiro, cenário de mais de 30 longas e séries nacionais.',
    duracao: '18 min',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    entrevistado: 'Guel Arraes e moradores de Cabaceiras',
    dataPublicacao: '15/08/2026'
  },
  {
    id: 'bts-aruanda-restauracao',
    filmeId: 'filme-aruanda',
    titulo: 'Restaurando Aruanda: O Resgate do Quilombo do Talhado',
    tipo: 'minidoc',
    descricao: 'Pesquisadores da Cinemateca Brasileira e cineastas de Campina Grande detalham o processo minucioso de telecinagem em 4K da película 16mm original gravada em 1960 por Linduarte Noronha na Serra do Talhado, Paraíba.',
    duracao: '24 min',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    entrevistado: 'Curadoria Fest Aruanda e Cinemateca Brasileira',
    dataPublicacao: '02/07/2026'
  },
  {
    id: 'bts-marcelia-entrevista',
    filmeId: 'filme-rebento',
    titulo: 'Marcélia Cartaxo: Da Poeira de Cajazeiras a Berlim',
    tipo: 'entrevista',
    descricao: 'Uma conversa intimista e potente com a atriz Marcélia Cartaxo gravada no Teatro Severino Cabral em Campina Grande, relembrando sua construção de personagens femininas sertanejas marcadas por dignidade e resistência.',
    duracao: '32 min',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    entrevistado: 'Marcélia Cartaxo',
    dataPublicacao: '18/06/2026'
  },
  {
    id: 'bts-trilha-cariri',
    filmeId: 'filme-homem-engoliu-pb',
    titulo: 'O Som do Sertão: Rabeca, Pífano e Zabumba no Cinema',
    tipo: 'depoimento',
    descricao: 'O processo de composição sonora e captação de áudio direto nas feiras livres de Campina Grande e na zona rural do Cariri paraibano. O encontro dos instrumentos tradicionais de raiz com sintetizadores do cinema moderno.',
    duracao: '14 min',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    entrevistado: 'Mestres de Pífano de Campina Grande',
    dataPublicacao: '29/05/2026'
  },
  {
    id: 'bts-bacurau-cenografia',
    filmeId: 'filme-bacurau',
    titulo: 'Construindo Bacurau: O Sertão Futurista no Povoado de Barra',
    tipo: 'making_of',
    descricao: 'Registros inéditos de produção no povoado de Barra, município de Parelhas (Seridó potiguar, divisa com a Paraíba). Como a comunidade local foi integrada aos departamentos de arte, figuração e maquiagem.',
    duracao: '22 min',
    thumbnailUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    entrevistado: 'Kleber Mendonça Filho e Juliano Dornelles',
    dataPublicacao: '11/04/2026'
  }
];

export const INITIAL_MOVIES: Movie[] = [
  {
    id: 'filme-auto-compadecida',
    titulo: 'O Auto da Compadecida',
    tituloOriginal: 'O Auto da Compadecida',
    sinopse: 'As aventuras e desventuras dos sertanejos João Grilo e Chicó, dois amigos humildes que sobrevivem à dura realidade do sertão paraibano aplicando golpes inteligentes em coronéis, no clero e até no temido cangaceiro Severino de Aracaju. Uma celebração triunfal do teatro de cordel de Ariano Suassuna filmada no coração de Cabaceiras (a Roliúde Nordestina).',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    ano: 2000,
    duracaoMinutos: 104,
    genero: ['Comédia Regional', 'Cordel & Épico', 'Aventura'],
    classificacaoIndicativa: '12',
    localizacao: {
      pais: 'Brasil',
      regiao: 'Nordeste',
      estado: 'Paraíba',
      estadoSigla: 'PB',
      municipio: 'Cabaceiras'
    },
    direcao: ['Guel Arraes'],
    roteiro: ['Guel Arraes', 'Adriana Falcão', 'João Falcão'],
    producao: ['Daniel Filho', 'Globo Filmes'],
    elenco: [
      { id: 'c1', nome: 'Matheus Nachtergaele', personagem: 'João Grilo' },
      { id: 'c2', nome: 'Selton Mello', personagem: 'Chicó' },
      { id: 'c3', nome: 'Fernanda Montenegro', personagem: 'Nossa Senhora (A Compadecida)' },
      { id: 'c4', nome: 'Marco Nanini', personagem: 'Capitão Severino de Aracaju' },
      { id: 'c5', nome: 'Denise Fraga', personagem: 'Dora' },
      { id: 'c6', nome: 'Lima Duarte', personagem: 'Bispo' }
    ],
    fotografia: 'Félix Monti',
    trilhaSonora: 'Sá Grama e Antônio Madureira',
    produtora: 'Lereby Produções / Sony Pictures',
    premios: [
      'Grande Prêmio do Cinema Brasileiro - Melhor Direção, Melhor Roteiro, Melhor Ator (Matheus Nachtergaele)',
      'Troféu APCA de Melhor Filme',
      'Filme Símbolo da Roliúde Nordestina em Cabaceiras - PB'
    ],
    curiosidades: [
      'As filmagens ocorreram integralmente em Cabaceiras (PB), preservando a arquitetura do século XIX do município.',
      'A célebre cena do julgamento no além teve o cenário inspirado nas formações rochosas do Lajedo de Pai Mateus.',
      'Deu origem ao título turístico oficial de Cabaceiras como a "Roliúde Nordestina".'
    ],
    destaqueCuradoria: true,
    curadoriaTag: 'Marco da Roliúde Nordestina',
    popularidade: 98,
    notaMedia: 4.9,
    avaliacoesCount: 412,
    reviews: [
      {
        id: 'r1',
        autor: 'Tiago Lucena',
        cidade: 'Campina Grande - PB',
        nota: 5,
        data: '12/03/2026',
        comentario: 'O maior clássico do cinema e da dramaturgia nordestina. O povo de Cabaceiras e do Cariri paraibano respiram arte graças a essa obra inesquecível!'
      },
      {
        id: 'r2',
        autor: 'Marina Dantas',
        cidade: 'João Pessoa - PB',
        nota: 5,
        data: '18/02/2026',
        comentario: 'A fotografia no Lajedo e a adaptação do texto de Ariano Suassuna são perfeição pura. Orgulho da Paraíba!'
      }
    ],
    bastidoresIds: ['bts-cabaceiras-lajedo']
  },
  {
    id: 'filme-aruanda',
    titulo: 'Aruanda',
    tituloOriginal: 'Aruanda',
    sinopse: 'Um marco fundador do cinema documental moderno brasileiro e pré-Cinema Novo. Linduarte Noronha sobe a Serra do Talhado, no sertão do Cariri da Paraíba, para registrar com crueza poética a vida dos remanescentes quilombolas da comunidade Olho d\'Água da Serra do Talhado, seu trabalho de olaria em barro seco e o cotidiano de dignidade e sobrevivência.',
    posterUrl: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    ano: 1960,
    duracaoMinutos: 22,
    genero: ['Documentário', 'Memória & Identidade', 'Acervo Histórico'],
    classificacaoIndicativa: 'Livre',
    localizacao: {
      pais: 'Brasil',
      regiao: 'Nordeste',
      estado: 'Paraíba',
      estadoSigla: 'PB',
      municipio: 'Santa Luzia / Serra do Talhado'
    },
    direcao: ['Linduarte Noronha'],
    roteiro: ['Linduarte Noronha', 'Vladimir Carvalho'],
    producao: ['Linduarte Noronha'],
    elenco: [
      { id: 'ca1', nome: 'Comunidade Quilombola do Talhado', personagem: 'Eles mesmos' }
    ],
    fotografia: 'Rucker Vieira',
    trilhaSonora: 'Sons diretos do sertão e cantos tradicionais',
    produtora: 'Produção Independente Paraibana',
    premios: [
      'Eleito pela ABRACCINE um dos 100 melhores filmes brasileiros de todos os tempos',
      'Inspirador direto do movimento Cinema Novo (citado por Glauber Rocha)',
      'Homenageado oficial no Fest Aruanda'
    ],
    curiosidades: [
      'Glauber Rocha, após assistir a Aruanda na Bahia, declarou que o curta indicava os rumos estéticos do novo cinema nacional.',
      'Vladimir Carvalho e João Ramiro Mello participaram ativamente da concepção como assistentes.',
      'Foi filmado com uma câmera 16mm alugada e pouquíssimos metros de negativo.'
    ],
    destaqueCuradoria: true,
    curadoriaTag: 'Patrimônio do Cinema Paraibano',
    popularidade: 94,
    notaMedia: 4.8,
    avaliacoesCount: 189,
    reviews: [
      {
        id: 'r3',
        autor: 'Prof. Cláudio Bezerra',
        cidade: 'Recife - PE',
        nota: 5,
        data: '10/01/2026',
        comentario: 'Uma aula definitiva de cinema moderno. Essencial para qualquer estudante de audiovisual entender a gênese da estética da fome.'
      }
    ],
    bastidoresIds: ['bts-aruanda-restauracao']
  },
  {
    id: 'filme-homem-engoliu-pb',
    titulo: 'O Homem que Engoliu a Paraíba',
    tituloOriginal: 'O Homem que Engoliu a Paraíba',
    sinopse: 'Narrativa vigorosa do cinema campinense que mescla ficção e crônica política e cultural. Ambientado nos anos de transição urbana e política na Paraíba, acompanha personagens que transitam entre a Feira Central de Campina Grande e os confins do Agreste paraibano, tecendo mitos sertanejos e realismo agudo.',
    posterUrl: 'https://images.unsplash.com/photo-1533613220915-609f661a6fe1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    ano: 2008,
    duracaoMinutos: 78,
    genero: ['Drama', 'Ficção', 'Política & Sertão'],
    classificacaoIndicativa: '14',
    localizacao: {
      pais: 'Brasil',
      regiao: 'Nordeste',
      estado: 'Paraíba',
      estadoSigla: 'PB',
      municipio: 'Campina Grande'
    },
    direcao: ['Marcus Vilar'],
    roteiro: ['Marcus Vilar', 'Everaldo Vasconcelos'],
    producao: ['Cinemaneios Produções', 'Coletivo Campina'],
    elenco: [
      { id: 'ch1', nome: 'Zezita Matos', personagem: 'Dona Benvinda' },
      { id: 'ch2', nome: 'Nanego Lira', personagem: 'Severo' },
      { id: 'ch3', nome: 'Soia Lira', personagem: 'Josefa' }
    ],
    fotografia: 'Beto Martins',
    trilhaSonora: 'Mestre Biliu de Campina e Carlos Malta',
    produtora: 'Cinemaneios',
    premios: [
      'Melhor Longa Regional - Festival Comunicurtas UEPB',
      'Prêmio Especial do Júri - Festival de Cinema de Triunfo',
      'Melhor Atriz (Zezita Matos) - Fest Aruanda'
    ],
    curiosidades: [
      'Locações históricas filmadas nos armazéns da antiga Rede Ferroviária Federal de Campina Grande.',
      'Contou com participação especial de poetas de bancada da Feira Central de Campina Grande.'
    ],
    destaqueCuradoria: true,
    curadoriaTag: 'Cine Campina Grande',
    popularidade: 86,
    notaMedia: 4.6,
    avaliacoesCount: 97,
    reviews: [
      {
        id: 'r4',
        autor: 'Aline Medeiros',
        cidade: 'Campina Grande - PB',
        nota: 5,
        data: '04/02/2026',
        comentario: 'Ver a nossa Campina Grande retratada na tela grande com tanto esmero é emocionante demais. O elenco da terra dá um show!'
      }
    ],
    bastidoresIds: ['bts-trilha-cariri']
  },
  {
    id: 'filme-bacurau',
    titulo: 'Bacurau',
    tituloOriginal: 'Bacurau',
    sinopse: 'Num futuro recente, os moradores de Bacurau, um pequeno povoado no sertão do Nordeste brasileiro, descobrem que sua comunidade desapareceu subitamente dos mapas digitais por satélite. Logo em seguida, começam a ser alvos de uma violenta e misteriosa invasão estrangeira, despertando a coragem ancestral e armada de seu povo.',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    ano: 2019,
    duracaoMinutos: 131,
    genero: ['Ficção Científica', 'Suspense', 'Cinema de Resistência'],
    classificacaoIndicativa: '16',
    localizacao: {
      pais: 'Brasil',
      regiao: 'Nordeste',
      estado: 'Pernambuco / Rio Grande do Norte',
      estadoSigla: 'RN/PE',
      municipio: 'Parelhas / Seridó (Divisa PB/RN)'
    },
    direcao: ['Kleber Mendonça Filho', 'Juliano Dornelles'],
    roteiro: ['Kleber Mendonça Filho', 'Juliano Dornelles'],
    producao: ['Emilie Lesclaux', 'Said Ben Said'],
    elenco: [
      { id: 'b1', nome: 'Bárbara Colen', personagem: 'Teresa' },
      { id: 'b2', nome: 'Sônia Braga', personagem: 'Domingas' },
      { id: 'b3', nome: 'Thomas Aquino', personagem: 'Pacote / Acácio' },
      { id: 'b4', nome: 'Silvero Pereira', personagem: 'Lunga' },
      { id: 'b5', nome: 'Udo Kier', personagem: 'Michael' }
    ],
    fotografia: 'Pedro Sotero',
    trilhaSonora: 'Mateus Alves e Tomaz Alves Souza (com canções de Gal Costa e Sérgio Ricardo)',
    produtora: 'Cinemascópio / SBS Productions',
    premios: [
      'Prêmio do Júri no Festival de Cannes (2019)',
      'Grande Prêmio do Cinema Brasileiro (Melhor Filme, Direção, Roteiro)',
      'Melhor Filme Internacional no Festival de Sitges'
    ],
    curiosidades: [
      'Filmado no povoado de Barra, na região do Seridó, bem próximo à fronteira com a Paraíba.',
      'A arma histórica utilizada pelo povoado pertencia ao acervo de memórias do cangaço e de lutas sertanejas.',
      'Tornou-se um fenômeno de bilheteria e debate político em todo o território nacional.'
    ],
    destaqueCuradoria: true,
    curadoriaTag: 'Cinema de Resistência',
    popularidade: 97,
    notaMedia: 4.8,
    avaliacoesCount: 520,
    reviews: [
      {
        id: 'r5',
        autor: 'Lucas Farias',
        cidade: 'Natal - RN',
        nota: 5,
        data: '15/01/2026',
        comentario: 'Uma obra-prima absoluta do cinema mundial. O sertão como centro de resistência e dignidade.'
      }
    ],
    bastidoresIds: ['bts-bacurau-cenografia']
  },
  {
    id: 'filme-rebento',
    titulo: 'Rebento',
    tituloOriginal: 'Rebento',
    sinopse: 'Após cometer um ato desesperado que altera os rumos de sua família, uma mulher do sertão paraibano caminha solitária pela paisagem árida sem dizer uma só palavra. Uma obra intensa de silêncios, vento e força estética visceral estrelada magistralmente por Zezita Matos.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    ano: 2018,
    duracaoMinutos: 96,
    genero: ['Drama', 'Mulheres no Audiovisual', 'Autoral'],
    classificacaoIndicativa: '14',
    localizacao: {
      pais: 'Brasil',
      regiao: 'Nordeste',
      estado: 'Paraíba',
      estadoSigla: 'PB',
      municipio: 'João Pessoa / Cariri PB'
    },
    direcao: ['André Morais'],
    roteiro: ['André Morais'],
    producao: ['Maurício Silva', 'André Morais'],
    elenco: [
      { id: 'rb1', nome: 'Zezita Matos', personagem: 'A Mulher' },
      { id: 'rb2', nome: 'Marcélia Cartaxo', personagem: 'Mãe de Menina' },
      { id: 'rb3', nome: 'Fernando Teixeira', personagem: 'O Homem do Carro' },
      { id: 'rb4', nome: 'Ingrid Trigueiro', personagem: 'A Vizinha' }
    ],
    fotografia: 'João Carlos Beltrão',
    trilhaSonora: 'André Morais',
    produtora: 'Filmes do Beco / TeleImage',
    premios: [
      'Melhor Direção no Festival Internacional de Cinema de Girona (Espanha)',
      'Melhor Atriz (Zezita Matos) no Fest Aruanda',
      'Prêmio Abraccine de Melhor Longa de Estreia'
    ],
    curiosidades: [
      'A protagonista não profere uma única linha de diálogo falado durante os 96 minutos do longa-metragem.',
      'Gravado nas paisagens secas do Cariri da Paraíba com equipe 100% paraibana.'
    ],
    destaqueCuradoria: false,
    curadoriaTag: 'Cinema Paraibano Contemporâneo',
    popularidade: 82,
    notaMedia: 4.7,
    avaliacoesCount: 64,
    reviews: [
      {
        id: 'r6',
        autor: 'Daniela Queiroz',
        cidade: 'João Pessoa - PB',
        nota: 5,
        data: '19/02/2026',
        comentario: 'A interpretação de Zezita Matos é arrebatadora. O silêncio comunica mais do que mil palavras.'
      }
    ],
    bastidoresIds: ['bts-marcelia-entrevista']
  },
  {
    id: 'filme-canga',
    titulo: 'A Canga',
    tituloOriginal: 'A Canga',
    sinopse: 'Num vilarejo esquecido do sertão seco da Paraíba, um velho patriarca autoritário e à beira da loucura obriga seus familiares a se atrelarem a uma pesada canga de arar boi, forçando-os a revolver a terra infértil sob sol escaldante. Um dos curtas-metragens mais premiados e cultuados da história do audiovisual paraibano.',
    posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1533613220915-609f661a6fe1?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    ano: 2001,
    duracaoMinutos: 13,
    genero: ['Curta-Metragem', 'Drama', 'Cordel & Épico'],
    classificacaoIndicativa: '14',
    localizacao: {
      pais: 'Brasil',
      regiao: 'Nordeste',
      estado: 'Paraíba',
      estadoSigla: 'PB',
      municipio: 'Campina Grande / Pocinhos'
    },
    direcao: ['Marcus Vilar'],
    roteiro: ['Marcus Vilar', 'Baseado no conto de Waldemar José Solha'],
    producao: ['Cinemaneios Produções'],
    elenco: [
      { id: 'cg1', nome: 'W. J. Solha', personagem: 'O Patriarca' },
      { id: 'cg2', nome: 'Everaldo Vasconcelos', personagem: 'O Filho Mais Velho' },
      { id: 'cg3', nome: 'Nanego Lira', personagem: 'Filho Menor' }
    ],
    fotografia: 'Beto Martins',
    trilhaSonora: 'Carlos Malta e Quinteto da Paraíba',
    produtora: 'Cinemaneios',
    premios: [
      'Melhor Curta de Ficção no Festival de Gramado (Kikito de Ouro)',
      'Melhor Curta no Festival de Cinema de Brasília',
      'Grande Prêmio no Festival Internacional de Curtas do Rio de Janeiro'
    ],
    curiosidades: [
      'Baseado no conto do escritor paraibano W. J. Solha, que também interpreta o pai.',
      'Considerado pela crítica um dos maiores curtas-metragens brasileiros de todos os tempos.'
    ],
    destaqueCuradoria: true,
    curadoriaTag: 'Curtas Premiados de Campina Grande',
    popularidade: 91,
    notaMedia: 4.9,
    avaliacoesCount: 145,
    reviews: [
      {
        id: 'r7',
        autor: 'Gabriel Vianna',
        cidade: 'Campina Grande - PB',
        nota: 5,
        data: '22/01/2026',
        comentario: 'Uma pedrada poética! Marcus Vilar e o mestre W.J. Solha conseguiram sintetizar séculos de opressão patriarcal em apenas 13 minutos.'
      }
    ]
  },
  {
    id: 'filme-cinema-aspirinas',
    titulo: 'Cinema, Aspirinas e Urubus',
    tituloOriginal: 'Cinema, Aspirinas e Urubus',
    sinopse: 'Em 1942, em plena Segunda Guerra Mundial, Johann, um jovem alemão pacifista que fugiu do exército, viaja pelas estradas de poeira do sertão nordestino vendendo aspirinas e projetando filmes promocionais para vilarejos isolados. No caminho, ele dá carona a Ranulpho, um sertanejo sonhador que busca uma vida melhor no litoral.',
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    ano: 2005,
    duracaoMinutos: 99,
    genero: ['Drama', 'Estrada / Road Movie', 'Histórico'],
    classificacaoIndicativa: '14',
    localizacao: {
      pais: 'Brasil',
      regiao: 'Nordeste',
      estado: 'Paraíba / Pernambuco',
      estadoSigla: 'PB/PE',
      municipio: 'Cabaceiras e Picuí (PB)'
    },
    direcao: ['Marcelo Gomes'],
    roteiro: ['Marcelo Gomes', 'Paulo Caldas', 'Karim Aïnouz'],
    producao: ['Sara Silveira', 'Maria Ionescu'],
    elenco: [
      { id: 'ca1', nome: 'Peter Ketnath', personagem: 'Johann' },
      { id: 'ca2', nome: 'João Miguel', personagem: 'Ranulpho' },
      { id: 'ca3', nome: 'Hermila Guedes', personagem: 'Jovelina' }
    ],
    fotografia: 'Mauro Pinheiro Jr.',
    trilhaSonora: 'Tomaz Alves Souza',
    produtora: 'Dezenove Som e Imagens',
    premios: [
      'Prêmio do Ministério da Educação Nacional da França - Festival de Cannes (Un Certain Regard)',
      'Representante oficial do Brasil no Oscar de Melhor Filme Estrangeiro',
      'Melhor Filme no Festival de Cinema do Rio'
    ],
    curiosidades: [
      'Grande parte das filmagens externas de sertão árido aconteceram nas cercanias de Cabaceiras e Picuí, na Paraíba.',
      'Revelou o talento do ator baiano João Miguel para o grande circuito cinematográfico.'
    ],
    destaqueCuradoria: true,
    curadoriaTag: 'Gravado na Roliúde Nordestina',
    popularidade: 93,
    notaMedia: 4.8,
    avaliacoesCount: 230,
    reviews: [
      {
        id: 'r8',
        autor: 'Mariana Fontes',
        cidade: 'Sousa - PB',
        nota: 5,
        data: '14/03/2026',
        comentario: 'O contraste da aspirina e do caminhão com o lajedo é de uma delicadeza ímpar. O cinema nordestino em seu auge lírico.'
      }
    ]
  },
  {
    id: 'filme-passadouro',
    titulo: 'Passadouro',
    tituloOriginal: 'Passadouro',
    sinopse: 'Um curta-metragem lírico sobre as passagens da vida, a solidão das estradas vicinais do sertão da Paraíba e a memória de um caminhante que reencontra antigos rastros do tempo. Obra premiada dirigida pelo campinense Torquato Joel.',
    posterUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    ano: 2004,
    duracaoMinutos: 15,
    genero: ['Curta-Metragem', 'Poético / Experimental', 'Memória & Identidade'],
    classificacaoIndicativa: 'Livre',
    localizacao: {
      pais: 'Brasil',
      regiao: 'Nordeste',
      estado: 'Paraíba',
      estadoSigla: 'PB',
      municipio: 'Campina Grande / Cariri PB'
    },
    direcao: ['Torquato Joel'],
    roteiro: ['Torquato Joel'],
    producao: ['Coletivo Paraíba Audiovisual'],
    elenco: [
      { id: 'ps1', nome: 'Buda Lira', personagem: 'O Peregrino' },
      { id: 'ps2', nome: 'Servilio de Holanda', personagem: 'O Carroceiro' }
    ],
    fotografia: 'Beto Martins',
    trilhaSonora: 'Eli-Eri Moura e Quinteto da Paraíba',
    produtora: 'Laboratório Cinema UEPB',
    premios: [
      'Melhor Curta no Festival de Brasília do Cinema Brasileiro',
      'Troféu Sol de Ouro no Fest Aruanda de João Pessoa'
    ],
    curiosidades: [
      'O diretor Torquato Joel utilizou técnicas de luz natural do amanhecer do Cariri paraibano.',
      'A trilha sonora foi executada pelo renomado Quinteto da Paraíba com arranjos eletroacústicos.'
    ],
    destaqueCuradoria: false,
    curadoriaTag: 'Curtas Premiados de Campina Grande',
    popularidade: 79,
    notaMedia: 4.6,
    avaliacoesCount: 52,
    reviews: []
  },
  {
    id: 'filme-som-ao-redor',
    titulo: 'O Som ao Redor',
    tituloOriginal: 'O Som ao Redor',
    sinopse: 'A vida numa rua de classe média na zona sul do Recife toma um rumo inesperado após a chegada de uma milícia de segurança privada. A presença desses homens traz tranquilidade para alguns e uma tensão sufocante para outros, expondo a arquitetura da paranoia urbana brasileira e resquícios do coronelismo dos canaviais.',
    posterUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    ano: 2012,
    duracaoMinutos: 131,
    genero: ['Drama', 'Suspense', 'Cidade & Periferia'],
    classificacaoIndicativa: '16',
    localizacao: {
      pais: 'Brasil',
      regiao: 'Nordeste',
      estado: 'Pernambuco',
      estadoSigla: 'PE',
      municipio: 'Recife'
    },
    direcao: ['Kleber Mendonça Filho'],
    roteiro: ['Kleber Mendonça Filho'],
    producao: ['Emilie Lesclaux'],
    elenco: [
      { id: 'sr1', nome: 'Irandhir Santos', personagem: 'Clodoaldo' },
      { id: 'sr2', nome: 'Gustavo Jahn', personagem: 'João' },
      { id: 'sr3', nome: 'Maeve Jinkings', personagem: 'Bia' },
      { id: 'sr4', nome: 'W. J. Solha', personagem: 'Francisco' }
    ],
    fotografia: 'Pedro Sotero e Fabricio Tadeu',
    trilhaSonora: 'DJ Dolores',
    produtora: 'Cinemascópio',
    premios: [
      'Eleito pelo The New York Times um dos 10 melhores filmes do ano no mundo',
      'Melhor Filme e Melhor Direção no Festival do Rio',
      'Prêmio da Crítica FIPRESCI no Festival de Roterdã'
    ],
    curiosidades: [
      'O renomado artista paraibano W. J. Solha foi escalado como o patriarca "Seu Francisco", senhor de engenho dono dos imóveis da rua.',
      'O design de som é a espinha dorsal de todo o suspense do filme.'
    ],
    destaqueCuradoria: true,
    curadoriaTag: 'Cinema Nordestino Aclamado',
    popularidade: 95,
    notaMedia: 4.8,
    avaliacoesCount: 380,
    reviews: [
      {
        id: 'r9',
        autor: 'Renan Barreto',
        cidade: 'Recife - PE',
        nota: 5,
        data: '11/02/2026',
        comentario: 'Uma dissecação brilhante das tensões de classe no Brasil com o melhor trabalho de som da história do nosso cinema.'
      }
    ]
  },
  {
    id: 'filme-central-brasil',
    titulo: 'Central do Brasil',
    tituloOriginal: 'Central do Brasil',
    sinopse: 'Dora é uma professora aposentada que ganha a vida escrevendo cartas para analfabetos na estação Central do Brasil, no Rio de Janeiro. Quando a mãe de Josué, um menino de nove anos, morre atropelada, Dora decide acompanhar o garoto em uma jornada até Bom Jesus do Norte, no interior do sertão nordestino, em busca de seu pai desaparecido.',
    posterUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    ano: 1998,
    duracaoMinutos: 110,
    genero: ['Drama', 'Estrada / Road Movie', 'Clássico Nacional'],
    classificacaoIndicativa: '12',
    localizacao: {
      pais: 'Brasil',
      regiao: 'Sudeste',
      estado: 'Rio de Janeiro / Sertão',
      estadoSigla: 'RJ',
      municipio: 'Rio de Janeiro e Sertão'
    },
    direcao: ['Walter Salles'],
    roteiro: ['João Emanuel Carneiro', 'Marcos Bernstein'],
    producao: ['Arthur Cohn', 'Martine de Clermont-Tonnerre'],
    elenco: [
      { id: 'cb1', nome: 'Fernanda Montenegro', personagem: 'Dora' },
      { id: 'cb2', nome: 'Vinícius de Oliveira', personagem: 'Josué' },
      { id: 'cb3', nome: 'Marília Pêra', personagem: 'Irene' },
      { id: 'cb4', nome: 'Matheus Nachtergaele', personagem: 'Isaías' },
      { id: 'cb5', nome: 'Othon Bastos', personagem: 'César' }
    ],
    fotografia: 'Walter Carvalho (paraibano)',
    trilhaSonora: 'Antonio Pinto e Jaques Morelenbaum',
    produtora: 'VideoFilmes',
    premios: [
      'Urso de Ouro de Melhor Filme no Festival de Cinema de Berlim',
      'Urso de Prata de Melhor Atriz para Fernanda Montenegro em Berlim',
      'Globo de Ouro de Melhor Filme Estrangeiro',
      'Duas indicações ao Oscar (Melhor Filme Estrangeiro e Melhor Atriz)'
    ],
    curiosidades: [
      'A magistral direção de fotografia é assinada pelo paraibano Walter Carvalho, nascido em João Pessoa.',
      'As cenas sertanejas capturam a religiosidade e as romarias tradicionais do interior nordestino.'
    ],
    destaqueCuradoria: true,
    curadoriaTag: 'Obras Históricas & Acervo',
    popularidade: 99,
    notaMedia: 4.9,
    avaliacoesCount: 650,
    reviews: [
      {
        id: 'r10',
        autor: 'Beatriz Vasconcelos',
        cidade: 'Campina Grande - PB',
        nota: 5,
        data: '08/01/2026',
        comentario: 'A fotografia de Walter Carvalho capta a alma da nossa terra. Obra atemporal da identidade brasileira.'
      }
    ]
  },
  {
    id: 'filme-marte-um',
    titulo: 'Marte Um',
    tituloOriginal: 'Marte Um',
    sinopse: 'A família Martins vive o cotidiano da periferia de Contagem, Minas Gerais. Entre a rotina de trabalho e as tensões sociopolíticas, o filho caçula Deivinho alimenta em segredo o sonho de se tornar astrofísico e participar de uma missão de colonização do planeta Marte, enquanto seu pai sonha em transformá-lo num astro do futebol.',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    ano: 2022,
    duracaoMinutos: 115,
    genero: ['Drama', 'Juventude e Sonhos', 'Cinema Independente'],
    classificacaoIndicativa: '16',
    localizacao: {
      pais: 'Brasil',
      regiao: 'Sudeste',
      estado: 'Minas Gerais',
      estadoSigla: 'MG',
      municipio: 'Contagem'
    },
    direcao: ['Gabriel Martins'],
    roteiro: ['Gabriel Martins'],
    producao: ['Thiago Macêdo Correia', 'Filmes de Plástico'],
    elenco: [
      { id: 'm1', nome: 'Cícero Lucas', personagem: 'Deivinho' },
      { id: 'm2', nome: 'Carlos Francisco', personagem: 'Wellington' },
      { id: 'm3', nome: 'Rejane Faria', personagem: 'Tércia' },
      { id: 'm4', nome: 'Camilla Damião', personagem: 'Eunice' }
    ],
    fotografia: 'Leonardo Feliciano',
    trilhaSonora: 'Marcos dos Santos',
    produtora: 'Filmes de Plástico',
    premios: [
      'Quatro prêmios no Festival de Gramado (incluindo Júri Popular e Roteiro)',
      'Representante oficial do Brasil no Oscar de Melhor Filme Internacional 2023',
      'Grande Prêmio do Cinema Brasileiro'
    ],
    curiosidades: [
      'Realizado pela produtora periférica independente "Filmes de Plástico", referência de descentralização do cinema brasileiro.',
      'Estreou com aclamação crítica no prestigiado Festival de Sundance.'
    ],
    destaqueCuradoria: false,
    curadoriaTag: 'Cinema Regional & Periferias',
    popularidade: 89,
    notaMedia: 4.8,
    avaliacoesCount: 160,
    reviews: []
  },
  {
    id: 'filme-beico-estrada',
    titulo: 'Beiço de Estrada',
    tituloOriginal: 'Beiço de Estrada',
    sinopse: 'Às margens de uma rodovia federal que corta a Paraíba, Madame Severina comanda um pequeno bar e bordel que serve de refúgio e ponto de parada para caminhoneiros, viajantes e trabalhadores rurais. Quando o progresso e a construção de um viaduto ameaçam desapropriar o local, o grupo precisa defender seu território de afeto e subsistência.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    ano: 2019,
    duracaoMinutos: 105,
    genero: ['Drama', 'Comédia Regional', 'Vidas à Margem'],
    classificacaoIndicativa: '16',
    localizacao: {
      pais: 'Brasil',
      regiao: 'Nordeste',
      estado: 'Paraíba',
      estadoSigla: 'PB',
      municipio: 'Campina Grande / Lagoa Seca'
    },
    direcao: ['Eliezer Rolim'],
    roteiro: ['Eliezer Rolim'],
    producao: ['Luz Boa Produções'],
    elenco: [
      { id: 'be1', nome: 'Mayana Neiva', personagem: 'Pérola' },
      { id: 'be2', nome: 'Zezita Matos', personagem: 'Madame Severina' },
      { id: 'be3', nome: 'Jackson Antunes', personagem: 'Caminhoneiro Miro' }
    ],
    fotografia: 'Beto Martins',
    trilhaSonora: 'Chico César',
    produtora: 'Luz Boa Produções Culturais',
    premios: [
      'Melhor Direção de Arte no Fest Aruanda',
      'Prêmio Especial do Júri - Festival de Cinema de Triunfo'
    ],
    curiosidades: [
      'Dirigido pelo saudoso dramaturgo e professor paraibano Eliezer Rolim.',
      'Canções originais compostas pelo paraibano Chico César expressam a poética da estrada.'
    ],
    destaqueCuradoria: false,
    curadoriaTag: 'Cine Paraíba em Foco',
    popularidade: 81,
    notaMedia: 4.5,
    avaliacoesCount: 78,
    reviews: []
  }
];

export const CURATED_LISTS = [
  {
    id: 'roliude-cabaceiras',
    titulo: 'Destaques da Roliúde Nordestina',
    subtitulo: 'Cabaceiras & Cariri Paraibano',
    tagline: 'Cenário mítico do cinema brasileiro com mais de 30 produções históricas no Lajedo de Pai Mateus',
    badge: 'Cabaceiras · PB'
  },
  {
    id: 'cinema-campina-jpa',
    titulo: 'Vozes de Campina Grande e João Pessoa',
    subtitulo: 'Da Rainha da Borborema à Capital Paraibana',
    tagline: 'Filmes, curtas e documentários que retratam a vida urbana, o agreste e as feiras paraibanas',
    badge: 'Campina Grande & JP'
  },
  {
    id: 'resistencia-sertao',
    titulo: 'Sertão, Cangaço & Resistência',
    subtitulo: 'Identidade e Luta Audiovisual',
    tagline: 'Narrativas que confrontam estereótipos e revelam a força política e ancestral da nossa gente',
    badge: 'Cinema de Resistência'
  },
  {
    id: 'acervo-memoria',
    titulo: 'Acervo Histórico e Memória Viva',
    subtitulo: 'De Aruanda (1960) aos Clássicos Nacionais',
    tagline: 'Obras fundamentais que fundaram a identidade do audiovisual brasileiro e regional',
    badge: 'Patrimônio Nacional'
  }
];

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
