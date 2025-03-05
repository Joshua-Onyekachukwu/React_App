import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie = {}) => {
    try {
        // Ensure searchTerm is valid
        if (!searchTerm) {
            console.warn("No search term provided.");
            return;
        }

        // Check if the search term already exists in the database
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', searchTerm),
        ]);

        if (result.documents.length > 0) {
            const doc = result.documents[0];

            // Update search count
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1,
            });

            console.log(`Search term "${searchTerm}" updated. New count: ${doc.count + 1}`);
        } else {
            // Ensure movie object contains valid properties
            const movieData = {
                searchTerm,
                count: 1,
                movie_id: movie.id || "N/A",
                poster_url: movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "N/A",
            };

            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), movieData);
            console.log(`New search term "${searchTerm}" added.`);
        }
    } catch (error) {
        console.error(`Error updating search count for "${searchTerm}":`, error);
    }
};
