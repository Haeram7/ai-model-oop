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
    return inputData.length * (this._hiddenStates ** 2);
  }

  // 부모 인터페이스 규격과 일치시키기 위해 inputData 매개변수 바인딩
  calculateTotalParameters(inputData) {
    return this._hiddenStates * (this._hiddenStates + this._hiddenStates + 1);
  }
}