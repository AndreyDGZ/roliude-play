import { useState } from 'react';
import { AuthView } from './types';
import { Header } from './components/Header';
import { RegisterForm } from './components/RegisterForm';
import { LoginForm } from './components/LoginForm';
import { Footer } from './components/Footer';
import { TermsModal } from './components/TermsModal';

export default function App() {
  const [currentView, setCurrentView] = useState<AuthView>('register');
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f1e6] text-[#241d16]">
      {/* Top Header with Rolliúde Play Logo */}
      <Header
        currentView={currentView}
        onSelectView={(view) => setCurrentView(view)}
      />

      {/* Main Content Area */}
      <main
        id="mainAuthContent"
        className="flex flex-1 items-center justify-center px-4 py-10 sm:py-14"
      >
        {currentView === 'register' ? (
          <RegisterForm
            onNavigateToLogin={() => setCurrentView('login')}
            onOpenTerms={() => setIsTermsOpen(true)}
          />
        ) : (
          <LoginForm
            onNavigateToRegister={() => setCurrentView('register')}
          />
        )}
      </main>

      {/* Site Footer */}
      <Footer />

      {/* Terms and Privacy Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
    </div>
  );
}
