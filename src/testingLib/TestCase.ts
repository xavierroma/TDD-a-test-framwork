import {TestResult} from './TestResult';

export abstract class TestCase {
  [key: string]: unknown;

  constructor(private name: string) {}

  public run(result: TestResult): void {
    const method = this[this.name];
    if (typeof method === 'function') {
      result.testStarted();
      this.setUp();
      try {
        method.bind(this)();
      } catch (e) {
        result.testFailed();
      } finally {
        this.tearDown();
      }
    }
  }

  protected abstract setUp(): void;

  protected abstract tearDown(): void;
}
