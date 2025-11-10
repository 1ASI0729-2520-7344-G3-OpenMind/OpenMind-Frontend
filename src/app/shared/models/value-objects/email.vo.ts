export class EmailValueObject {
  private constructor(private readonly raw: string) {}

  static create(value: string): EmailValueObject | null {
    const normalized = (value ?? '').trim().toLowerCase();
    if (!normalized) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(normalized) ? new EmailValueObject(normalized) : null;
  }

  value(): string {
    return this.raw;
  }
}
