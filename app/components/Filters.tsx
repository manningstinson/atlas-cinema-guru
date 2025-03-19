"use client";

import { useState, useEffect } from "react";

interface FiltersProps {
  onFiltersChange: (filters: {
    search: string;
    minYear: string;
    maxYear: string;
    genres: string[];
  }) => void;
}

const Filters: React.FC<FiltersProps> = ({ onFiltersChange }) => {
  const [search, setSearch] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [allGenres, setAllGenres] = useState<string[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("/api/genres");
        const data = await response.json();
        setAllGenres(data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    onFiltersChange({
      search: search.trim(),
      minYear: minYear.trim(),
      maxYear: maxYear.trim(),
      genres: selectedGenres,
    });
  }, [search, minYear, maxYear, selectedGenres, onFiltersChange]);

  // Handle genre
  const toggleGenre = (genre: string) => {
    setSelectedGenres((prevSelected) =>
      prevSelected.includes(genre)
        ? prevSelected.filter((g) => g !== genre)
        : [...prevSelected, genre],
    );
  };

  return (
    <section
      className="p-6 w-full bg-midnightBlue flex flex-col md:flex-row md:items-center justify-between gap-6"
      aria-labelledby="filter-section-title"
    >
      <h2 id="filter-section-title" className="sr-only">
        Movie Filters
      </h2>

      {/* Left Side: Search and Min/Max Year */}
      <fieldset className="w-auto flex flex-col space-y-3">
        <legend className="sr-only">Search and Year Filters</legend>

        {/* Search Input */}
        <div>
          <label
            htmlFor="search-input"
            className="block text-lg text-white font-semibold mb-1"
          >
            Search
          </label>
          <input
            id="search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movies..."
            className="p-3 border-2 bg-navy border-teal rounded-full w-80 text-white focus:outline-none focus:ring-2 focus:ring-mintyTeal"
            aria-label="Search movies"
          />
        </div>

        {/* Min/Max Year Inputs */}
        <div className="flex gap-4">
          <div className="w-36">
            <label
              htmlFor="min-year-input"
              className="block text-lg text-white font-semibold mb-1"
            >
              Min Year
            </label>
            <input
              id="min-year-input"
              type="number"
              value={minYear}
              onChange={(e) => setMinYear(e.target.value)}
              placeholder="1990"
              className="p-3 border-2 bg-navy border-teal rounded-full w-full text-white focus:outline-none focus:ring-2 focus:ring-mintyTeal"
              aria-label="Enter minimum release year"
            />
          </div>

          <div className="w-36">
            <label
              htmlFor="max-year-input"
              className="block text-lg text-white font-semibold mb-1"
            >
              Max Year
            </label>
            <input
              id="max-year-input"
              type="number"
              value={maxYear}
              onChange={(e) => setMaxYear(e.target.value)}
              placeholder="2024"
              className="p-3 border-2 bg-navy border-teal rounded-full w-full text-white focus:outline-none focus:ring-2 focus:ring-mintyTeal"
              aria-label="Enter maximum release year"
            />
          </div>
        </div>
      </fieldset>

      {/* Right Side: Genres */}
      <fieldset
        className="w-auto flex flex-col"
        aria-labelledby="genres-heading"
      >
        <legend
          id="genres-heading"
          className="block text-lg text-white font-semibold mb-2"
        >
          Genres
        </legend>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {allGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={`cursor-pointer border-2 border-teal rounded-full px-4 py-2 text-sm text-center transition focus:outline-none focus:ring-2 focus:ring-midnightBlue-300 ${
                selectedGenres.includes(genre)
                  ? "bg-teal text-midnightBlue"
                  : "bg-transparent text-white"
              }`}
              role="checkbox"
              aria-checked={selectedGenres.includes(genre)}
              tabIndex={0}
            >
              {genre}
            </button>
          ))}
        </div>
      </fieldset>
    </section>
  );
};

export default Filters;
