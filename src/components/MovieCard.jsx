import React from "react";
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
    return (
        <Link to={`/movie/${movie.id}`} className="movie-card block">
            <div className="p-4 bg-gray-800 rounded-lg shadow-md">
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-64 object-cover rounded-md"
                />
                <h3 className="text-white text-lg font-bold mt-2">{movie.title}</h3>
                <p className="text-gray-400 text-sm mt-1">⭐ {movie.vote_average.toFixed(1)} / 10</p>
                <p className="text-gray-300 mt-2 line-clamp-3">{movie.overview}</p>

                <div className="text-gray-400 text-sm mt-2 flex gap-2">
                    <span>📅 {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}</span>
                    <span>🌍 {movie.original_language.toUpperCase()}</span>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
