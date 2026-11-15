import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw, 
  Subtitles, 
  MapPin,
  Film
} from 'lucide-react';
import { Movie, BehindTheScenesItem } from '../types';

interface VideoPlayerModalProps {
  item: Movie | BehindTheScenesItem | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  item,
  onClose
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (!item) return null;

  const isMovie = 'classificacaoIndicativa' in item;
  const videoUrl = isMovie ? (item as Movie).videoUrl : (item as BehindTheScenesItem).videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  const title = item.titulo;
  const subtitle = isMovie 
    ? `${(item as Movie).localizacao.municipio} — ${(item as Movie).localizacao.estadoSigla} • ${(item as Movie).ano}`
    : `Espaço Bastidores & Direção • ${(item as BehindTheScenesItem).duracao || ''}`;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullScreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen().catch(err => console.error(err));
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Keyboard controls & auto-hide controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg select-none"
      onClick={onClose}
    >
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between"
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlay}
          className="w-full h-full object-contain cursor-pointer"
        />

        {/* Top Header Overlay */}
        <div className={`absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 z-30 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#C2410C] flex items-center justify-center text-white">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-['Cinzel'] tracking-wide">
                {title}
              </h3>
              <p className="text-xs text-[#E2C99B] flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-[#EA580C]" />
                <span>{subtitle}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition"
            title="Fechar exibição"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simulated Accessibility Subtitles Overlay (RNF07) */}
        {subtitlesEnabled && (
          <div className="absolute bottom-20 inset-x-0 flex justify-center pointer-events-none px-4 z-20">
            <div className="bg-black/85 text-amber-100 border border-amber-900/40 px-4 py-1.5 rounded-lg text-xs sm:text-sm max-w-xl text-center shadow-lg font-medium">
              [Áudio original em Português • Sons regionais do sertão e trilha tradicional]
            </div>
          </div>
        )}

        {/* Bottom Controls Bar */}
        <div className={`absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 space-y-2 z-30 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          {/* Progress Timeline */}
          <div className="flex items-center space-x-3">
            <span className="text-[11px] font-mono text-[#D8B490] w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-[#422212] rounded-lg appearance-none cursor-pointer accent-[#EA580C]"
            />
            <span className="text-[11px] font-mono text-[#A67E5D] w-10">
              {formatTime(duration)}
            </span>
          </div>

          {/* Buttons row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-4">
              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-[#C2410C] hover:bg-[#EA580C] text-white flex items-center justify-center transition shadow-md"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
              </button>

              {/* Volume */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="text-[#D8B490] hover:text-white transition"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-[#422212] rounded-lg appearance-none cursor-pointer accent-[#EA580C] hidden sm:block"
                />
              </div>

              {/* Subtitles (Acessibilidade) */}
              <button
                onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold border transition ${
                  subtitlesEnabled
                    ? 'bg-[#EA580C] text-white border-[#EA580C]'
                    : 'bg-[#29150D] text-[#A67E5D] border-[#4E2716] hover:text-white'
                }`}
                title="Alternar Legendas e Audiodescrição (CC)"
              >
                <Subtitles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">CC</span>
              </button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-3">
              <span className="text-[11px] text-[#A67E5D] hidden md:inline">
                Rolliude Play Cinema Player
              </span>
              <button
                onClick={toggleFullScreen}
                className="text-[#D8B490] hover:text-white transition p-1.5"
                title="Tela Cheia"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
