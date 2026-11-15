import React from 'react';

interface LogoProps {
  variant?: 'full' | 'compact' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSlogan = true,
  className = ''
}) => {
  const sizeConfig = {
    sm: {
      hatWidth: 42,
      hatHeight: 24,
      titleSize: 'text-xl tracking-wider',
      playSize: 'text-xs tracking-[0.25em]',
      sloganSize: 'text-[10px]',
      playTriangleSize: 'w-3 h-3.5',
    },
    md: {
      hatWidth: 62,
      hatHeight: 34,
      titleSize: 'text-2xl md:text-3xl tracking-wider',
      playSize: 'text-sm md:text-base tracking-[0.3em]',
      sloganSize: 'text-xs md:text-sm',
      playTriangleSize: 'w-4 h-4',
    },
    lg: {
      hatWidth: 90,
      hatHeight: 48,
      titleSize: 'text-4xl md:text-5xl tracking-wider',
      playSize: 'text-lg md:text-xl tracking-[0.35em]',
      sloganSize: 'text-sm md:text-base',
      playTriangleSize: 'w-5 h-5 md:w-6 md:h-6',
    },
    xl: {
      hatWidth: 120,
      hatHeight: 64,
      titleSize: 'text-5xl md:text-7xl tracking-wider',
      playSize: 'text-2xl md:text-3xl tracking-[0.35em]',
      sloganSize: 'text-base md:text-lg',
      playTriangleSize: 'w-7 h-7 md:w-8 md:h-8',
    }
  }[size];

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      {/* Container do Nome com Chapéu */}
      <div className="relative flex flex-col items-center">
        {/* Chapéu de Couro Cangaceiro / Vaqueiro sobre a letra R */}
        <div 
          className="absolute -top-3.5 sm:-top-5 -left-3 sm:-left-4 z-20 pointer-events-none transition-transform hover:rotate-2"
          style={{ width: `${sizeConfig.hatWidth}px`, height: `${sizeConfig.hatHeight}px` }}
        >
          <svg
            viewBox="0 0 140 76"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-md"
          >
            {/* Abas e corpo do chapéu de couro sertanejo */}
            <path
              d="M10 54C22 36 48 12 76 10C104 8 126 22 134 46C138 58 132 64 122 66C104 70 82 72 56 68C30 64 12 60 10 54Z"
              fill="#A26236"
              stroke="#431D08"
              strokeWidth="3.5"
            />
            {/* Copa e dobras de couro */}
            <path
              d="M32 46C42 26 62 16 82 17C100 18 116 29 122 46C108 52 74 53 32 46Z"
              fill="#854823"
              stroke="#341404"
              strokeWidth="2.5"
            />
            {/* Tira de couro do queixo com pespontos */}
            <path
              d="M36 48C56 54 84 54 116 48C114 56 90 60 62 60C44 60 36 54 36 48Z"
              fill="#6A3617"
              stroke="#2B1204"
              strokeWidth="2"
            />
            {/* Ilhós e cravos de metal típicos */}
            <circle cx="48" cy="53" r="2.5" fill="#E2C99B" stroke="#4B2810" strokeWidth="1" />
            <circle cx="62" cy="54" r="2.5" fill="#E2C99B" stroke="#4B2810" strokeWidth="1" />
            <circle cx="76" cy="54" r="2.5" fill="#E2C99B" stroke="#4B2810" strokeWidth="1" />
            <circle cx="90" cy="54" r="2.5" fill="#E2C99B" stroke="#4B2810" strokeWidth="1" />
            <circle cx="104" cy="53" r="2.5" fill="#E2C99B" stroke="#4B2810" strokeWidth="1" />
            {/* Estrelas do Cangaço no chapéu */}
            <path
              d="M58 32L60 36L64 36L61 38L62 42L58 40L54 42L55 38L52 36L56 36Z"
              fill="#EADBB6"
              stroke="#582C0E"
              strokeWidth="1"
            />
            <path
              d="M78 30L80 34L84 34L81 36L82 40L78 38L74 40L75 36L72 34L76 34Z"
              fill="#EADBB6"
              stroke="#582C0E"
              strokeWidth="1"
            />
            <path
              d="M98 33L100 37L104 37L101 39L102 43L98 41L94 43L95 39L92 37L96 37Z"
              fill="#EADBB6"
              stroke="#582C0E"
              strokeWidth="1"
            />
            {/* Barbiço/amarras de couro caindo dos lados */}
            <path d="M12 56C8 62 10 70 14 74" stroke="#5C2D0C" strokeWidth="3" strokeLinecap="round" />
            <path d="M130 50C134 56 132 64 128 70" stroke="#5C2D0C" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        {/* ROLLIÚDE Woodcut / Cordel lettering */}
        <div className="relative pt-1">
          <span 
            className={`font-black uppercase text-[#1B0F0A] dark:text-[#F8F1E5] font-['Cinzel'] ${sizeConfig.titleSize}`}
            style={{
              textShadow: '2px 2px 0px #C2410C, 4px 4px 0px rgba(0,0,0,0.3)',
              letterSpacing: '0.08em',
              lineHeight: 1.1
            }}
          >
            ROLLIÚDE
          </span>
        </div>

        {/* PLAY com triângulo vermelho substituindo o 'A' */}
        <div className="flex items-center justify-center font-bold font-sans text-neutral-900 dark:text-neutral-100 mt-0.5">
          <span className={sizeConfig.playSize}>PL</span>
          {/* Triângulo Play Vermelho Terracota */}
          <span className="inline-flex items-center justify-center mx-0.5 transform translate-y-[-1px]">
            <svg
              className={`${sizeConfig.playTriangleSize} text-[#C2410C]`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </span>
          <span className={sizeConfig.playSize}>Y</span>
        </div>
      </div>

      {/* Slogan Oficial */}
      {showSlogan && (
        <p className={`mt-1 font-medium text-neutral-600 dark:text-amber-100/80 italic ${sizeConfig.sloganSize}`}>
          O cinema da nossa terra na sua tela.
        </p>
      )}
    </div>
  );
};
