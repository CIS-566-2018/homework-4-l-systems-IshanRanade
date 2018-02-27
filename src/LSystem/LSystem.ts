import Node from "./Node"

export class LSystem {

  axiom: string;
  grammar: any;

  constructor(axiom: string, grammar: any) {
    this.axiom = axiom;
    this.grammar = grammar;
  }

  generateLSystemString(iterations: number) {
    let result: Node = new Node(this.axiom[0]);

    let temp = result;
    for(let i: number = 1; i < this.axiom.length; ++i) {
      temp.next = new Node(this.axiom[i]);
      temp = temp.next;
    }

    for(let i: number = 0; i < iterations; ++i) {
      let newNode: Node;
      let newNodeTemp: Node;

      let tempResult = result;
      while(tempResult != null) {
        let valToAdd: string;
        if(this.grammar[tempResult.val] != undefined) {
          valToAdd = this.grammar[tempResult.val];
        } else {
          valToAdd = tempResult.val;
        }

        for(let c of valToAdd) {
          if(newNode == undefined) {
            newNode = new Node(c);
            newNodeTemp = newNode;
          } else {
            newNodeTemp.next = new Node(c);
            newNodeTemp = newNodeTemp.next;
          }
        }

        tempResult = tempResult.next; 
      }

      result = newNode;
    }

    return result;
  }
};

export default LSystem;
