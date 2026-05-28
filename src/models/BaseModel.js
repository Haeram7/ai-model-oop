import { AIModelADT } from './AIModelADT';

export class BaseModel extends AIModelADT {
  constructor(name, proposedBy, year, coreMechanism) {
    super();
    if (this.constructor === BaseModel) {
      throw new Error("BaseModel은 추상 클래스이므로 직접 인스턴스화할 수 없습니다.");
    }
    this._name = name;
    this._proposedBy = proposedBy;
    this._year = year;
    this._coreMechanism = coreMechanism;
  }

  get name() { return this._name; }
  get proposedBy() { return this._proposedBy; }
  get year() { return this._year; }
  get coreMechanism() { return this._coreMechanism; }

  introduce() {
    return {
      name: this._name,
      proposedBy: this._proposedBy,
      year: this._year,
      coreMechanism: this._coreMechanism,
    };
  }

  calculateComplexity(inputData) {
    throw new Error("Abstract method 'calculateComplexity(inputData)'를 오버라이딩해야 합니다.");
  }

  calculateTotalParameters(inputData) {
    throw new Error("Abstract method 'calculateTotalParameters(inputData)'를 오버라이딩해야 합니다.");
  }
}