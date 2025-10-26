import React from 'react';
import { Movie } from '../types';
import ContentRow from './ContentRow';
import { ANIMATED_MOVIES, FAMILY_FAVORITES } from '../constants';

interface KidsPageProps {
  onMovieClick: (movie: Movie) => void;
}

const KidsPage: React.FC<KidsPageProps> = ({ onMovieClick }) => {
  return (
    <div className="animate-fade-in">
      <div className="p-4">
        <h1 className="text-3xl font-bold">Kids & Family</h1>
        <p className="text-sm text-[var(--text-color-secondary)] mt-1">Fun for the whole family. Shows and movies picked just for you.</p>
      </div>
      <ContentRow title="Animated Adventures" items={ANIMATED_MOVIES} wide={false} onMovieClick={onMovieClick} />
      <ContentRow title="Family Favorites" items={FAMILY_FAVORITES} wide={true} onMovieClick={onMovieClick} />
    </div>
  );
};

export default KidsPage;
