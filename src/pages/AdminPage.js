import { useState, useEffect } from "react";
import { auth, db, storage } from "../config/firebase"; // Ensure correct imports
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Auth from "../components/Auth";
import MovieCard from "../components/MovieCard";
import "./AdminPage.css";

function AdminPage() {
  const [movieList, setMovieList] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newMovie, setNewMovie] = useState({ title: "", url: "" });
  const [imageUpload, setImageUpload] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const moviesCollectionRef = collection(db, "movies");

  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      if (user) {
        getMovieList();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleCreateMovie = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      const docRef = await addDoc(moviesCollectionRef, newMovie);

      if (imageUpload) {
        const imageRef = ref(storage, `movieImages/${docRef.id}`);
        await uploadBytes(imageRef, imageUpload);
        const imageUrl = await getDownloadURL(imageRef);
        await updateDoc(docRef, { imageUrl });
      }

      setNewMovie({ title: "", url: "" });
      setImageUpload(null);
      getMovieList();
      setMessage("Movie added successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error adding movie.");
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  const handleUpdateMovie = async (id, updatedData) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await updateDoc(movieDoc, updatedData);
      getMovieList();
      setMessage("Movie updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error updating movie.");
    }
  };

  const handleDeleteMovie = async (id) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await deleteDoc(movieDoc);
      getMovieList();
      setMessage("Movie deleted successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error deleting movie.");
    }
  };

  return (
    <div className="admin-page">
      {isAuthenticated ? (
        <div>
          <header className="admin-header">
            <p className="welcome-message">Welcome, {auth.currentUser.email}</p>
            <button className="sign-out-button" onClick={() => auth.signOut()}>Sign Out</button>
          </header>
          <div className="admin-content">
            <div className="crud-forms">
              <div className="create-movie">
                <h2>Add Movie</h2>
                <input
                  type="text"
                  placeholder="Title"
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newMovie.url}
                  onChange={(e) => setNewMovie({ ...newMovie, url: e.target.value })}
                />
                <input
                  type="file"
                  onChange={(e) => setImageUpload(e.target.files[0])}
                />
                <button
                  onClick={handleCreateMovie}
                  disabled={isLoading} // Disable button while loading
                >
                  {isLoading ? "Adding Movie..." : "Add Movie"}
                </button>
              </div>
            </div>

            <div className="message">{message && <div>{message}</div>}</div>
            <div className="movie-list">
              {movieList.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onDelete={() => handleDeleteMovie(movie.id)}
                  onUpdate={handleUpdateMovie}
                  isAdmin={isAuthenticated} // Pass isAuthenticated to MovieCard
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Auth
          onSignIn={() => setIsAuthenticated(true)}
          onSignOut={() => setIsAuthenticated(false)}
        />
      )}
    </div>
  );
}

export default AdminPage;
