import {vec3, vec4} from 'gl-matrix';
import Drawable from './rendering/gl/Drawable';
import {gl} from './globals';
import LSystem from './LSystem';


//var loader = require('raw-loader');
//import cylinderMeshPath from './objs/cylinder.obj';
//import cylinder from './objs/cylinder.obj';s

//import txt from 'raw-loader!./objs/cylinder.obj';

//var fs = require('fs');
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
 
    this.indices   = new Uint32Array(cylinderMesh.indices);
    this.normals   = new Float32Array(cylinderMesh.indices.length * 4);
    this.positions = new Float32Array(cylinderMesh.indices.length * 4);
    this.colors    = new Float32Array(cylinderMesh.indices.length * 4);

    console.log(cylinderMesh);

    for(let i: number = 0; i < cylinderMesh.indices.length; ++i) {
      this.normals[i * 4]     = cylinderMesh.vertexNormals[i * 3];
      this.normals[i * 4 + 1] = cylinderMesh.vertexNormals[i * 3 + 1];
      this.normals[i * 4 + 2] = cylinderMesh.vertexNormals[i * 3 + 2];
      this.normals[i * 4 + 3] = 0;

      this.positions[i * 4]     = cylinderMesh.vertices[i * 3];
      this.positions[i * 4 + 1] = cylinderMesh.vertices[i * 3 + 1];
      this.positions[i * 4 + 2] = cylinderMesh.vertices[i * 3 + 2];
      this.positions[i * 4 + 3] = 1;

      this.colors[i * 4]     = 1;
      this.colors[i * 4 + 1] = 0;
      this.colors[i * 4 + 2] = 0;
      this.colors[i * 4 + 3] = 1;
    }

    console.log(this.normals);

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