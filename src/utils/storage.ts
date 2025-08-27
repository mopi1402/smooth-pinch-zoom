export class Storage {
  static get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {}
  }

  static clear(): void {
    try {
      localStorage.clear();
    } catch {}
  }
}
