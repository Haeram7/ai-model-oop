import { BaseModel } from './BaseModel';

export class CNNModel extends BaseModel {
  constructor(name, outChannels = 32, kernelSize = 3) {
    super(name, "Yann LeCun et al.", "1989", "합성곱 신경망 구조");
    this._outChannels = outChannels;
    this._kernelSize = kernelSize;
  }

  introduce() {
    return {
      ...super.introduce(),
      inputType: "컬러 이미지(RGB)",
      outChannels: this._outChannels,
      kernelSize: `${this._kernelSize}x${this._kernelSize}`,
    };
  }

  calculateComplexity(inputData) {
    const [w, h, c] = inputData;
    return w * h * c * this._outChannels * (this._kernelSize ** 2);
  }

  calculateTotalParameters(inputData) {
    const [, , c] = inputData;
    return ((this._kernelSize ** 2 * c) + 1) * this._outChannels;
  }
}