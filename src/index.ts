import * as console from 'console';
import {TestResult} from './testingLib/TestResult';
import {TestCase} from './testingLib/TestCase';
import {TestSuite} from './testingLib/TestSuite';

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
