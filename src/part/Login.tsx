import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';
import Login from '../helperfuncs/Login';

export default function LoginFunc() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    const success = await Login({ email, password });
    if (success) {
      navigate("/");
    } else {
      setError("Incorrect email or password");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">Login</h1>
          <p className="auth-subtitle">Login to access your CSKAI account</p>
        </div>

        <div className="auth-form">
          {error && <div className="error-message" style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
          
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="auth-button" onClick={handleLogin}>Login</button>

          <div className="auth-footer">
            <span>Don't have an account? </span>
            <button 
              className="auth-link" 
              onClick={() => navigate('/sign-up')}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
