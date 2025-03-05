import React from 'react';

const Search = ({ searchTerm, setSearchTerm }) => {
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="search">
            <div>
                <img src="/search.svg" alt="search" />
                <input
                    type="search"
                    placeholder="Search for a movie..."
                    value={searchTerm}
                    onChange={handleSearch}  // Calls setSearchTerm directly
                />
            </div>
        </div>
    );
};

export default Search;
