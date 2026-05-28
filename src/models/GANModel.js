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
    const batchSize = inputData && inputData.length ? inputData.length : 1;
    return this._totalParams * batchSize;
  }

  // 인터페이스 규격을 일치시키기 위해 매개변수 inputData 명시
  calculateTotalParameters(inputData) {
    return this._totalParams;
  }
}