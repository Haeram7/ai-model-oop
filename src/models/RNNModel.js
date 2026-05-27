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

  calculateTotalParameters() {
    return this._hiddenStates * (this._hiddenStates + this._hiddenStates + 1);
  }
}