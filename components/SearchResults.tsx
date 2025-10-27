import React from 'react';
import { Movie } from '../types';
import MovieCard from './MovieCard';

interface SearchResultsProps {
  results: Movie[];
  loading: boolean;
  error: string | null;
  query: string;
  onMovieClick: (movie: Movie) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, loading, error, query, onMovieClick }) => {

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full mt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-400 mt-8">
        <h3 className="font-bold text-lg">Oops! Something went wrong.</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (query.trim() !== '' && results.length === 0) {
    return (
      <div className="p-4 text-center text-[var(--text-color-secondary)] mt-8">
        <p>No results found for "<span className="font-semibold text-[var(--text-color)]">{query}</span>".</p>
        <p className="text-sm mt-2">Try checking for typos or using different keywords.</p>
      </div>
    );
  }

  if (results.length > 0) {
    return (
      <div className="p-4 animate-fade-in">
        <div className="grid grid-cols-3 gap-3">
          {results.map(movie => (
            <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 text-center text-[var(--text-color-secondary)] mt-8">
      <p>Search for movies, TV shows and more.</p>
    </div>
  );
};

export default SearchResults;
