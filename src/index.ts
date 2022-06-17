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
  public wasRun: boolean = false;
  public wasSetUp: boolean = false;

  constructor(name: string) {
    super(name);
  }

  public testMethod() {
    this.wasRun = true;
  }

  protected setUp() {
    this.wasSetUp = true;
  }
}

class TestCaseTest extends TestCase {
  private test!: WasRun;

  protected setUp() {
    this.test = new WasRun('testMethod');
  }

  public testRunning() {
    console.assert(!this.test.wasRun);
    this.test.run();
    console.assert(this.test.wasRun);
  }

  public testSetUp() {
    this.test.run();
    console.assert(this.test.wasSetUp, 'test not set up');
  }
}

new TestCaseTest('testRunning').run();
new TestCaseTest('testSetUp').run();
