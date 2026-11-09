import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';
import CreateAccount from "../helperfuncs/Signup";

export default function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setError("");
    const result = await CreateAccount({ username, email, password });
    
    if (result.success) {
      navigate('/login');
    } else {
      if (result.reason === "User exists") {
        setError("An account with this email or username already exists.");
      } else {
        setError("A server error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">Sign Up</h1>
          <p className="auth-subtitle">Create your account</p>
        </div>

        <div className="auth-form">
          {error && <div className="error-message" style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="auth-button" onClick={handleSignUp}>Sign Up</button>

          <div className="auth-footer">
            <span>Already have an account? </span>
            <button 
              className="auth-link" 
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
