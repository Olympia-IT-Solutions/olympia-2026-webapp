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
 * @param email - E-Mail-Adresse
 * @param password - Passwort
 * @returns User-Objekt bei Erfolg, null bei Fehler
 */
export function login(email: string, password: string): User | null {
  let user: User | null = null;

  if (DebugManager.isDebugMode) {
    // Im Debug-Modus Test-Accounts verwenden
    const account = testAccounts[email];
    if (account && account.password === password) {
      user = { email, role: account.role };
    }
  } else {
    // Hier könnte echte Auth-Logik implementiert werden, z.B. API-Call
    // Für jetzt: Simuliere erfolgreichen Login für jede Eingabe (nicht empfohlen für Produktion)
    user = { email, role: Role.Referee }; // Standard-Rolle
  }

  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    window.dispatchEvent(new Event('storage'));
    DebugManager.log(`Benutzer ${email} eingeloggt mit Rolle ${user.role}`);
  }

  return user;
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
  window.dispatchEvent(new Event('storage'));
  DebugManager.log('Benutzer ausgeloggt');
}