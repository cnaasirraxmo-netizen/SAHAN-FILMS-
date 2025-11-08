import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import MovieCard from './MovieCard';

const API_KEY = '1d44af015449e83f4394af349d414c64';
const API_URL = 'https://api.themoviedb.org/3/discover/movie';

interface NewsPageProps {
  onMovieClick: (movie: Movie) => void;
}

const NewsPage: React.FC<NewsPageProps> = ({ onMovieClick }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&page=1&with_genres=16&with_origin_country=JP`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.status_message || 'Failed to fetch anime.');
        }
        const data = await response.json();
        const mappedResults: Movie[] = data.results
          .filter((movie: any) => movie.poster_path && movie.backdrop_path)
          .map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            description: movie.overview,
            posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            backdropUrl: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
            year: movie.release_date ? parseInt(movie.release_date.substring(0, 4)) : 0,
            rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
            duration: '', // Duration is not available in this API endpoint
            videoUrl_480p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          }));
        setMovies(mappedResults);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full mt-16">
        <div className="loader-dots flex space-x-2">
          <div className="w-3 h-3 bg-sky-400 rounded-full dot-1"></div>
          <div className="w-3 h-3 bg-sky-400 rounded-full dot-2"></div>
          <div className="w-3 h-3 bg-sky-400 rounded-full dot-3"></div>
        </div>
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

  return (
    <div className="p-4 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-color)] mb-4">Popular Anime</h1>
      <div className="grid grid-cols-3 gap-3">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
        ))}
      </div>
    </div>
  );
};

export default NewsPage;