import {vec3, vec4, mat4, mat3} from 'gl-matrix';
import Drawable from './rendering/gl/Drawable';
import {gl} from './globals';
import LSystem from './LSystem';

var OBJ = require('webgl-obj-loader');

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
    grammar["X"] = "[F+X]";
    this.lSystem = new LSystem(axiom, grammar);
    this.meshes = meshes;
  }

  getCylinder(currentIndex: number, indices: number[], normals: number[], positions: number[], colors: number[]) {
    let cylinderMesh: any = this.meshes['cylinder'];

    for(let i: number = 0; i < cylinderMesh.indices.length; ++i) {
      indices.push(currentIndex + cylinderMesh.indices[i]);

      normals.push(cylinderMesh.vertexNormals[i * 3]);
      normals.push(cylinderMesh.vertexNormals[i * 3 + 1]);
      normals.push(cylinderMesh.vertexNormals[i * 3 + 2]);
      normals.push(0);

      positions.push(cylinderMesh.vertices[i * 3]);
      positions.push(cylinderMesh.vertices[i * 3 + 1]);
      positions.push(cylinderMesh.vertices[i * 3 + 2]);
      positions.push(1);

      colors.push(1);
      colors.push(0);
      colors.push(0);
      colors.push(1);
    }

  }

  create() {

    let lSystemString: string = this.lSystem.generateLSystemString(2);

    // this.indices = new Uint32Array([0, 1, 2,
    //                                 0, 2, 3]);
    // this.normals = new Float32Array([0, 0, 1, 0,
    //                                 0, 0, 1, 0,
    //                                 0, 0, 1, 0,
    //                                 0, 0, 1, 0]);
    // this.positions = new Float32Array([-1, -1, 0, 1,
    //                                 1, -1, 0, 1,
    //                                 1, 1, 0, 1,
    //                                 -1, 1, 0, 1]);
    // this.colors = new Float32Array([0, 1, 1, 1,
    //                                 0, 1, 0, 1,
    //                                 0, 1, 0, 1,
    //                                 0, 1, 0, 1]);

    let cylinderMesh: any = this.meshes['cylinder'];

    let tempIndices: number[] = [];
    let tempNormals: number[] = [];
    let tempPositions: number[] = [];
    let tempColors: number[] = [];

    console.log(tempIndices);

    this.getCylinder(0, tempIndices, tempNormals, tempPositions, tempColors);
 
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

    console.log(`Created square`);
  }
};

export default Plant;