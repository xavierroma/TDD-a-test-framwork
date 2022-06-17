export class TestResult {
  private runCount = 0;
  private failedCount = 0;

  public testStarted(): void {
    this.runCount++;
  }

  public testFailed(): void {
    this.failedCount++;
  }

  public summary(): string {
    return `${this.runCount} run, ${this.failedCount} failed`;
  }
}
