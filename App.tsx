
import React, { useState, useEffect, createContext, useCallback } from 'react';
import { auth } from './firebase';
// FIX: Import firebase compat to resolve module export errors for auth functions.
import * as firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
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
import DownloadSettings from './components/settings/DownloadSettings';
import MovieDetails from './components/MovieDetails';
import Profiles from './components/Profiles';
import ProfileDetails from './components/ProfileDetails';
import Downloads from './components/Downloads';
import VideoPlayer from './components/VideoPlayer';
import CastPlayer from './components/CastPlayer';
import CategoryPage from './components/CategoryPage';
import NewsPage from './components/NewsPage';
import AdminPage from './components/AdminPage';
import SplashScreen from './components/SplashScreen';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import MyAccount from './components/MyAccount';
import ProfilePage from './components/ProfilePage';
import { CAROUSEL_ITEMS, PRIME_MOVIES, PRIME_ORIGINALS, CONTINUE_WATCHING, PROFILES, CATEGORIES, ACTION_MOVIES, DRAMA_MOVIES } from './constants';
import { Movie, Profile, DownloadQuality, User } from './types';
import { ChevronLeftIcon } from './components/Icons';
import MovieCard from './components/MovieCard';
import ToggleSwitch from './components/ToggleSwitch';
import FilmsPage from './components/FilmsPage';
import SubscriptionsPage from './components/SubscriptionsPage';
import KidsPage from './components/KidsPage';
import Watchlist from './components/Watchlist';


export type Theme = 'dark' | 'light';
export const ThemeContext = createContext<{ theme: Theme, toggleTheme: () => void }>({
  theme: 'dark',
  toggleTheme: () => {},
});

type View = 'main' | 'profiles' | 'profileDetails' | 'myAccount' | 'settings' | 'movieDetails' | 'downloads' | 'videoPlayer' | 'castPlayer' | 'auth' | 'onboarding' | 'splash';
type AppView = 'user' | 'admin';

declare global {
  interface Window {
    cast: any;
    chrome: any;
    __onGCastApiAvailable: (isAvailable: boolean) => void;
  }
}

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
                <p className="text-sm text-[var(--text-color-secondary)] flex items-center space-x-1.5">
                    <span>{movie.year}</span>
                    <span>&bull;</span>
                    <span>{movie.duration}</span>
                    <span>&bull;</span>
                    <span className="border border-gray-500/80 px-1 rounded text-xs font-semibold tracking-wide">{movie.rating}</span>
                </p>
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

// FIX: The debounce function was incomplete and malformed. Replaced with a standard implementation.
const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    
    return (...args: Parameters<F>): void => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), waitFor);
    };
};

