import { BaseModel } from './BaseModel';

export class RNNModel extends BaseModel {
  constructor(name, hiddenStates = 128) {
    super(name, "David Rumelhart et al.", "1986", "순환 신경망 구조");
    this._hiddenStates = hiddenStates;
  }

  introduce() {
    return {
      ...super.introduce(),
      hiddenStates: this._hiddenStates,
    };
  }

  calculateComplexity(inputData) {
    const T = inputData && inputData.length ? inputData.length : 1;
    return T * (this._hiddenStates ** 2);
  }

  // 인터페이스 규격을 일치시키기 위해 매개변수 inputData 명시
  calculateTotalParameters(inputData) {
    return this._hiddenStates * (this._hiddenStates + this._hiddenStates + 1);
  }
}