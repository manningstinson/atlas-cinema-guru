"use client";

import MovieCard from "./MovieCard";

interface Movie {
  id: string;
  title: string;
  synopsis: string;
  released: number;
  genre: string;
  favorited?: boolean;
  watchLater?: boolean;
}

interface MovieListProps {
  movies: Movie[];
  toggleFavorite?: (movieId: string) => void;
  toggleWatchLater?: (movieId: string) => void;
}

const MovieList: React.FC<MovieListProps> = ({
  movies = [],
  toggleFavorite,
  toggleWatchLater,
}) => {
  console.log("Movies received by MovieList:", movies);

  return (
    <section className="mx-5 md:mx-10" aria-labelledby="movie-list-heading">
      {/* Hidden heading for screen readers */}
      <h2 id="movie-list-heading" className="sr-only">
        Movie List
      </h2>

      {movies.length > 0 ? (
        <ul
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
          role="list"
        >
          {movies.map((movie) => (
            <li key={movie.id} role="listitem">
              <MovieCard
                movie={movie}
                toggleFavorite={toggleFavorite}
                toggleWatchLater={toggleWatchLater}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p
          className="text-teal py-10 text-lg font-semibold ps-2"
          aria-live="polite"
          tabIndex={0}
          role="alert"
        >
          No movies found.
        </p>
      )}
    </section>
  );
};

export default MovieList;