// FIX: The App component was missing from the file. It has been implemented to handle state and navigation for the application.
const App: React.FC = () => {
    const [theme, setTheme] = useState<Theme>('dark');
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [authChecked, setAuthChecked] = useState(false);
    const [needsOnboarding, setNeedsOnboarding] = useState(false);
    
    const [view, setView] = useState<View>('splash');
    const [historyStack, setHistoryStack] = useState<View[]>(['splash']);

    const [appView, setAppView] = useState<AppView>('user');
    const [activeTab, setActiveTab] = useState('Home');
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
    
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<Profile>(PROFILES[0]);
    const [activeSetting, setActiveSetting] = useState<string | null>(null);
    const [profileFeature, setProfileFeature] = useState<string | null>(null);
    
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const [downloadedMovies, setDownloadedMovies] = useState<Movie[]>([]);
    const [downloadSettings, setDownloadSettings] = useState({ quality: 'Better' as DownloadQuality, autoDelete: false });

    const [favoriteMovieIds, setFavoriteMovieIds] = useState<number[]>([]);

    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isCastAvailable, setIsCastAvailable] = useState(false);
    
    const allMovies = [...PRIME_MOVIES, ...PRIME_ORIGINALS, ...CONTINUE_WATCHING, ...ACTION_MOVIES, ...DRAMA_MOVIES];

    const changeView = (newView: View, pushToHistory = true) => {
        if (pushToHistory) {
            setHistoryStack([...historyStack, newView]);
        }
        setView(newView);
        // Reset sub-states when changing main view
        if (newView === 'main') {
            setSelectedMovie(null);
            setActiveSetting(null);
            setProfileFeature(null);
            setIsSearchActive(false);
        }
    };
    
    const handleBack = () => {
        if (activeSetting) {
            setActiveSetting(null);
            return;
        }
        if (profileFeature) {
            setProfileFeature(null);
            return;
        }
        const newStack = [...historyStack];
        newStack.pop();
        const prevView = newStack[newStack.length - 1] || 'main';
        setHistoryStack(newStack);
        setView(prevView);
    };

    const toggleTheme = useCallback(() => {
        setTheme(current => {
            const newTheme = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            return newTheme;
        });
    }, []);

    const handleOnboardingComplete = () => {
        if(currentUser) localStorage.setItem(`onboarded_${currentUser.uid}`, 'true');
        setNeedsOnboarding(false);
        changeView('main');
    };

    const handleMovieClick = (movie: Movie) => {
        setSelectedMovie(movie);
        changeView('movieDetails');
    };
    
    const handleLogout = () => {
        auth.signOut();
        changeView('auth', false);
        setHistoryStack(['auth']);
    };
    
    const handleDownload = (movie: Movie) => {
      const qualityMultiplier = { Good: 0.6, Better: 1, Best: 1.5 };
      const downloadedMovie = { ...movie, downloadQuality: downloadSettings.quality, size: (movie.baseSize || 1) * qualityMultiplier[downloadSettings.quality] };
      setDownloadedMovies(prev => [...prev, downloadedMovie]);
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          const videoUrl = downloadedMovie.videoUrl_1080p;
          if(videoUrl) navigator.serviceWorker.controller.postMessage({ type: 'CACHE_VIDEO', url: videoUrl });
      }
    };

    const handleRemoveDownload = (movie: Movie) => {
        setDownloadedMovies(prev => prev.filter(m => m.id !== movie.id));
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            const videoUrl = movie.videoUrl_1080p;
            if(videoUrl) navigator.serviceWorker.controller.postMessage({ type: 'DELETE_VIDEO', url: videoUrl });
        }
    };

    const handleToggleFavorite = (movie: Movie) => {
        setFavoriteMovieIds(prev => 
            prev.includes(movie.id) ? prev.filter(id => id !== movie.id) : [...prev, movie.id]
        );
    };
    
    const performSearch = useCallback(debounce((query: string) => {
        if (query.trim() === '') {
            setSearchResults([]);
            return;
        }
        setSearchLoading(true);
        setTimeout(() => {
            const results = allMovies.filter(m => m.title.toLowerCase().includes(query.toLowerCase()));
            setSearchResults(results);
            setSearchLoading(false);
        }, 500);
    }, 300), [allMovies]);

    const handleSearchQueryChange = (query: string) => {
        setSearchQuery(query);
        performSearch(query);
    };
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            if (!authChecked) changeView('auth', false);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const isNew = localStorage.getItem(`onboarded_${user.uid}`) !== 'true';
                setCurrentUser({ uid: user.uid, email: user.email, name: user.displayName, avatarUrl: user.photoURL });
                setNeedsOnboarding(isNew);
                changeView(isNew ? 'onboarding' : 'main', false);
            } else {
                setCurrentUser(null);
                changeView('auth', false);
            }
            setAuthChecked(true);
        });
        return unsubscribe;
    }, []);
    
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);
    
    if (appView === 'admin') {
        return <AdminPage />;
    }

    if (view === 'splash' || isLoading) return <SplashScreen />;
    if (view === 'auth') return <Auth />;
    if (view === 'onboarding' || needsOnboarding) return <Onboarding onComplete={handleOnboardingComplete} />;
    
    const renderPageContent = () => {
        if(profileFeature) {
            switch(profileFeature) {
                case 'history': return <ViewingHistory profile={selectedProfile} onBack={() => setProfileFeature(null)} onMovieClick={handleMovieClick} />;
                case 'recommendations': return <Recommendations profile={selectedProfile} onBack={() => setProfileFeature(null)} onMovieClick={handleMovieClick} />;
                case 'sync': return <DeviceSync profile={selectedProfile} onBack={() => setProfileFeature(null)} />;
                default: setProfileFeature(null); return null;
            }
        }

        switch (view) {
            case 'movieDetails': return selectedMovie && <MovieDetails movie={selectedMovie} onBack={handleBack} onDownload={handleDownload} downloadedMovies={downloadedMovies} onPlay={() => changeView('videoPlayer')} isFavorite={favoriteMovieIds.includes(selectedMovie.id)} onToggleFavorite={handleToggleFavorite} />;
            case 'videoPlayer': return selectedMovie && <VideoPlayer movie={selectedMovie} onClose={handleBack} onNextEpisode={() => { /* logic for next episode */ }} />;
            case 'settings':
                if (activeSetting) {
                    switch (activeSetting) {
                        case 'theme': return <ThemeSettings />;
                        case 'language': return <LanguageSettings />;
                        case 'notifications': return <NotificationSettings />;
                        case 'data': return <DataUsageSettings />;
                        case 'privacy': return <PrivacySettings />;
                        case 'downloads': return <DownloadSettings quality={downloadSettings.quality} onQualityChange={q => setDownloadSettings(s => ({...s, quality: q}))} autoDelete={downloadSettings.autoDelete} onAutoDeleteChange={e => setDownloadSettings(s => ({...s, autoDelete: e}))} />;
                        default: setActiveSetting(null); return null;
                    }
                }
                return <Settings onSettingClick={setActiveSetting} onLogout={handleLogout} />;
            case 'profiles': return <Profiles profiles={PROFILES} onProfileSelect={(p) => { setSelectedProfile(p); changeView('main'); }} onBack={handleBack}/>;
            case 'profileDetails': return <ProfileDetails profile={selectedProfile} onBack={() => changeView('profiles')} onFeatureSelect={setProfileFeature} />;
            case 'myAccount': return <MyAccount currentUser={currentUser!} onBack={() => changeView('main')} onManageProfiles={() => changeView('profiles')} onLogout={handleLogout} onUserUpdate={setCurrentUser} />;
            case 'main':
            default:
                if (isSearchActive) {
                    return <SearchResults results={searchResults} loading={searchLoading} error={searchError} query={searchQuery} onMovieClick={handleMovieClick} />;
                }
                switch (activeTab) {
                    case 'Home': return <>
                        <CategoryNav categories={CATEGORIES} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
                        {activeCategory === 'All' && <>
                            <HeroCarousel items={CAROUSEL_ITEMS} />
                            <ContentRow title="RIYOBOX Movies" items={PRIME_MOVIES} wide onMovieClick={handleMovieClick} />
                            <ContentRow title="RIYOBOX Originals" items={PRIME_ORIGINALS} onMovieClick={handleMovieClick} />
                            <ContentRow title="Continue Watching" items={CONTINUE_WATCHING} wide onMovieClick={handleMovieClick} />
                        </>}
                        {activeCategory === 'Movies' && <FilmsPage onMovieClick={handleMovieClick} />}
                        {activeCategory === 'TV shows' && <CategoryPage category="TV shows" onMovieClick={handleMovieClick} />}
                        {activeCategory === 'Kids' && <KidsPage onMovieClick={handleMovieClick} />}
                        {activeCategory === 'Subscriptions' && <SubscriptionsPage />}
                    </>;
                    case 'Anime': return <NewsPage onMovieClick={handleMovieClick} />;
                    case 'Downloads': return <Downloads movies={downloadedMovies} onRemove={handleRemoveDownload} onMovieClick={handleMovieClick} />;
                    case 'Search': return <SearchResults results={searchResults} loading={searchLoading} error={searchError} query={searchQuery} onMovieClick={handleMovieClick} />;
                    case 'Me': return <ProfilePage currentUser={currentUser!} onLogout={handleLogout} onEditProfile={() => changeView('myAccount')} favoriteMovies={allMovies.filter(m => favoriteMovieIds.includes(m.id))} historyMovies={CONTINUE_WATCHING} onMovieClick={handleMovieClick} />;
                    default: return <p>Page not found</p>;
                }
        }
    };
    
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div id="app" className={`h-dvh w-full max-w-md mx-auto flex flex-col font-sans bg-[var(--background-color)] text-[var(--text-color)] ${theme}`}>
                <Header 
                    isSearchActive={isSearchActive} 
                    onCancelSearch={() => { setIsSearchActive(false); setActiveTab('Home'); }}
                    isSettingsActive={view === 'settings'}
                    onSettingsClick={() => changeView('settings')}
                    onBackClick={handleBack}
                    activeSetting={activeSetting}
                    onProfileClick={() => changeView('profiles')}
                    isCastAvailable={isCastAvailable}
                    isCasting={view === 'castPlayer'}
                    onCastClick={() => { /* Cast logic */ }}
                    currentUser={currentUser}
                    isOnline={isOnline}
                    searchQuery={searchQuery}
                    onSearchQueryChange={handleSearchQueryChange}
                />
                <main className="flex-1 overflow-y-auto no-scrollbar pb-16">
                    {renderPageContent()}
                </main>
                <BottomNav activeTab={isSearchActive ? 'Search' : activeTab} onTabChange={(tab) => {
                    setIsSearchActive(tab === 'Search');
                    if (tab === 'Search') setSearchQuery('');
                    setActiveTab(tab);
                    if (view !== 'main') changeView('main');
                }} />
            </div>
        </ThemeContext.Provider>
    );
};

export default App;
