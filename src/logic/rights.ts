import { loginApi } from '../services/auth';
import { DebugManager } from '../debug';

/**
 * Rollen für das Rechte-System
 */
export const Role = {
  Admin: 'admin',
  Referee: 'referee',
} as const;

export type RoleType = typeof Role[keyof typeof Role];

/**
 * Benutzer-Schnittstelle
 */
export interface User {
  email: string;
  role: RoleType;
  token?: string;
}

/**
 * Test-Accounts für Debug-Modus
 */
const testAccounts: Record<string, { password: string; role: RoleType }> = {
  'admin@test.com': { password: 'admin', role: Role.Admin },
  'referee@test.com': { password: 'referee', role: Role.Referee },
};

/**
 * Holt den aktuell eingeloggten Benutzer aus localStorage
 */
export function getCurrentUser(): User | null {
  const userJson = localStorage.getItem('currentUser');
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Loggt den Benutzer ein
 * @param email - E-Mail-Adresse oder Benutzername
 * @param password - Passwort
 * @returns User-Objekt bei Erfolg, null bei Fehler
 */
export async function login(email: string, password: string): Promise<User | null> {
  try {
    // Versuche zuerst die API
    const response = await loginApi(email, password);
    
    const user: User = {
      email,
      role: Role.Referee, // Standard-Rolle von der API
      token: response.token,
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('authToken', response.token);
    window.dispatchEvent(new Event('storage'));
    DebugManager.log(`Benutzer ${email} über API eingeloggt`);
    
    return user;
  } catch (apiError) {
    DebugManager.log('API Login fehlgeschlagen, versuche Debug-Modus...');
    
    // Fallback auf Debug-Modus wenn API fehlschlägt und Debug-Modus aktiv ist
    if (DebugManager.isDebugMode) {
      const account = testAccounts[email];
      if (account && account.password === password) {
        const user: User = {
          email,
          role: account.role,
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.dispatchEvent(new Event('storage'));
        DebugManager.log(`Benutzer ${email} im Debug-Modus eingeloggt`);
        return user;
      }
    }
    
    return null;
  }
}

/**
 * Prüft, ob der aktuelle Benutzer eine bestimmte Rolle hat
 * @param role - Die zu prüfende Rolle
 * @returns true, wenn der Benutzer die Rolle hat
 */
export function hasRole(role: RoleType): boolean {
  const user = getCurrentUser();
  return user ? user.role === role : false;
}

/**
 * Prüft, ob der aktuelle Benutzer Admin ist
 * @returns true, wenn Admin
 */
export function isAdmin(): boolean {
  return hasRole(Role.Admin);
}

/**
 * Prüft, ob der aktuelle Benutzer Referee ist
 * @returns true, wenn Referee
 */
export function isReferee(): boolean {
  return hasRole(Role.Referee);
}

/**
 * Loggt den Benutzer aus
 */
export function logout(): void {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('authToken');
  window.dispatchEvent(new Event('storage'));
  DebugManager.log('Benutzer ausgeloggt');
}