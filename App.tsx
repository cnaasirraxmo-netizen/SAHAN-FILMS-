import React, { useState, useEffect, createContext } from 'react';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import HeroCarousel from './components/HeroCarousel';
import ContentRow from './components/ContentRow';
import BottomNav from './components/BottomNav';
import SearchResults from './components/SearchResults';
import Settings from './components/Settings';
import ThemeSettings from './components/settings/ThemeSettings';
import LanguageSettings from './components/settings/LanguageSettings';
import NotificationSettings from './components/settings/NotificationSettings';
import DataUsageSettings from './components/settings/DataUsageSettings';
import PrivacySettings from './components/settings/PrivacySettings';
import MovieDetails from './components/MovieDetails';
import Profiles from './components/Profiles';
import ProfileDetails from './components/ProfileDetails';
import { CAROUSEL_ITEMS, PRIME_MOVIES, PRIME_ORIGINALS, CONTINUE_WATCHING, PROFILES } from './constants';
import { Movie, Profile } from './types';
import { ChevronLeftIcon } from './components/Icons';
import MovieCard from './components/MovieCard';
import ToggleSwitch from './components/ToggleSwitch';

export type Theme = 'dark' | 'light';
export const ThemeContext = createContext<{ theme: Theme, toggleTheme: () => void }>({
  theme: 'dark',
  toggleTheme: () => {},
});

type View = 'app' | 'profiles' | 'profileDetails';

// --- Profile Feature Sub-Pages ---

