class FormatMovieEnum {
  constructor() {
    this.VHS = "VHS";
    this.DVD = "DVD";
    this.BLU_RAY = "Blu-Ray";
  }

  getValues() {
    return [this.VHS, this.DVD, this.BLU_RAY];
  }
}

module.exports = new FormatMovieEnum();
