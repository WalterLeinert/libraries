import { JsonFormatter } from '../../src/serialization';

export abstract class SerializerBaseTest {
  protected formatter: JsonFormatter;

  before() {
    this.formatter = new JsonFormatter();
  }
}