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
    const T = inputData && inputData.length ? inputData.length : 1;
    const H = this._hiddenSize;
    
    // 어텐션의 O(T²·H)와 피드포워드의 O(T·H²) 연산량이 레이어 깊이만큼 누적 처리됨
    const attentionFlops = (T ** 2) * H;
    const ffnFlops = T * (H ** 2);
    
    return (attentionFlops + ffnFlops) * this._layers;
  }

  // 인터페이스 규격을 일치시키기 위해 매개변수 inputData 명시
  calculateTotalParameters(inputData) {
    return 12 * (this._hiddenSize ** 2) * this._layers;
  }
}