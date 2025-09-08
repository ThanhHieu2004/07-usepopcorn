import { useState, useEffect } from "react";

const OMDB_KEY = "cfb2cad3";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(
    function () {
      //   callback?.(); // Cause re-render, not ideal
      const controller = new AbortController();
      async function loadMovies() {
        try {
          setError("");
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${OMDB_KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies.");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found.");
          setMovies(data.Search);
          setError("");
        } catch (error) {
          console.log(error);
          if (error.name !== "AbortError") {
            setError(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setIsLoading(false);
        setMovies([]);
        setError("");
        return;
      }
      //   handleCloseMovie();
      loadMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
