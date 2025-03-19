"use client";

import { useState, useEffect, useCallback } from "react";
import MovieList from "../components/MovieList";
import Pagination from "../components/Pagination";

interface Movie {
  id: string;
  title: string;
  synopsis: string;
  released: number;
  genre: string;
  favorited: boolean;
  watchLater: boolean;
}

export default function FavoritesPage({
  refreshActivities = () => {},
}: {
  refreshActivities?: () => void;
}) {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async (page: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/favorites?page=${page}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setFavorites(data.favorites || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError("Failed to load favorites.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites(currentPage);
  }, [currentPage]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const toggleFavorite = useCallback(
    async (movieId: string) => {
      try {
        const movie = favorites.find((m) => m.id === movieId);
        if (!movie) return;

        const method = movie.favorited ? "DELETE" : "POST";
        const response = await fetch(`/api/favorites/${movieId}`, { method });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to toggle favorite.");
        }

        setFavorites((prevFavorites) =>
          prevFavorites.map((m) =>
            m.id === movieId ? { ...m, favorited: !m.favorited } : m,
          ),
        );

        refreshActivities();
      } catch (err) {
        console.error("Error toggling favorite:", err);
      }
    },
    [favorites, refreshActivities],
  );

  const toggleWatchLater = useCallback(
    async (movieId: string) => {
      try {
        const movie = favorites.find((m) => m.id === movieId);
        if (!movie) return;

        const method = movie.watchLater ? "DELETE" : "POST";
        const response = await fetch(`/api/watch-later/${movieId}`, { method });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to toggle Watch Later.");
        }

        setFavorites((prevFavorites) =>
          prevFavorites.map((m) =>
            m.id === movieId ? { ...m, watchLater: !m.watchLater } : m,
          ),
        );

        refreshActivities();
      } catch (err) {
        console.error("Error toggling watch later:", err);
      }
    },
    [favorites, refreshActivities],
  );

  return (
    <main aria-labelledby="favorites-title">
      <h1
        id="favorites-title"
        className="text-4xl md:text-5xl font-bold text-center text-white mb-8 py-10 mt-5"
      >
        Favorites
      </h1>

      <section aria-live="polite" aria-busy={isLoading} role="region">
        {isLoading ? (
          <p className="text-white text-lg font-semibold" role="alert">
            Loading favorite movies...
          </p>
        ) : error ? (
          <p className="text-red-500 text-lg font-semibold" role="alert">
            {error}
          </p>
        ) : favorites.length > 0 ? (
          <MovieList
            movies={favorites}
            toggleFavorite={toggleFavorite}
            toggleWatchLater={toggleWatchLater}
          />
        ) : (
          <p className="text-white text-lg font-semibold" role="alert">
            No favorite movies found.
          </p>
        )}
      </section>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </main>
  );
}
