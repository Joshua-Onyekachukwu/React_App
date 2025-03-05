import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Search from "./search.jsx";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`
    }
};

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/movie/${id}`, API_OPTIONS);
                if (!response.ok) throw new Error("Failed to fetch movie details.");
                const data = await response.json();
                setMovie(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (isLoading) return <p className="text-white text-center">Loading...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (

        <div className="wrapper">
        <div className="container mx-auto p-4 text-white">
            <header>
                <h1>Find <span className="text-gradient">Movies</span> You will Enjoy without the Hassle</h1>
            </header>
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full md:w-1/2 mx-auto rounded-lg"
            />
            <h1 className="text-3xl font-bold mt-4">{movie.title}</h1>
            <p className="text-gray-400 text-lg mt-2">{movie.overview}</p>

            <div className="mt-4">
                <p>📅 Release Date: {movie.release_date}</p>
                <p>⭐ Rating: {movie.vote_average.toFixed(1)} / 10</p>
                <p>⏳ Runtime: {movie.runtime} min</p>
                <p>🎬 Genres: {movie.genres.map(g => g.name).join(", ")}</p>
            </div>
        </div>


        </div>

    );

};

export default MovieDetails;
