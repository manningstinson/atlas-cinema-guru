"use client";

import { useState, useEffect, useCallback } from "react";

interface Movie {
  id: string;
  title: string;
  synopsis: string;
  released: number;
  genre: string;
  favorited?: boolean;
  watchLater?: boolean;
}

interface MovieCardProps {
  movie: Movie;
  toggleFavorite?: (movieId: string) => void;
  toggleWatchLater?: (movieId: string) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  toggleFavorite,
  toggleWatchLater,
}) => {
  const [isFavorited, setIsFavorited] = useState(movie.favorited || false);
  const [isWatchLater, setIsWatchLater] = useState(movie.watchLater || false);
  const [isLoading, setIsLoading] = useState(false);

  const imageUrl = `/images/${movie.id}.webp`;

  useEffect(() => {
    setIsFavorited(movie.favorited || false);
    setIsWatchLater(movie.watchLater || false);
  }, [movie.favorited, movie.watchLater]);

  const handleFavoriteToggle = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await fetch(`/api/favorites/${movie.id}`, {
        method: isFavorited ? "DELETE" : "POST",
      });
      setIsFavorited(!isFavorited);
      if (toggleFavorite) toggleFavorite(movie.id);
    } catch (error) {
      console.error("Error updating favorites:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isFavorited, isLoading, movie.id, toggleFavorite]);

  const handleWatchLaterToggle = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await fetch(`/api/watch-later/${movie.id}`, {
        method: isWatchLater ? "DELETE" : "POST",
      });
      setIsWatchLater(!isWatchLater);
      if (toggleWatchLater) toggleWatchLater(movie.id);
    } catch (error) {
      console.error("Error updating watch later:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isWatchLater, isLoading, movie.id, toggleWatchLater]);

  return (
    <div
      className="relative group border-teal border-2 rounded-lg overflow-hidden h-[50vh] focus-within:ring-2 focus-within:ring-midnightBlue-300"
      tabIndex={0}
      aria-labelledby={`movie-title-${movie.id}`}
    >
      {/* Movie Image */}
      <div
        className="h-full w-full bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
        role="img"
        aria-label={`Poster of ${movie.title}`}
      ></div>

      {/* Favorite & Watch Later Buttons */}
      <div className="absolute top-3 right-3 flex space-x-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
        <button
          className={`h-6 w-6 focus:outline-none focus:ring-2 focus:ring-midnightBlue-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={handleFavoriteToggle}
          aria-label={
            isFavorited
              ? `Remove ${movie.title} from favorites`
              : `Add ${movie.title} to favorites`
          }
          aria-pressed={isFavorited}
          disabled={isLoading}
        >
          <img
            src={isFavorited ? "/assets/star-solid.svg" : "/assets/star.svg"}
            alt=""
          />
        </button>

        <button
          className={`h-6 w-6 focus:outline-none focus:ring-2 focus:ring-midnightBlue-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={handleWatchLaterToggle}
          aria-label={
            isWatchLater
              ? `Remove ${movie.title} from watch later`
              : `Add ${movie.title} to watch later`
          }
          aria-pressed={isWatchLater}
          disabled={isLoading}
        >
          <img
            src={isWatchLater ? "/assets/clock-solid.svg" : "/assets/clock.svg"}
            alt=""
          />
        </button>
      </div>

      {/* Movie Details */}
      <div
        className="absolute bottom-0 left-0 w-full bg-navy p-4
        md:h-0 md:opacity-0 md:group-hover:h-[40%] md:group-hover:opacity-100 transition-all duration-500 ease-in-out"
        aria-hidden="true"
      >
        <h3
          id={`movie-title-${movie.id}`}
          className="text-lg font-semibold text-white"
        >
          {movie.title} ({movie.released})
        </h3>
        <p className="text-sm text-white">{movie.synopsis}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="bg-teal text-white px-2 py-1 rounded-full text-xs">
            {movie.genre}
          </span>
        </div>
      </div>

      {/* Movie Details Always Visible in Mobile */}
      <div className="block md:hidden absolute bottom-0 left-0 w-full bg-navy p-4">
        <h3 className="text-lg font-semibold text-white">
          {movie.title} ({movie.released})
        </h3>
        <p className="text-sm text-white">{movie.synopsis}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="bg-teal text-white px-2 py-1 rounded-full text-xs">
            {movie.genre}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
