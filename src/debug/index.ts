/**
 * Debug Manager für die Olympia 2026 Webapp
 * Bietet verschiedene Debug-Optionen und einen zentralen Switch für den Debug-Modus.
 */

export class DebugManager {
  private static _isDebugMode: boolean = true;

  /**
   * Gibt zurück, ob der Debug-Modus aktiviert ist.
   */
  static get isDebugMode(): boolean {
    return this._isDebugMode;
  }

  /**
   * Aktiviert oder deaktiviert den Debug-Modus.
   * @param enabled - true für Aktivierung, false für Deaktivierung
   */
  static setDebugMode(enabled: boolean): void {
    this._isDebugMode = enabled;
    console.log(`Debug-Modus ${enabled ? 'aktiviert' : 'deaktiviert'}`);
  }

  /**
   * Loggt eine Nachricht nur im Debug-Modus.
   * @param message - Die zu loggende Nachricht
   */
  static log(message: string): void {
    if (this._isDebugMode) {
      console.log(`[DEBUG] ${message}`);
    }
  }

  /**
   * Gibt zurück, ob Test-Daten verwendet werden sollen.
   * @returns true, wenn Debug-Modus aktiviert ist
   */
  static enableTestData(): boolean {
    return this._isDebugMode;
  }

  /**
   * Zeigt Debug-Informationen in der UI (z.B. zusätzliche Panels).
   * @returns true, wenn Debug-Modus aktiviert ist
   */
  static showDebugUI(): boolean {
    return this._isDebugMode;
  }

  /**
   * Aktiviert erweiterte Fehlerberichterstattung.
   * @returns true, wenn Debug-Modus aktiviert ist
   */
  static enableVerboseErrors(): boolean {
    return this._isDebugMode;
  }

  // Hier können weitere Debug-Optionen hinzugefügt werden, z.B.
  // static mockAPIResponses(): boolean { return this._isDebugMode; }
}