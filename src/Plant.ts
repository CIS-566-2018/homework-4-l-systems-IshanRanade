import {vec3, vec4, mat4, mat3} from 'gl-matrix';
import Drawable from './rendering/gl/Drawable';
import {gl} from './globals';
import LSystem from './LSystem';
import Turtle from './Turtle';

class Plant {
  translationsBark: number[] = [];
  quaternionsBark: number[] = [];
  scalesBark: number[] = [];
  barkInstanceCount: number = 0;

  translationsLeaf: number[] = [];
  quaternionsLeaf: number[] = [];
  scalesLeaf: number[] = [];
  leafInstanceCount: number = 0;

  lSystem: LSystem;

  meshes: any;

  constructor(center: vec3, meshes: any) {
    let axiom: string = "FX";
    let grammar : { [key:string]:string; } = {};
    grammar["X"] = "[F+X]FX[-FX][+F-+XF]";
    this.lSystem = new LSystem(axiom, grammar);
    this.meshes = meshes;
  }

  rand(x: vec3) {
    let n: number = x[0] * 137 + x[1] * 122237 + x[2] * 13;
    return Math.abs(Math.sin(n) * 43758.5453123) - Math.floor(Math.abs(Math.sin(n) * 43758.5453123));
  }

  createTree() {
    let lSystemString: string = this.lSystem.generateLSystemString(5);

    let barkName = "bark";
    let cylinderMeshSize = this.meshes[barkName].indices.length;

    let minY: number =  1000000000000;
    let maxY: number = -1000000000000;
    for(let i: number = 0; i < this.meshes[barkName].vertices.length;  i+=3) {
      if(this.meshes[barkName].vertices[i+1] < minY) {
        minY = this.meshes[barkName].vertices[i+1];
      }

      if(this.meshes[barkName].vertices[i+1] > maxY) {
        maxY = this.meshes[barkName].vertices[i+1];
      }
    }

    this.translationsBark = [1,1,0,0,-1,-1,0,0];
    this.quaternionsBark = [0,0,0,0,0,0,0,0];
    this.scalesBark = [0,0,0,0,0,0,0,0];
    this.barkInstanceCount = 2;

    // let originalCylinderHeight = maxY - minY;
    // let currentIndex: number = 0;
    // let baseTrans: mat4 = mat4.create();
    // mat4.scale(baseTrans, baseTrans, vec3.fromValues(0.35,0.05,0.35)); 
    // mat4.translate(baseTrans, baseTrans, vec3.fromValues(0,-1.5,0));
    
    // currentIndex += cylinderMeshSize;

    // let turtles: Turtle[] = [];
    // turtles.push(new Turtle(vec3.fromValues(0,0,0), vec3.fromValues(0,1,0), vec3.fromValues(0.025,0.25,0.025), originalCylinderHeight, vec3.fromValues(0,1,0)));

    // let turtle: Turtle = turtles[0];

    // console.log(turtle.position);

    // for(let i: number = 0; i < lSystemString.length; ++i) {
    //   let c: string = lSystemString[i];

    //   if(c == "F") {
    //     turtle.rotate(vec3.fromValues(0,0,1), (Math.random() - 0.5) * 30);
    //     turtle.rotate(vec3.fromValues(1,0,0),  (Math.random() - 0.5) * 30);

    //     if(turtle.aim[1] < 0) {
    //       turtle.aim[1] = -turtle.aim[1];
    //     }

    //     this.addMesh(currentIndex, tempIndices, tempNormals, tempPositions, tempColors, turtle.getTransMatrix(), vec4.fromValues(81/255.0, 63/255.0, 27/255.0, 1), 'cylinder');
    //     turtle.move();
    //     console.log(turtle.position);
    //     currentIndex += cylinderMeshSize;
    //   } else if(c == "[") {
    //     turtles.push(turtle.copy());
    //     vec3.scale(turtle.scale, turtle.scale, 0.6);
    //   } else if(c == "]") {
    //     turtle = turtles.pop();
    //     turtle.rotate(vec3.fromValues(0,0,1),  (Math.random() - 0.5) * 90);
    //   } else if(c == "+") {
    //     let tempAim: vec4 = vec4.fromValues(turtle.aim[0], turtle.aim[1], turtle.aim[2], 0);

    //     let tan: vec4 = vec4.fromValues(1,0,0,0);
    //     vec4.transformMat4(tan, tan, turtle.getRotationMatrixFromDirectionVector(vec3.fromValues(tan[0], tan[1], tan[2]), turtle.up));

    //     let bit: vec4 = vec4.fromValues(0,0,1,0);
    //     vec4.transformMat4(bit, bit, turtle.getRotationMatrixFromDirectionVector(vec3.fromValues(bit[0], bit[1], bit[2]), turtle.up));

    //     turtle.rotate(vec3.fromValues(tan[0], tan[1], tan[2]), (Math.random() - 0.5) * 30);
    //     turtle.rotate(vec3.fromValues(bit[0], bit[1], bit[2]), (Math.random() - 0.5) * 30);
    //   } else if(c == "-") {
    //     let tempAim: vec4 = vec4.fromValues(turtle.aim[0], turtle.aim[1], turtle.aim[2], 0);

    //     let tan: vec4 = vec4.fromValues(1,0,0,0);
    //     vec4.transformMat4(tan, tan, turtle.getRotationMatrixFromDirectionVector(vec3.fromValues(tan[0], tan[1], tan[2]), turtle.up));

    //     let bit: vec4 = vec4.fromValues(0,0,1,0);
    //     vec4.transformMat4(bit, bit, turtle.getRotationMatrixFromDirectionVector(vec3.fromValues(bit[0], bit[1], bit[2]), turtle.up));

    //     turtle.rotate(vec3.fromValues(tan[0], tan[1], tan[2]), (Math.random() - 0.5) * 360);
    //     turtle.rotate(vec3.fromValues(bit[0], bit[1], bit[2]), (Math.random() - 0.5) * 360);
    //   }
    // }
  }
};

export default Plant;