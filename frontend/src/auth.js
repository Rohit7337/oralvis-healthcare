export function setAuth({ token, role, email }) {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  localStorage.setItem('email', email);
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('email');
}

export function isAuthed() {
  return !!localStorage.getItem('token');
}

export function getRole() {
  return localStorage.getItem('role');
}
