
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authService = {
  async authenticate(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    const token = data.token;

    localStorage.setItem('authToken', token);

    return token;
  },

  async signup(name: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, email, password }),
    });

    if (!response.ok) {
      throw new Error('Sign up failed');
    }

    const data = await response.json();
    const token = data.token;

    localStorage.setItem('authToken', token);

    return token;
  },

  logout() {
    localStorage.removeItem('authToken');
  },

  getToken() {
    return localStorage.getItem('authToken');
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};