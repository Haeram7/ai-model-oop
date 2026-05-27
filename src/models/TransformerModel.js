import { BaseModel } from './BaseModel';

export class TransformerModel extends BaseModel {
  constructor(name, heads = 8, layers = 6, hiddenSize = 512) {
    super(name, "Vaswani et al.", "2017", "어텐션 기반 트랜스포머 구조");
    this._heads = heads;
    this._layers = layers;
    this._hiddenSize = hiddenSize;
  }

  introduce() {
  return {
    ...super.introduce(),
    heads: this._heads,
    layers: this._layers,
    hiddenSize: this._hiddenSize,
  };
}

  calculateComplexity(inputData) {
    return (inputData.length ** 2) * this._hiddenSize;
  }

  calculateTotalParameters() {
    return 12 * (this._hiddenSize ** 2) * this._layers;
  }
}