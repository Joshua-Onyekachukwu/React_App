import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import MovieDetails from "./components/MovieDetails.jsx";
import {updateSearchCount} from "./appwrite.js";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`
    }
};

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    const fetchMovies = async () => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            let allMoviesEndpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            let trendingEndpoint = `${API_BASE_URL}/trending/movie/day`;
            let topRatedEndpoint = `${API_BASE_URL}/movie/top_rated`;

            // If user is searching, fetch search results instead
            if (searchTerm) {
                allMoviesEndpoint = `${API_BASE_URL}/search/movie?query=${searchTerm}`;

                // Update the search count in the database
                await updateSearchCount(searchTerm);
            }

            const allMoviesResponse = await fetch(allMoviesEndpoint, API_OPTIONS);
            const allMoviesData = await allMoviesResponse.json();
            setMovieList(allMoviesData.results.slice(0, 12) || []);

            if (!searchTerm) {
                // Fetch Trending Movies only when not searching
                const trendingResponse = await fetch(trendingEndpoint, API_OPTIONS);
                const trendingData = await trendingResponse.json();
                setTrendingMovies(trendingData.results.slice(0, 8) || []);

                // Fetch Top Rated Movies only when not searching
                const topRatedResponse = await fetch(topRatedEndpoint, API_OPTIONS);
                const topRatedData = await topRatedResponse.json();
                setTopRatedMovies(topRatedData.results.slice(0, 8) || []);
            }
        } catch (error) {
            console.error(`Error fetching movies: ${error}`);
            setErrorMessage(`Error fetching movies. Please try again later.`);
        } finally {
            setIsLoading(false);
        }
    };


    // const fetchMovies = async () => {
    //     setIsLoading(true);
    //     setErrorMessage('');
    //
    //     try {
    //         let allMoviesEndpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
    //         let trendingEndpoint = `${API_BASE_URL}/trending/movie/day`;
    //         let topRatedEndpoint = `${API_BASE_URL}/movie/top_rated`;
    //
    //         // If user is searching, fetch search results instead
    //         if (searchTerm) {
    //             allMoviesEndpoint = `${API_BASE_URL}/search/movie?query=${searchTerm}`;
    //         }
    //
    //         const allMoviesResponse = await fetch(allMoviesEndpoint, API_OPTIONS);
    //         const allMoviesData = await allMoviesResponse.json();
    //         setMovieList(allMoviesData.results.slice(0, 12) || []);
    //
    //         if (!searchTerm) {
    //             // Fetch Trending Movies only when not searching
    //             const trendingResponse = await fetch(trendingEndpoint, API_OPTIONS);
    //             const trendingData = await trendingResponse.json();
    //             setTrendingMovies(trendingData.results.slice(0, 8) || []);
    //
    //             // Fetch Top Rated Movies only when not searching
    //             const topRatedResponse = await fetch(topRatedEndpoint, API_OPTIONS);
    //             const topRatedData = await topRatedResponse.json();
    //             setTopRatedMovies(topRatedData.results.slice(0, 8) || []);
    //         }
    //         updateSearchCount()
    //     } catch (error) {
    //         console.error(`Error fetching movies ${error}`);
    //         setErrorMessage(`Error Fetching the movies. Please try again later.`);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    useEffect(() => {
        fetchMovies();
    }, [searchTerm]);

    return (
        <Router>
            <main>
                <Routes>
                    {/* Home Page */}
                    <Route
                        path="/"
                        element={
                            <div className="wrapper py-12">
                                <header>
                                    <img src="hero.png" alt="Hero Banner" />
                                    <h1>Find <span className="text-gradient">Movies</span> You will Enjoy without the Hassle</h1>
                                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                                    <h1 className="text-white">{searchTerm}</h1>
                                </header>

                                {/* Movie Sections */}
                                <section className="all-movies">
                                    <h2 className="text-center mt-4 py 10 text-2xl text-white">All Movies</h2>
                                    {isLoading ? <Spinner /> : (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {movieList.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                                        </div>
                                    )}
                                </section>

                                <section className="trending-movies">
                                    <h2 className="text-center mt-4 py-10 text-2xl text-white">Trending Movies</h2>
                                    {isLoading ? <Spinner /> : (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {trendingMovies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                                        </div>
                                    )}
                                </section>

                                <section className="top-rated-movies">
                                    <h2 className="text-center mt-4 text-2xl py-10 text-white">Top Rated Movies</h2>
                                    {isLoading ? <Spinner /> : (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {topRatedMovies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                                        </div>
                                    )}
                                </section>
                            </div>
                        }
                    />

                    {/* Movie Details Page */}
                    <Route path="/movie/:id" element={<MovieDetails />} />
                </Routes>
            </main>
        </Router>
    );
};

export default App;
