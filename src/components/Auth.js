import { useState, useEffect } from "react";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
// import "./Auth.css"; // Ensure you include this CSS file for styling

function Auth({ onSignIn, onSignOut }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      if (onSignIn) onSignIn();
    } catch (err) {
      setError("Failed to sign in. Please check your email and password.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      if (onSignOut) onSignOut();
    } catch (err) {
      setError("Failed to sign out.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      {user ? (
        <div>
          <p className="welcome-message">Welcome, {user.email}</p>
          <button className="sign-out-button" onClick={handleSignOut} disabled={loading}>
            {loading ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      ) : (
        <div>
          <h2>Please LogIn to Manage</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignIn} disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
}

export default Auth;
