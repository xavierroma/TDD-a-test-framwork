import * as console from 'console';

class TestSuite {
  private tests: TestCase[] = [];

  public add(test: TestCase) {
    this.tests.push(test);
  }

  public run(result: TestResult): void {
    for (const test of this.tests) {
      test.run(result);
    }
  }
}

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
  private result!: TestResult;
  protected setUp() {
    this.result = new TestResult();
  }
  protected tearDown() {}

  public testTemplateMethod() {
    const test = new WasRun('testMethod');
    test.run(new TestResult());
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
    test.run(this.result);
    console.assert('1 run, 0 failed' == this.result.summary());
  }

  public testFailedResult() {
    const test = new WasRun('testBrokenMethod');
    test.run(this.result);
    console.assert('1 run, 1 failed' == this.result.summary());
  }

  public testSuite() {
    const suite = new TestSuite();
    suite.add(new WasRun('testMethod'));
    suite.add(new WasRun('testBrokenMethod'));
    suite.run(this.result);
    console.assert('2 run, 1 failed' == this.result.summary());
  }
}

const suite = new TestSuite();
suite.add(new TestCaseTest('testTemplateMethod'));
suite.add(new TestCaseTest('testResult'));
suite.add(new TestCaseTest('testFailedResult'));
suite.add(new TestCaseTest('testSuite'));
const result = new TestResult();
suite.run(result);
console.log(result.summary());