const ViewingHistory: React.FC<{ profile: Profile; onBack: () => void; onMovieClick: (movie: Movie) => void; }> = ({ profile, onBack, onMovieClick }) => {
  return (
    <div className="bg-[var(--background-color-secondary)] h-screen w-full max-w-md mx-auto flex flex-col font-sans text-[var(--text-color)]">
      <header className="px-4 py-3 flex items-center bg-[var(--background-color)] border-b border-[var(--border-color)] relative">
        <button onClick={onBack} aria-label="Go back to profile details">
          <ChevronLeftIcon className="h-6 w-6 text-[var(--text-color)]" />
        </button>
        <h1 className="text-xl font-bold text-[var(--text-color)] absolute left-1/2 -translate-x-1/2">Viewing History</h1>
      </header>
      <main className="flex-1 p-4 overflow-y-auto no-scrollbar">
        <p className="text-sm text-[var(--text-color-secondary)] mb-4">Here's what {profile.name} has been watching.</p>
        <ul className="space-y-4">
          {CONTINUE_WATCHING.map(movie => (
            <li key={movie.id} onClick={() => onMovieClick(movie)} className="flex items-center space-x-4 cursor-pointer">
              <img src={movie.posterUrl} alt={movie.title} className="w-24 h-14 rounded-md object-cover" />
              <div className="flex-1">
                <p className="font-semibold">{movie.title}</p>
                <p className="text-sm text-[var(--text-color-secondary)]">{movie.year} &middot; {movie.duration}</p>
                <div className="w-full h-1 bg-gray-600/70 rounded-full mt-2">
                  <div className="h-full bg-sky-400 rounded-full" style={{ width: `${movie.progress}%` }}></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

const Recommendations: React.FC<{ profile: Profile; onBack: () => void; onMovieClick: (movie: Movie) => void; }> = ({ profile, onBack, onMovieClick }) => {
    const recommendedMovies = [...PRIME_MOVIES.slice(0, 2), ...PRIME_ORIGINALS];

  return (
    <div className="bg-[var(--background-color-secondary)] h-screen w-full max-w-md mx-auto flex flex-col font-sans text-[var(--text-color)]">
      <header className="px-4 py-3 flex items-center bg-[var(--background-color)] border-b border-[var(--border-color)] relative">
        <button onClick={onBack} aria-label="Go back to profile details">
          <ChevronLeftIcon className="h-6 w-6 text-[var(--text-color)]" />
        </button>
        <h1 className="text-xl font-bold text-[var(--text-color)] absolute left-1/2 -translate-x-1/2">Recommendations</h1>
      </header>
      <main className="flex-1 p-4 overflow-y-auto no-scrollbar">
        <p className="text-sm text-[var(--text-color-secondary)] mb-4">Based on {profile.name}'s viewing habits, we think you'll enjoy these.</p>
        <div className="grid grid-cols-3 gap-3">
          {recommendedMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
          ))}
        </div>
      </main>
    </div>
  );
};

const DeviceSync: React.FC<{ profile: Profile; onBack: () => void; }> = ({ profile, onBack }) => {
  return (
    <div className="bg-[var(--background-color-secondary)] h-screen w-full max-w-md mx-auto flex flex-col font-sans text-[var(--text-color)]">
      <header className="px-4 py-3 flex items-center bg-[var(--background-color)] border-b border-[var(--border-color)] relative">
        <button onClick={onBack} aria-label="Go back to profile details">
          <ChevronLeftIcon className="h-6 w-6 text-[var(--text-color)]" />
        </button>
        <h1 className="text-xl font-bold text-[var(--text-color)] absolute left-1/2 -translate-x-1/2">Cross-Device Sync</h1>
      </header>
      <main className="flex-1 overflow-y-auto no-scrollbar">
         <div className="p-4">
            <p className="text-sm text-[var(--text-color-secondary)] mb-6">Manage how {profile.name}'s viewing progress is synced across devices.</p>
            <ul className="divide-y divide-[var(--border-color)]">
                <li className="py-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-lg">Enable Sync</span>
                        <span className="text-sm text-[var(--text-color-secondary)]">
                            Keep watch history and progress in sync.
                        </span>
                    </div>
                    <ToggleSwitch checked={true} onChange={() => {}} />
                </li>
                <li className="py-4">
                    <h3 className="text-lg mb-2">Registered Devices</h3>
                    <div className="space-y-2 text-[var(--text-color-secondary)]">
                        <p>iPhone 15 Pro</p>
                        <p>Samsung Smart TV</p>
                        <p>Chrome on macOS</p>
                    </div>
                </li>
            </ul>
        </div>
      </main>
    </div>
  );
};


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [activeSetting, setActiveSetting] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');
  const [view, setView] = useState<View>('app');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [activeProfileFeature, setActiveProfileFeature] = useState<string | null>(null);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
  }, [theme]);
  
  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };
  
  const handleBackFromDetails = () => {
    setSelectedMovie(null);
  };

  const handleCancelSearch = () => {
    setActiveTab('Home');
  };

  const handleSettingsClick = () => {
    setActiveTab('Settings');
  };

  const handleBackClick = () => {
    if (activeSetting) {
      setActiveSetting(null);
    } else {
      setActiveTab('Home');
    }
  };
  
  const handleProfileClick = () => setView('profiles');
  
  const handleProfileSelect = (profile: Profile) => {
    setSelectedProfile(profile);
    setView('profileDetails');
  };
  
  const handleBackFromProfileDetails = () => {
    setView('profiles');
    setSelectedProfile(null);
    setActiveProfileFeature(null);
  };

  const handleBackFromProfileFeature = () => {
    setActiveProfileFeature(null);
  };


  if (view === 'profiles') {
    return <Profiles profiles={PROFILES} onProfileSelect={handleProfileSelect} onBack={() => setView('app')} />;
  }

  if (view === 'profileDetails' && selectedProfile) {
    if (activeProfileFeature) {
        switch (activeProfileFeature) {
            case 'history':
                return <ViewingHistory profile={selectedProfile} onBack={handleBackFromProfileFeature} onMovieClick={handleMovieSelect} />;
            case 'recommendations':
                return <Recommendations profile={selectedProfile} onBack={handleBackFromProfileFeature} onMovieClick={handleMovieSelect} />;
            case 'sync':
                return <DeviceSync profile={selectedProfile} onBack={handleBackFromProfileFeature} />;
            default:
                setActiveProfileFeature(null);
        }
    }
    return <ProfileDetails profile={selectedProfile} onBack={handleBackFromProfileDetails} onFeatureSelect={setActiveProfileFeature} />;
  }


  const renderSettingsContent = () => {
    switch (activeSetting) {
      case 'theme': return <ThemeSettings />;
      case 'language': return <LanguageSettings />;
      case 'notifications': return <NotificationSettings />;
      case 'data': return <DataUsageSettings />;
      case 'privacy': return <PrivacySettings />;
      default: return <Settings onSettingClick={setActiveSetting} />;
    }
  };

  const renderContent = () => {
    if (selectedMovie) {
        return <MovieDetails movie={selectedMovie} onBack={handleBackFromDetails} />;
    }
    
    switch (activeTab) {
      case 'Home':
        return (
          <>
            <div className="sticky top-0 bg-[var(--background-color)] z-10 pt-2">
              <CategoryNav />
            </div>
            <HeroCarousel items={CAROUSEL_ITEMS} />
            <ContentRow title="SAHAN FILMS™ movies" items={PRIME_MOVIES} wide={true} onMovieClick={handleMovieSelect} />
            <ContentRow title="SAHAN FILMS™ Originals" items={PRIME_ORIGINALS} wide={false} onMovieClick={handleMovieSelect} />
            <ContentRow title="Continue Watching" items={CONTINUE_WATCHING} wide={true} onMovieClick={handleMovieSelect} />
          </>
        );
      case 'Search':
        return <SearchResults />;
      case 'Settings':
        return renderSettingsContent();
      case 'Films':
      case 'Subscriptions':
      case 'Downloads':
        return (
          <div className="p-4 text-center text-[var(--text-color-secondary)] mt-8">
            <p>Content for the '{activeTab}' tab is not yet available.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="bg-[var(--background-color-secondary)] h-screen w-full max-w-md mx-auto flex flex-col font-sans shadow-2xl text-[var(--text-color)]">
        {/* Status bar simulation */}
        <div className="bg-black/50 text-white text-xs px-4 pt-1 flex justify-between fixed top-0 left-0 right-0 max-w-md mx-auto z-50">
          <span>9:41</span>
          <div className="flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" clipRule="evenodd" fillRule="evenodd" pathLength="1" stroke="none" fill="currentColor"></path></svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 16 16"><path d="M4 11.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-2Zm2.5-6.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-6Z"></path></svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 16 16"><path d="M12.5 7.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V8a.5.5 0 0 1 .5-.5Z"></path><path d="M1.22 5.922a.5.5 0 0 1 .353-.145h12.854a.5.5 0 0 1 .353.854l-2.347 2.682a.5.5 0 0 1-.708 0L9.5 7.56l-1.354 1.547a.5.5 0 0 1-.708 0L6.085 7.78a.5.5 0 0 1-.707 0l-2.43-2.776a.5.5 0 0 1 0-.708l.272-.309Z"></path><path d="M1 4.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-7Z"></path></svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path></svg>
          </div>
        </div>
        <div className="pt-6">
            {!selectedMovie && view === 'app' &&
                <Header 
                    isSearchActive={activeTab === 'Search'} 
                    onCancelSearch={handleCancelSearch}
                    isSettingsActive={activeTab === 'Settings'}
                    onSettingsClick={handleSettingsClick}
                    onBackClick={handleBackClick}
                    activeSetting={activeSetting}
                    onProfileClick={handleProfileClick}
                />
            }
        </div>
        <main className={`flex-1 overflow-y-auto no-scrollbar ${!selectedMovie && 'pb-16'}`}>
          {renderContent()}
        </main>
        {activeTab !== 'Settings' && !selectedMovie && view === 'app' && <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />}
      </div>
    </ThemeContext.Provider>
  );
};

export default App;