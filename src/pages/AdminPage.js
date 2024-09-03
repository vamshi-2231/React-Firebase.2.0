// src/pages/AdminPage.js
import { useEffect, useState } from "react";
import { db, auth, storage } from "../config/firebase";
import { getDocs, collection, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import Auth from "../components/Auth";
import "./AdminPage.css";

function AdminPage() {
  const [movieList, setMovieList] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  // New Movie States
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newMovieUrl, setNewMovieUrl] = useState("");
  const [imageUpload, setImageUpload] = useState(null);

  // Update States
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedUrl, setUpdatedUrl] = useState("");
  const [movieIdToUpdate, setMovieIdToUpdate] = useState(null);

  const moviesCollectionRef = collection(db, "movies");

  // Fetch movie list
  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (err) {
      console.error("Error fetching movies:", err);
    }
  };

  // Handle movie submission
  const onSubmitMovie = async () => {
    try {
      const docRef = await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        url: newMovieUrl,
        userId: auth?.currentUser?.uid,
      });

      if (imageUpload) {
        const imageRef = ref(storage, `movieImages/${docRef.id}`);
        await uploadBytes(imageRef, imageUpload);
        const imageUrl = await getDownloadURL(imageRef);
        await updateDoc(docRef, { imageUrl });
      }

      await getMovieList();
      setMessage("Movie added successfully!");
      setNewMovieTitle("");
      setNewMovieUrl("");
      setImageUpload(null);
    } catch (err) {
      console.error("Error adding movie:", err);
      setMessage("Error adding movie.");
    }
  };

  // Handle movie deletion
  const deleteMovie = async (id) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await deleteDoc(movieDoc);
      await getMovieList();
      setMessage("Movie deleted successfully!");
    } catch (err) {
      console.error("Error deleting movie:", err);
      setMessage("Error deleting movie.");
    }
  };

  // Handle movie update
  const updateMovie = async (id) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await updateDoc(movieDoc, { title: updatedTitle, url: updatedUrl });
      await getMovieList();
      setMessage("Movie updated successfully!");
      setUpdatedTitle("");
      setUpdatedUrl("");
      setMovieIdToUpdate(null);
    } catch (err) {
      console.error("Error updating movie:", err);
      setMessage("Error updating movie.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    getMovieList();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="admin-page">
      <Auth />
      {user && (
        <div className="welcome-message">
          <h2>Welcome, {user.email}!</h2>
        </div>
      )}
      {!user && (
        <div className="welcome-message">
          <h2>Please log in to manage your movies.</h2>
        </div>
      )}
      <div className="admin-form">
        <input
          placeholder="Movie title..."
          value={newMovieTitle}
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          placeholder="Movie URL..."
          value={newMovieUrl}
          onChange={(e) => setNewMovieUrl(e.target.value)}
        />
        <input
          type="file"
          onChange={(e) => setImageUpload(e.target.files[0])}
        />
        <button onClick={onSubmitMovie}>Submit Movie</button>
      </div>
      <div className="message">{message && <div>{message}</div>}</div>
      <div className="movie-list">
        {movieList.map((movie) => (
          <div className="movie-item" key={movie.id}>
            <h1>{movie.title}</h1>
            {movie.imageUrl && (
              <img
                src={movie.imageUrl}
                alt={movie.title}
                className="movie-image"
                width="250"
                height="300"
              />
            )}
            <p>
              URL: <a href={movie.url} target="_blank" rel="noopener noreferrer">{movie.url}</a>
            </p>
            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>
            {movieIdToUpdate === movie.id ? (
              <>
                <input
                  placeholder="New title..."
                  value={updatedTitle}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                />
                <input
                  placeholder="New URL..."
                  value={updatedUrl}
                  onChange={(e) => setUpdatedUrl(e.target.value)}
                />
                <button onClick={() => updateMovie(movie.id)}>Update Movie</button>
                <button onClick={() => setMovieIdToUpdate(null)}>Cancel</button>
              </>
            ) : (
              <button onClick={() => {
                setMovieIdToUpdate(movie.id);
                setUpdatedTitle(movie.title);
                setUpdatedUrl(movie.url);
              }}>
                Edit
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;
