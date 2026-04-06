// Simple localStorage-based authentication
interface User {
  username: string;
  role: 'admin' | 'user';
  createdAt: string;
}

interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

// Default admin credentials
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123',
};

export function getUsers(): Record<string, { password: string; user: Omit<User, 'username'> }> {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem('app_users');
  if (stored) return JSON.parse(stored);
  
  // Initialize with admin user
  const defaultUsers: Record<string, { password: string; user: Omit<User, 'username'> }> = {
    [DEFAULT_ADMIN.username]: {
      password: DEFAULT_ADMIN.password,
      user: { role: 'admin', createdAt: new Date().toISOString() },
    },
  };
  if (typeof window !== 'undefined') localStorage.setItem('app_users', JSON.stringify(defaultUsers));
  return defaultUsers;
}

export function login(username: string, password: string): AuthResult {
  const users = getUsers();
  const user = users[username.toLowerCase()];
  
  if (!user) {
    return { success: false, error: 'Invalid username or password' };
  }
  
  if (user.password !== password) {
    return { success: false, error: 'Invalid username or password' };
  }
  
  const session: User = {
    username,
    role: user.user.role,
    createdAt: user.user.createdAt,
  };
  
  if (typeof window !== 'undefined') localStorage.setItem('app_session', JSON.stringify(session));
  return { success: true, user: session };
}

export function register(username: string, password: string, role: 'admin' | 'user' = 'user'): AuthResult {
  const users = getUsers();
  
  if (users[username.toLowerCase()]) {
    return { success: false, error: 'Username already exists' };
  }
  
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }
  
  users[username.toLowerCase()] = {
    password,
    user: { role, createdAt: new Date().toISOString() },
  };
  
  if (typeof window !== 'undefined') localStorage.setItem('app_users', JSON.stringify(users));
  
  const session: User = { username, role, createdAt: new Date().toISOString() };
  if (typeof window !== 'undefined') localStorage.setItem('app_session', JSON.stringify(session));
  
  return { success: true, user: session };
}

export function logout(): void {
  if (typeof window !== 'undefined') localStorage.removeItem('app_session');
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('app_session');
  if (stored) return JSON.parse(stored);
  return null;
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === 'admin';
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}