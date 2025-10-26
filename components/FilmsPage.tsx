import React from 'react';
import { Movie } from '../types';
import HeroCarousel from './HeroCarousel';
import ContentRow from './ContentRow';
import { FILMS_CAROUSEL_ITEMS, PRIME_MOVIES, ACTION_MOVIES, DRAMA_MOVIES } from '../constants';

interface FilmsPageProps {
  onMovieClick: (movie: Movie) => void;
}

const FilmsPage: React.FC<FilmsPageProps> = ({ onMovieClick }) => {
  return (
    <>
      <HeroCarousel items={FILMS_CAROUSEL_ITEMS} />
      <ContentRow title="New Release Movies" items={PRIME_MOVIES} wide={true} onMovieClick={onMovieClick} />
      <ContentRow title="Action & Adventure" items={ACTION_MOVIES} wide={true} onMovieClick={onMovieClick} />
      <ContentRow title="Critically Acclaimed Dramas" items={DRAMA_MOVIES} wide={true} onMovieClick={onMovieClick} />
    </>
  );
};

export default FilmsPage;
