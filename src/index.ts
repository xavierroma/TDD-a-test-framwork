import * as console from 'console';

abstract class TestCase {
  [key: string]: unknown;
  constructor(private name: string) {}
  public run() {
    const method = this[this.name];
    if (typeof method === 'function') {
      this.setUp();
      method.bind(this)();
      this.tearDown();
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
}

new TestCaseTest('testTemplateMethod').run();
