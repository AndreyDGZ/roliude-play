import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Film, 
  MapPin, 
  Users, 
  Camera, 
  Music, 
  Sparkles, 
  RotateCcw,
  Check
} from 'lucide-react';
import { Movie, AgeRating, Region } from '../types';

interface AdminAddMovieModalProps {
  onClose: () => void;
  onAddMovie: (movie: Movie) => void;
  onResetToDefault: () => void;
}

export const AdminAddMovieModal: React.FC<AdminAddMovieModalProps> = ({
  onClose,
  onAddMovie,
  onResetToDefault
}) => {
  const [titulo, setTitulo] = useState('');
  const [sinopse, setSinopse] = useState('');
  const [municipio, setMunicipio] = useState('Campina Grande');
  const [estadoSigla, setEstadoSigla] = useState('PB');
  const [estado, setEstado] = useState('Paraíba');
  const [regiao, setRegiao] = useState<Region>('Nordeste');
  const [ano, setAno] = useState(2025);
  const [duracaoMinutos, setDuracaoMinutos] = useState(88);
  const [generoText, setGeneroText] = useState('Drama, Ficção');
  const [classificacao, setClassificacao] = useState<AgeRating>('12');
  const [direcao, setDirecao] = useState('Cineastas de Campina Grande');
  const [roteiro, setRoteiro] = useState('Coletivo Paraíba Audiovisual');
  const [producao, setProducao] = useState('Produtora Borborema');
  const [elencoText, setElencoText] = useState('Zezita Matos (Dona Carminha), Marcélia Cartaxo (Rosa)');
  const [fotografia, setFotografia] = useState('Walter Carvalho');
  const [trilhaSonora, setTrilhaSonora] = useState('Sivuca e Quinteto da Paraíba');
  const [curadoriaTag, setCuradoriaTag] = useState('Cinema Paraibano');
  const [posterUrl, setPosterUrl] = useState('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80');

  // Fast sample presets
  const applyPreset = (preset: 'campina' | 'cabaceiras' | 'doc') => {
    if (preset === 'campina') {
      setTitulo('O Trem das Memórias de Campina');
      setSinopse('Nas antigas oficinas da Estação Ferroviária de Campina Grande, velhos maquinistas e poetas do repente relembram os tempos de ouro em que o algodão e as canções viajavam sobre os trilhos da Borborema rumo a todo o Brasil.');
      setMunicipio('Campina Grande');
      setEstadoSigla('PB');
      setEstado('Paraíba');
      setRegiao('Nordeste');
      setAno(2024);
      setDuracaoMinutos(75);
      setGeneroText('Documentário, Memória & Identidade');
      setClassificacao('Livre');
      setDirecao('Marcus Vilar, Bertrand Lira');
      setRoteiro('Marcus Vilar');
      setProducao('UEPB Cine Lab');
      setElencoText('Mestre Biliu de Campina (Ele mesmo), Zezita Matos (Narradora)');
      setFotografia('Beto Martins');
      setTrilhaSonora('Mestre Biliu de Campina e Carlos Malta');
      setCuradoriaTag('Cine Campina Grande');
      setPosterUrl('https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80');
    } else if (preset === 'cabaceiras') {
      setTitulo('Vento das Pedras no Lajedo');
      setSinopse('No silêncio místico do Lajedo de Pai Mateus, em Cabaceiras, dois geólogos e uma rezadeira local descobrem inscrições rupestres esquecidas que desvendam segredos guardados há séculos sob as rochas do Cariri paraibano.');
      setMunicipio('Cabaceiras');
      setEstadoSigla('PB');
      setEstado('Paraíba');
      setRegiao('Nordeste');
      setAno(2025);
      setDuracaoMinutos(92);
      setGeneroText('Suspense, Cordel & Épico');
      setClassificacao('14');
      setDirecao('Torquato Joel');
      setRoteiro('Torquato Joel, W. J. Solha');
      setProducao('Roliúde Produções Cariri');
      setElencoText('Marcélia Cartaxo (Dona Sebastiana), Nanego Lira (Vicente)');
      setFotografia('Mauro Pinheiro Jr.');
      setTrilhaSonora('Quinteto de Cordas da Paraíba');
      setCuradoriaTag('Roliúde Nordestina');
      setPosterUrl('https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80');
    } else if (preset === 'doc') {
      setTitulo('Feira Central: O Universo em Campina');
      setSinopse('Um retrato imersivo da feira livre de Campina Grande, patrimônio imaterial brasileiro onde convergem farinheiros, repentistas, ervas medicinais, artigos de couro e a alma incontestável do povo nordestino.');
      setMunicipio('Campina Grande');
      setEstadoSigla('PB');
      setEstado('Paraíba');
      setRegiao('Nordeste');
      setAno(2026);
      setDuracaoMinutos(45);
      setGeneroText('Documentário, Cultura Popular');
      setClassificacao('Livre');
      setDirecao('Coletivo Comunicurtas');
      setRoteiro('Pesquisadores da Paraíba');
      setProducao('Cinema da Borborema');
      setElencoText('Feirantes de Campina Grande (Eles mesmos)');
      setFotografia('João Carlos Beltrão');
      setTrilhaSonora('Pífano e Sanfona Tradicionais');
      setCuradoriaTag('Patrimônio Cultural PB');
      setPosterUrl('https://images.unsplash.com/photo-1533613220915-609f661a6fe1?auto=format&fit=crop&w=800&q=80');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !sinopse.trim()) return;

    // Parse cast
    const castItems = elencoText.split(',').map((item, idx) => {
      const match = item.match(/(.+?)\s*\((.+?)\)/);
      if (match) {
        return { id: `c-${Date.now()}-${idx}`, nome: match[1].trim(), personagem: match[2].trim() };
      }
      return { id: `c-${Date.now()}-${idx}`, nome: item.trim(), personagem: 'Personagem' };
    });

    const newMovie: Movie = {
      id: `filme-custom-${Date.now()}`,
      titulo: titulo.trim(),
      sinopse: sinopse.trim(),
      posterUrl: posterUrl.trim(),
      backdropUrl: posterUrl.trim(),
      trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      ano: Number(ano),
      duracaoMinutos: Number(duracaoMinutos),
      genero: generoText.split(',').map(g => g.trim()),
      classificacaoIndicativa: classificacao,
      localizacao: {
        pais: 'Brasil',
        regiao,
        estado,
        estadoSigla,
        municipio: municipio.trim()
      },
      direcao: direcao.split(',').map(d => d.trim()),
      roteiro: roteiro.split(',').map(r => r.trim()),
      producao: producao.split(',').map(p => p.trim()),
      elenco: castItems,
      fotografia: fotografia.trim(),
      trilhaSonora: trilhaSonora.trim(),
      produtora: producao.trim(),
      premios: ['Obra catalogada com apoio da curadoria Rolliude Play'],
      curiosidades: ['Cadastrado via painel administrativo de gestão de acervo regional.'],
      destaqueCuradoria: true,
      curadoriaTag: curadoriaTag.trim() || 'Novidade no Catálogo',
      popularidade: 85,
      notaMedia: 4.8,
      avaliacoesCount: 1,
      reviews: []
    };

    onAddMovie(newMovie);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#170E09] border border-[#442315] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-[#F8F1E7]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#24130A] to-[#1A0E08] border-b border-[#3D2013] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-[#EA580C]" />
            <div>
              <h2 className="text-lg font-bold text-white font-['Cinzel']">
                Cadastrar Nova Obra no Catálogo
              </h2>
              <p className="text-xs text-[#A67E5D]">
                Gestão e enriquecimento do acervo do cinema brasileiro e regional
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/50 text-[#E5C9A4] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="bg-[#20110A] px-5 py-3 border-b border-[#361A0F] flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-[#C89D77] flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Preenchimento Rápido com Modelos Regionais:</span>
          </span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => applyPreset('campina')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#2E170E] hover:bg-[#3E1E12] text-[#FCD34D] border border-[#522915] transition"
            >
              Campina Grande
            </button>
            <button
              type="button"
              onClick={() => applyPreset('cabaceiras')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#2E170E] hover:bg-[#3E1E12] text-[#FCD34D] border border-[#522915] transition"
            >
              Cabaceiras / Cariri
            </button>
            <button
              type="button"
              onClick={() => applyPreset('doc')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#2E170E] hover:bg-[#3E1E12] text-[#FCD34D] border border-[#522915] transition"
            >
              Documentário Feira
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* Título & Pôster */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#A67E5D] mb-1 font-semibold">Título da Obra</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: O Canto das Lavadeiras do Cariri"
                required
                className="w-full px-3 py-2 rounded-xl bg-[#23130B] border border-[#442315] text-white focus:outline-none focus:border-[#EA580C]"
              />
            </div>
            <div>
              <label className="block text-[#A67E5D] mb-1 font-semibold">URL do Pôster / Imagem</label>
              <input
                type="url"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-[#23130B] border border-[#442315] text-white focus:outline-none focus:border-[#EA580C]"
              />
            </div>
          </div>

          {/* Sinopse */}
          <div>
            <label className="block text-[#A67E5D] mb-1 font-semibold">Sinopse Completa</label>
            <textarea
              rows={3}
              value={sinopse}
              onChange={(e) => setSinopse(e.target.value)}
              placeholder="Descreva a narrativa, temática regional e contextualização cultural..."
              required
              className="w-full px-3 py-2 rounded-xl bg-[#23130B] border border-[#442315] text-white focus:outline-none focus:border-[#EA580C]"
            />
          </div>

          {/* Hierarquia Geográfica */}
          <div className="p-3 rounded-xl bg-[#21120A] border border-[#3E2114] space-y-2">
            <span className="font-bold text-[#EA580C] uppercase tracking-wider block">
              Hierarquia Geográfica (País → Região → Estado → Município)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="block text-[#9E7B5D] text-[10px]">Região</label>
                <select
                  value={regiao}
                  onChange={(e) => setRegiao(e.target.value as Region)}
                  className="w-full px-2 py-1.5 rounded-lg bg-[#190D08] border border-[#3A1F13] text-white"
                >
                  <option value="Nordeste">Nordeste</option>
                  <option value="Sudeste">Sudeste</option>
                  <option value="Centro-Oeste">Centro-Oeste</option>
                  <option value="Norte">Norte</option>
                  <option value="Sul">Sul</option>
                </select>
              </div>
              <div>
                <label className="block text-[#9E7B5D] text-[10px]">Sigla Estado</label>
                <input
                  type="text"
                  value={estadoSigla}
                  onChange={(e) => setEstadoSigla(e.target.value.toUpperCase())}
                  className="w-full px-2 py-1.5 rounded-lg bg-[#190D08] border border-[#3A1F13] text-white"
                />
              </div>
              <div>
                <label className="block text-[#9E7B5D] text-[10px]">Estado por Extenso</label>
                <input
                  type="text"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg bg-[#190D08] border border-[#3A1F13] text-white"
                />
              </div>
              <div>
                <label className="block text-[#9E7B5D] text-[10px]">Município de Destaque</label>
                <input
                  type="text"
                  value={municipio}
                  onChange={(e) => setMunicipio(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg bg-[#190D08] border border-[#3A1F13] text-white font-medium"
                />
              </div>
            </div>
          </div>

          {/* Dados Técnicos: Ano, Duração, Gênero, Faixa */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[#A67E5D] mb-1">Ano</label>
              <input
                type="number"
                value={ano}
                onChange={(e) => setAno(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl bg-[#23130B] border border-[#442315] text-white"
              />
            </div>
            <div>
              <label className="block text-[#A67E5D] mb-1">Duração (minutos)</label>
              <input
                type="number"
                value={duracaoMinutos}
                onChange={(e) => setDuracaoMinutos(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl bg-[#23130B] border border-[#442315] text-white"
              />
            </div>
            <div>
              <label className="block text-[#A67E5D] mb-1">Classificação</label>
              <select
                value={classificacao}
                onChange={(e) => setClassificacao(e.target.value as AgeRating)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#23130B] border border-[#442315] text-white"
              >
                <option value="Livre">Livre</option>
                <option value="10">10 anos</option>
                <option value="12">12 anos</option>
                <option value="14">14 anos</option>
                <option value="16">16 anos</option>
              </select>
            </div>
            <div>
              <label className="block text-[#A67E5D] mb-1">Destaque Curadoria</label>
              <input
                type="text"
                value={curadoriaTag}
                onChange={(e) => setCuradoriaTag(e.target.value)}
                placeholder="Ex: Cinema Paraibano"
                className="w-full px-3 py-1.5 rounded-xl bg-[#23130B] border border-[#442315] text-white"
              />
            </div>
          </div>

          {/* Equipe Técnica */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[#A67E5D] mb-1">Diretor(a)</label>
              <input
                type="text"
                value={direcao}
                onChange={(e) => setDirecao(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#23130B] border border-[#442315] text-white"
              />
            </div>
            <div>
              <label className="block text-[#A67E5D] mb-1">Roteirista(s)</label>
              <input
                type="text"
                value={roteiro}
                onChange={(e) => setRoteiro(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#23130B] border border-[#442315] text-white"
              />
            </div>
            <div>
              <label className="block text-[#A67E5D] mb-1">Produtora</label>
              <input
                type="text"
                value={producao}
                onChange={(e) => setProducao(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#23130B] border border-[#442315] text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#A67E5D] mb-1">Elenco (Nome e Personagem em parênteses)</label>
            <input
              type="text"
              value={elencoText}
              onChange={(e) => setElencoText(e.target.value)}
              placeholder="Ex: Zezita Matos (Dona Carminha), Marcélia Cartaxo (Rosa)"
              className="w-full px-3 py-1.5 rounded-xl bg-[#23130B] border border-[#442315] text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A67E5D] mb-1">Direção de Fotografia</label>
              <input
                type="text"
                value={fotografia}
                onChange={(e) => setFotografia(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#23130B] border border-[#442315] text-white"
              />
            </div>
            <div>
              <label className="block text-[#A67E5D] mb-1">Trilha Sonora</label>
              <input
                type="text"
                value={trilhaSonora}
                onChange={(e) => setTrilhaSonora(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#23130B] border border-[#442315] text-white"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-[#381D11] flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onResetToDefault();
                onClose();
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#27140B] text-[#D8B490] hover:text-white border border-[#482515]"
              title="Restaurar acervo de exemplo inicial"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Restaurar Catálogo Padrão</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#20110A] text-[#B89271] hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#C2410C] hover:bg-[#EA580C] text-white font-bold flex items-center space-x-1.5 transition shadow-lg"
              >
                <Check className="w-4 h-4" />
                <span>Salvar no Catálogo</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
