import * as console from 'console';

abstract class TestCase {
  [key: string]: unknown;
  constructor(private name: string) {}
  public run() {
    const method = this[this.name];
    if (typeof method === 'function') {
      this.setUp();
      method.bind(this)();
    }
  }

  protected abstract setUp(): void;
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
}

class TestCaseTest extends TestCase {
  protected setUp() {}

  public testTemplateMethod() {
    const test = new WasRun('testMethod');
    test.run();
    console.assert(
      'setUp testMethod ' === test.log,
      'Invalid methods invocation order'
    );
  }
}

new TestCaseTest('testTemplateMethod').run();
