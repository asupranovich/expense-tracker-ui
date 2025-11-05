
const API_BASE_URL = 'http://localhost:8080';

export const authService = {
  async authenticate(email: String, password: String) {
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