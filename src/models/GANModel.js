import { BaseModel } from './BaseModel';

export class GANModel extends BaseModel {
  constructor(name, latentDim = 100, hiddenDim = 256, outputDim = 784) {
    super(name, "Ian Goodfellow et al.", "2014", "생성적 적대 신경망 구조");
    this._latentDim = latentDim;
    this._hiddenDim = hiddenDim;
    this._outputDim = outputDim;
    this._paramsG = (latentDim * hiddenDim) + (hiddenDim * outputDim);
    this._paramsD = (outputDim * hiddenDim) + hiddenDim;
    this._totalParams = this._paramsG + this._paramsD;
  }

  introduce() {
    return {
      ...super.introduce(),
      latentDim: this._latentDim,
      outputDim: this._outputDim,
      paramsG: this._paramsG.toLocaleString(),
      paramsD: this._paramsD.toLocaleString(),
    };
  }

  calculateComplexity(inputData) {
    return this._totalParams * inputData.length;
  }

  calculateTotalParameters() {
    return this._totalParams;
  }
}