class LSystem {

  axiom: string;
  grammar: any;

  constructor(axiom: string, grammar: any) {
    this.axiom = axiom;
    this.grammar = grammar;
  }

  generateLSystemString(iterations: number) {
    let result: string = this.axiom;

    for(let i: number = 0; i < iterations; ++i) {
      let newString: string = "";

      for(let j: number = 0; j < result.length; ++j) {
        if(this.grammar[result[j]] != undefined) {
          newString += this.grammar[result[j]];
        } else {
          newString += result[j];
        }
      }

      result = newString;
    }

    return result;
  }
};

export default LSystem;