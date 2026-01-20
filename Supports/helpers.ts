export class Helpers {
  static generateRandomString(length: number = 8): string {
    return Math.random().toString(36).substring(2, length + 2);
  }

  static generateEmployeeId(): string {
    return `EMP${Date.now()}`;
  }

  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  static async waitForTimeout(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}