import * as console from 'console';

class TestCase {
  [key: string]: unknown;
  constructor(private name: string) {}
  public run() {
    const method = this[this.name];
    if (typeof method === 'function') {
      method.bind(this)();
    }
  }
}

class WasRun extends TestCase {
  public wasRun: boolean;
  constructor(name: string) {
    super(name);
    this.wasRun = false;
  }

  public testMethod() {
    this.wasRun = true;
  }
}

class TestCaseTest extends TestCase {
  public testRunning() {
    const test = new WasRun('testMethod');
    console.assert(!test.wasRun);
    test.run();
    console.assert(test.wasRun);
  }
}

new TestCaseTest('testRunning').testRunning();
