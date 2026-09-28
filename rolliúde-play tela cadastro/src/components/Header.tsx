import React from 'react';
import { ROLLIUDE_LOGO_SRC } from '../assets/logo';
import { AuthView } from '../types';

interface HeaderProps {
  currentView: AuthView;
  onSelectView: (view: AuthView) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onSelectView }) => {
  return (
    <header
      id="siteHeader"
      className="border-b border-[#e7ddc9] bg-gradient-to-b from-[#f2eadb] to-[#f7f1e6] px-4 py-3 sm:px-6 sm:py-4"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => onSelectView('register')}
          className="flex cursor-pointer items-center justify-center transition-opacity hover:opacity-95 focus:outline-none"
          title="Rolliúde Play - O cinema da nossa terra na sua tela"
        >
          <img
            src={ROLLIUDE_LOGO_SRC}
            alt="Rolliúde Play"
            className="h-16 w-auto sm:h-20"
          />
        </button>

        {/* Navigation switcher to toggle between Cadastro and Login */}
        <nav
          id="authNavTabs"
          aria-label="Alternar entre cadastro e login"
          className="flex items-center rounded-lg border border-[#e7ddc9] bg-[#f7f1e6] p-1 text-sm font-semibold shadow-inner"
        >
          <button
            type="button"
            id="navTabRegister"
            onClick={() => onSelectView('register')}
            className={`rounded-md px-3.5 py-1.5 transition-all ${
              currentView === 'register'
                ? 'bg-[#c2452b] text-white shadow-sm'
                : 'text-[#6f6659] hover:text-[#241d16]'
            }`}
          >
            Cadastrar
          </button>
          <button
            type="button"
            id="navTabLogin"
            onClick={() => onSelectView('login')}
            className={`rounded-md px-3.5 py-1.5 transition-all ${
              currentView === 'login'
                ? 'bg-[#c2452b] text-white shadow-sm'
                : 'text-[#6f6659] hover:text-[#241d16]'
            }`}
          >
            Entrar
          </button>
        </nav>
      </div>
    </header>
  );
};
