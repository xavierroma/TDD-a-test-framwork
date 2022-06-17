import {TestCase} from './TestCase';
import {TestResult} from './TestResult';

export class TestSuite {
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
