// MovieCard.js
import React from "react";
import "./MovieCard.css";

function MovieCard({ movie, onDelete, onUpdate, isAdmin }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [updatedTitle, setUpdatedTitle] = React.useState(movie.title);
  const [updatedUrl, setUpdatedUrl] = React.useState(movie.url);
  const [isUpdating, setIsUpdating] = React.useState(false); // Add loading state

  const handleUpdate = async () => {
    setIsUpdating(true); // Set loading state to true
    try {
      await onUpdate(movie.id, { title: updatedTitle, url: updatedUrl });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating movie:", err);
    } finally {
      setIsUpdating(false); // Set loading state to false
    }
  };

  return (
    <div className="movie-card">
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
      {isAdmin && (
        <>
          {isEditing ? (
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
              <button
                onClick={handleUpdate}
                disabled={isUpdating} // Disable button while updating
              >
                {isUpdating ? "Updating..." : "Update Movie"}
              </button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={() => onDelete()}>Delete Movie</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default MovieCard;
