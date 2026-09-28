import React from 'react';
import { X, ShieldCheck, Film, BookOpen } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="termsModalBackdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="termsModalContent"
        className="card-rolliude max-h-[85vh] w-full max-w-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#e7ddc9] bg-[#f2eadb] px-6 py-4">
          <div className="flex items-center gap-2 text-[#241d16]">
            <ShieldCheck className="h-5 w-5 text-[#c2452b]" />
            <h3 className="font-bold text-lg text-[#241d16]">Termos de Uso e Privacidade</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#6f6659] hover:bg-[#e7ddc9] hover:text-[#241d16] transition-colors"
            aria-label="Fechar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 text-sm text-[#241d16] space-y-4">
          <section className="space-y-1.5">
            <h4 className="font-bold text-[#c2452b] flex items-center gap-1.5">
              <Film className="h-4 w-4" /> 1. Apresentação e Missão
            </h4>
            <p className="text-[#6f6659] leading-relaxed">
              O <strong>Rolliúde Play</strong> é uma plataforma cultural e audiovisual brasileira concebida para a valorização, difusão e preservação do cinema nacional e regional, sob o lema <em>"O cinema da nossa terra na sua tela."</em> Projeto desenvolvido no âmbito acadêmico pelo Centro Universitário de Patos (UNIFIP) - Curso de Análise e Desenvolvimento de Sistemas (ADS).
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-[#c2452b] flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> 2. Proteção de Dados e Segurança (RNF01 / LGPD)
            </h4>
            <p className="text-[#6f6659] leading-relaxed">
              Em estrita conformidade com os requisitos de segurança de software e as diretrizes da Lei Geral de Proteção de Dados (LGPD):
            </p>
            <ul className="list-disc pl-5 text-[#6f6659] space-y-1">
              <li>As senhas de acesso são criptografadas com hash irreversível, nunca sendo salvas em texto simples.</li>
              <li>Os dados cadastrais (nome, e-mail, estado e município) destinam-se exclusivamente à personalização do acervo e recomendações regionais do catálogo.</li>
              <li>Nenhum dado pessoal é comercializado ou compartilhado com terceiros sem consentimento explícito.</li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-[#c2452b] flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" /> 3. Perfis e Curadoria Cultural
            </h4>
            <p className="text-[#6f6659] leading-relaxed">
              O usuário pode definir seu perfil como espectador, cinéfilo, profissional do audiovisual ou produtora. As produções exibidas respeitam os direitos autorais e de propriedade intelectual dos cineastas, coletivos e produtoras parceiras.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-[#c2452b]">4. Direitos do Usuário</h4>
            <p className="text-[#6f6659] leading-relaxed">
              O usuário poderá a qualquer momento solicitar a atualização, retificação ou exclusão permanente de sua conta e histórico de navegação através das configurações de perfil.
            </p>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-[#e7ddc9] bg-[#f7f1e6] px-6 py-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#c2452b] px-4 py-2 text-xs font-bold text-white hover:bg-[#a23a24] transition-colors"
          >
            Entendido e Concordo
          </button>
        </div>
      </div>
    </div>
  );
};
