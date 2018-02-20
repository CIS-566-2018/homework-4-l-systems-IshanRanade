import {vec3, vec4, mat4, mat3} from 'gl-matrix';
import Drawable from './rendering/gl/Drawable';
import {gl} from './globals';
import LSystem from './LSystem';
import Turtle from './Turtle';

class Plant extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;
  colors: Float32Array;
  center: vec4;

  lSystem: LSystem;

  meshes: any;

  constructor(center: vec3, meshes: any) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);

    let axiom: string = "FX";
    let grammar : { [key:string]:string; } = {};
    grammar["X"] = "[F+X]FXX";
    this.lSystem = new LSystem(axiom, grammar);
    this.meshes = meshes;
  }

  addCylinder(currentIndex: number, indices: number[], normals: number[], positions: number[], colors: number[], trans: mat4) {
    let cylinderMesh: any = this.meshes['cylinder'];

    for(let i: number = 0; i < cylinderMesh.indices.length; ++i) {
      let normal: vec4 = vec4.fromValues(cylinderMesh.vertexNormals[i * 3], cylinderMesh.vertexNormals[i * 3 + 1], cylinderMesh.vertexNormals[i * 3 + 2], 0);
      let position: vec4 = vec4.fromValues(cylinderMesh.vertices[i * 3], cylinderMesh.vertices[i * 3 + 1], cylinderMesh.vertices[i * 3 + 2], 1);

      vec4.transformMat4(normal, normal, trans);
      //vec4.transformMat4(normal, normal, modelMatrix);
      vec4.transformMat4(position, position, trans);
      //vec4.transformMat4(position, position, modelMatrix);

      indices.push(currentIndex + cylinderMesh.indices[i]);

      normals.push(normal[0]);
      normals.push(normal[1]);
      normals.push(normal[2]);
      normals.push(0);

      positions.push(position[0]);
      positions.push(position[1]);
      positions.push(position[2]);
      positions.push(1);

      colors.push(1);
      colors.push(0);
      colors.push(0);
      colors.push(1);
    }
  }

  create() {

    let lSystemString: string = this.lSystem.generateLSystemString(3);
    //let lSystemString: string = "F[F[F]F]FF";

    console.log(lSystemString);

    let cylinderMeshSize = this.meshes['cylinder'].indices.length;

    let minY: number =  1000000000000;
    let maxY: number = -1000000000000;
    for(let i: number = 0; i < this.meshes['cylinder'].vertices.length;  i+=3) {
      if(this.meshes['cylinder'].vertices[i+1] < minY) {
        minY = this.meshes['cylinder'].vertices[i+1];
      }

      if(this.meshes['cylinder'].vertices[i+1] > maxY) {
        maxY = this.meshes['cylinder'].vertices[i+1];
      }
    }
    let originalCylinderHeight = maxY - minY;

    let tempIndices: number[] = [];
    let tempNormals: number[] = [];
    let tempPositions: number[] = [];
    let tempColors: number[] = [];

    let currentIndex: number = 0;

    let turtles: Turtle[] = [];
    turtles.push(new Turtle(vec3.fromValues(0,0,0), mat4.create(), vec3.fromValues(0,1,0), vec3.fromValues(0.025,0.25,0.025), originalCylinderHeight));

    let turtle: Turtle = turtles[0];

    for(let i: number = 0; i < lSystemString.length; ++i) {
      let c: string = lSystemString[i];

      if(c == "F") {
        turtle.rotate(vec3.fromValues(0,0,1),  Math.random() * 30 + 10);
        this.addCylinder(currentIndex, tempIndices, tempNormals, tempPositions, tempColors, turtle.getTransMatrix());
        turtle.move();
        currentIndex += cylinderMeshSize;
      } else if(c == "[") {
        turtles.push(turtle.copy());
      } else if(c == "]") {
        turtle = turtles.pop();
      } else if(c == "+") {
        let tempAim: vec4 = vec4.fromValues(turtle.aim[0], turtle.aim[1], turtle.aim[2], 0);
        vec4.transformMat4(tempAim, tempAim, turtle.rotation);
        let tan: vec4 = vec4.fromValues(1,0,0,0);
        vec4.transformMat4(tan, tan, turtle.rotation);
        let bit: vec4 = vec4.fromValues(0,0,1,0);
        vec4.transformMat4(bit, bit, turtle.rotation);

        turtle.rotate(vec3.fromValues(tan[0], tan[1], tan[2]), Math.random() * 30 + 20);
        turtle.rotate(vec3.fromValues(bit[0], bit[1], bit[2]), Math.random() * 30 + 10);
        console.log(bit);
        console.log(tan);
      } else if(c == "-") {

      }
    }

    this.indices   = new Uint32Array(tempIndices);
    this.normals   = new Float32Array(tempNormals);
    this.positions = new Float32Array(tempPositions);
    this.colors    = new Float32Array(tempColors);

    this.generateIdx();
    this.generatePos();
    this.generateNor();
    this.generateCol();

    this.count = this.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
  }
};

export default Plant;