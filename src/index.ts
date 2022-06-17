import * as console from 'console';

class TestResult {
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

abstract class TestCase {
  [key: string]: unknown;
  constructor(private name: string) {}
  public run(): TestResult {
    const result = new TestResult();
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
    return result;
  }

  protected abstract setUp(): void;
  protected abstract tearDown(): void;
}

class WasRun extends TestCase {
  public log: string = '';

  constructor(name: string) {
    super(name);
  }

  public testMethod() {
    this.log += 'testMethod ';
  }

  public testBrokenMethod() {
    throw Error('ERRRO');
  }

  protected setUp() {
    this.log = 'setUp ';
  }

  protected tearDown() {
    this.log += 'tearDown ';
  }
}

class TestCaseTest extends TestCase {
  protected setUp() {}
  protected tearDown() {}

  public testTemplateMethod() {
    const test = new WasRun('testMethod');
    test.run();
    console.assert(
      'setUp testMethod tearDown ' === test.log,
      `Invalid methods invocation order
      Expected 'setUp testMethod tearDown '
      Received '${test.log}'
        `
    );
  }

  public testResult() {
    const test = new WasRun('testMethod');
    const result = test.run();
    console.assert('1 run, 0 failed' == result.summary());
  }

  public testFailedResult() {
    const test = new WasRun('testBrokenMethod');
    const result = test.run();
    console.assert('1 run, 1 failed' == result.summary());
  }
}

console.log(new TestCaseTest('testTemplateMethod').run().summary());
console.log(new TestCaseTest('testResult').run().summary());
console.log(new TestCaseTest('testFailedResult').run().summary());
