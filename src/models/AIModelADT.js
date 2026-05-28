export class AIModelADT {
  constructor() {
    if (this.constructor === AIModelADT) {
      throw new Error("AIModelADT는 순수 추상 인터페이스(ADT)이므로 직접 인스턴스화할 수 없습니다.");
    }
  }

  introduce() {
    throw new Error("Abstract method 'introduce()'가 구현되지 않았습니다.");
  }

  calculateComplexity(inputData) {
    throw new Error("Abstract method 'calculateComplexity(inputData)'가 구현되지 않았습니다.");
  }

  calculateTotalParameters(inputData) {
    throw new Error("Abstract method 'calculateTotalParameters(inputData)'가 구현되지 않았습니다.");
  }
}