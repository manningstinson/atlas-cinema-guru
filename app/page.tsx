"use client";

import { useState, useEffect, useCallback } from "react";
import Filters from "./components/Filters";
import MovieList from "./components/MovieList";
import Pagination from "./components/Pagination";

interface Movie {
  id: string;
  title: string;
  synopsis: string;
  released: number;
  genre: string;
  image: string;
  favorited?: boolean;
  watchLater?: boolean;
}

export default function Page() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    search: "",
    minYear: "",
    maxYear: "",
    genres: [] as string[],
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: currentPage.toString(),
          ...(filters.search && { query: filters.search }),
          ...(filters.minYear && { minYear: filters.minYear }),
          ...(filters.maxYear && { maxYear: filters.maxYear }),
          ...(filters.genres.length > 0 && {
            genres: filters.genres.join(","),
          }),
        });

        console.log("Fetching movies with params:", params.toString());

        const response = await fetch(`/api/titles?${params.toString()}`);
        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} - ${await response.text()}`,
          );
        }

        const data = await response.json();

        if (!data.titles || !Array.isArray(data.titles)) {
          throw new Error(
            "API response does not contain a valid 'titles' array",
          );
        }

        if (typeof data.totalPages !== "number") {
          console.error("API response is missing totalPages");
        }

        setMovies(
          data.titles.map((movie: Movie) => ({
            ...movie,
            favorited: movie.favorited ?? false,
            watchLater: movie.watchLater ?? false,
          })),
        );

        setTotalPages(data.totalPages ?? 1);

        console.log("Movies updated:", data.titles);
        console.log("Total Pages:", data.totalPages);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError(err instanceof Error ? err.message : "Failed to load movies.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [filters, currentPage]);

  const handleFiltersChange = useCallback(
    (newFilters: {
      search: string;
      minYear: string;
      maxYear: string;
      genres: string[];
    }) => {
      setFilters(newFilters);
      setCurrentPage(1);
    },
    [],
  );

  return (
    <main
      aria-labelledby="movies-section"
      className="flex flex-col min-h-screen overflow-hidden"
    >
      <h1 id="movies-section" className="sr-only">
        Movie Browser
      </h1>

      <Filters onFiltersChange={handleFiltersChange} />

      <section
        aria-live="polite"
        aria-busy={isLoading}
        className="relative flex-grow overflow-y-auto"
      >
        {isLoading ? (
          <p className="text-white text-lg font-semibold" role="alert">
            Loading movies...
          </p>
        ) : error ? (
          <p className="text-red-500 text-lg font-semibold" role="alert">
            {error}
          </p>
        ) : movies.length > 0 ? (
          <MovieList movies={movies} />
        ) : (
          <p className="text-white text-lg font-semibold" role="alert">
            No movies found.
          </p>
        )}
      </section>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}
