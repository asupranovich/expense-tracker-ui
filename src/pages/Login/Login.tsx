import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {authService} from '../../services/authService';
import './Login.css';

function Login() {
  const [isSignUp, setSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.authenticate(email, password);
      navigate('/expenses');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const showSignUp = () => {
    setSignUp(true);
  }

  const handleSignUp = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.signup(name, email, password);
      navigate('/expenses');
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please check your input.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="login-container">
        <div className="login-card">
          <h1>Expense Tracker</h1>
          <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>

          <form onSubmit={(e) => {isSignUp ? handleSignUp(e) : handleLogin(e)}}>
            {isSignUp && <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Enter name"
                />
            </div>
            }
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter password"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={loading} className="login-button">{isSignUp ? 'Sign Up' : 'Sign In'}</button>

            <div className="login-options">
              {!isSignUp &&
                  <>
                      Don't have an account? <a href="#" onClick={() => setSignUp(true)}>Sign Up</a>
                  </>
              }
              {isSignUp &&
                  <>
                      Already have an account? <a href="#" onClick={() => setSignUp(false)}>Sign In</a>
                  </>
              }
            </div>

          </form>
        </div>
      </div>
  );
}

export default Login;