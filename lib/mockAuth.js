export const mockAuth = {
  currentUser: null,
  signIn: async (credentials) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const { email, password } = credentials;
    if (email === 'admin@library.com' && password === 'admin123') {
      return { uid: '1', email, username: 'admin', isAdmin: true };
    } else if (email && password) {
      // For login, you might need to handle username-based login differently
      return { uid: '2', email, username: email.split('@')[0], isAdmin: false };
    }
    throw new Error('Invalid credentials');
  },
  signUp: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const { username, email, password } = userData;
    return { 
      uid: Date.now().toString(), 
      username, 
      email, 
      isAdmin: false 
    };
  },
  signOut: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
  }
};