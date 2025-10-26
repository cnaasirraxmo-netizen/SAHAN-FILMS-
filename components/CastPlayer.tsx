import React, { useState, useEffect, useRef } from 'react';
import { Movie } from '../types';
import {
  ChevronLeftIcon, PlayIcon, PauseIcon, Replay10Icon, Forward10Icon, VolumeUpIcon, VolumeOffIcon, CastIcon
} from './Icons';

const formatTime = (timeInSeconds: number) => {
  if (isNaN(timeInSeconds) || timeInSeconds < 0) {
    return '00:00';
  }
  const date = new Date(0);
  date.setSeconds(timeInSeconds);
  const timeString = date.toISOString().substr(11, 8);
  return timeString.startsWith('00:') ? timeString.substr(3) : timeString;
};

const CastPlayer: React.FC<{ movie: Movie; onClose: () => void; }> = ({ movie, onClose }) => {
  const playerRef = useRef<any>(null);
  const controllerRef = useRef<any>(null);

  const [isPaused, setIsPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [mediaInfo, setMediaInfo] = useState<any>(null);
  const [title, setTitle] = useState(movie.title);

  useEffect(() => {
    const castContext = window.cast.framework.CastContext.getInstance();
    const session = castContext.getCurrentSession();
    if (!session) {
      onClose();
      return;
    }

    const player = new window.cast.framework.RemotePlayer();
    const controller = new window.cast.framework.RemotePlayerController(player);
    playerRef.current = player;
    controllerRef.current = controller;

    const eventListener = () => {
      setIsPaused(player.isPaused);
      setCurrentTime(player.currentTime);
      setDuration(player.duration);
      setVolume(player.volumeLevel);
      setIsMuted(player.isMuted);
      if (player.mediaInfo) {
        setMediaInfo(player.mediaInfo);
        setTitle(player.mediaInfo.metadata.title);
      }
    };
    
    const eventTypes = Object.values(window.cast.framework.RemotePlayerEventType);
    eventTypes.forEach(event => {
        controller.addEventListener(event, eventListener);
    });

    eventListener(); // Initial state sync

    return () => {
      eventTypes.forEach(event => {
          controller.removeEventListener(event, eventListener);
      });
    };
  }, [onClose]);

  const handlePlayPause = () => controllerRef.current?.playOrPause();
  const handleStop = () => {
    window.cast.framework.CastContext.getInstance().endCurrentSession(true);
    onClose();
  };
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (playerRef.current) {
        playerRef.current.currentTime = newTime;
        controllerRef.current.seek();
    }
  };
  const handleSkip = (amount: number) => {
    if (playerRef.current) {
        playerRef.current.currentTime = Math.max(0, playerRef.current.currentTime + amount);
        controllerRef.current.seek();
    }
  };
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (playerRef.current) {
        playerRef.current.volumeLevel = newVolume;
        controllerRef.current.setVolumeLevel();
    }
  };
  const toggleMute = () => controllerRef.current?.muteOrUnmute();

  const backdropUrl = mediaInfo?.metadata?.images?.[0]?.url || movie.backdropUrl;
  const posterUrl = mediaInfo?.metadata?.images?.[0]?.url || movie.posterUrl;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col text-white font-sans">
      <img src={backdropUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 blur-md" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/90" />
      
      <header className="relative z-10 p-4 flex items-center">
        <button onClick={onClose} aria-label="Close cast controller"><ChevronLeftIcon className="w-8 h-8" /></button>
        <div className="ml-4 text-left flex-1 min-w-0">
          <h2 className="text-xl font-bold truncate">{title}</h2>
          <p className="text-sm text-gray-400">Casting to {window.cast.framework.CastContext.getInstance().getCurrentSession()?.getCastDevice().friendlyName || 'your TV'}</p>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        <img src={posterUrl} alt={title} className="w-48 h-auto rounded-lg shadow-2xl mb-8 object-cover aspect-[2/3]" />
      </main>

      <footer className="relative z-10 p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm w-12 text-center">{formatTime(currentTime)}</span>
          <input
            type="range" min="0" max={duration || 1} value={currentTime} onChange={handleSeek}
            className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #38bdf8 ${ (currentTime / (duration || 1)) * 100 }%, #fff3 ${ (currentTime / (duration || 1)) * 100 }%)`}}
          />
          <span className="text-sm w-12 text-center">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-center space-x-8">
          <button onClick={() => handleSkip(-10)} aria-label="Rewind 10 seconds"><Replay10Icon className="w-10 h-10 text-gray-300 hover:text-white" /></button>
          <button onClick={handlePlayPause} aria-label={isPaused ? "Play" : "Pause"}>
            {isPaused ? <PlayIcon className="w-16 h-16" /> : <PauseIcon className="w-16 h-16" />}
          </button>
          <button onClick={() => handleSkip(10)} aria-label="Forward 10 seconds"><Forward10Icon className="w-10 h-10 text-gray-300 hover:text-white" /></button>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-3 w-1/2">
            <button onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>{isMuted || volume === 0 ? <VolumeOffIcon className="w-6 h-6" /> : <VolumeUpIcon className="w-6 h-6" />}</button>
            <input
              type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume} onChange={handleVolumeChange} aria-label="Volume"
              className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, #fff ${ (isMuted ? 0 : volume) * 100 }%, #fff3 ${ (isMuted ? 0 : volume) * 100 }%)`}}
            />
          </div>
          <button onClick={handleStop} className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20 text-sm">
            <CastIcon className="w-5 h-5"/>
            <span>Stop Casting</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CastPlayer;
