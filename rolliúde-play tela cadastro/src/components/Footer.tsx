import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer
      id="siteFooter"
      className="border-t border-[#e7ddc9] bg-[#f7f1e6] py-5 text-center text-xs text-[#6f6659]"
    >
      <div className="mx-auto max-w-4xl px-4 space-y-1">
        <p>© 2026 Rolliúde Play — Todos os direitos reservados.</p>
        <p className="text-[11px] text-[#8a8070]">
          Plataforma de preservação e difusão do cinema brasileiro e regional · UNIFIP Patos/Campina Grande - PB
        </p>
      </div>
    </footer>
  );
};
