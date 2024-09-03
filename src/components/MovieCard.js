import "./MovieCard.css";

function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <h1>{movie.title}</h1>
      {movie.imageUrl && (
        <img
          src={movie.imageUrl}
          alt={movie.title}
          className="movie-image"
        />
      )}
      <p>
        URL: <a href={movie.url} target="_blank" rel="noopener noreferrer">{movie.url}</a>
      </p>
    </div>
  );
}

export default MovieCard;
