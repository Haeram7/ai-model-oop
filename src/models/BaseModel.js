export class BaseModel {
  constructor(name, proposedBy, year, coreMechanism) {
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
    return inputData.length * 100;
  }

  calculateTotalParameters(inputData) {
    return inputData.length * 1000;
  }
}