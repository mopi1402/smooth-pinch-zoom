export class Debouncer {
  private timeout: number | null = null;

  constructor(private delay: number, private callback: () => void) {}

  private schedule(): void {
    this._clean();
    this.timeout = window.setTimeout(() => {
      this.callback();
      this.timeout = null;
    }, this.delay);
  }

  public trigger(): void {
    this.schedule();
  }

  private _clean(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  public destroy(): void {
    this._clean();
  }
}

export function debounce(
  callback: () => void,
  delay: number = 3000
): Debouncer {
  return new Debouncer(delay, callback);
}
