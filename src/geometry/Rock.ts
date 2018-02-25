import {vec3, vec4, mat4, quat} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';

class Rock extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;
  colors: Float32Array;
  center: vec4;

  objName: string;
  meshes: any;
  color: vec4;
  model: mat4;

  constructor(center: vec3, meshes: any, objName: string, color: vec4, model: mat4) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);
    this.meshes = meshes;
    this.objName = objName;
    this.color = color;
    this.model = model;
    this.isInstanced = false;
  }

  create() {
    let mesh: any = this.meshes[this.objName];

    let tempIndices: number[] = [];
    let tempPositions: number[] = [];
    let tempNormals: number[] = [];
    let tempColors: number[] = [];

    for(let i: number = 0; i < mesh.indices.length; ++i) {
      tempIndices.push(mesh.indices[i]);

      let modNormal: vec3 = vec3.fromValues(mesh.vertexNormals[i*3], mesh.vertexNormals[i*3+1], mesh.vertexNormals[i*3+2]);

      let tan: vec3 = vec3.create();
      let bit: vec3 = vec3.create();

      if(vec3.equals(modNormal, vec3.fromValues(1,0,0))) {
        vec3.cross(tan, modNormal, vec3.fromValues(0,1,0));
        vec3.cross(bit, modNormal, tan);
      } else if(vec3.equals(modNormal, vec3.fromValues(0,1,0))) {
        vec3.cross(tan, modNormal, vec3.fromValues(0,0,1));
        vec3.cross(bit, modNormal, tan);
      } else {
        vec3.cross(tan, modNormal, vec3.fromValues(1,0,0));
        vec3.cross(bit, modNormal, tan);
      }

      let trans: mat4 = mat4.create();
      mat4.rotate(trans, trans, Math.random() * 0.2, tan);
      mat4.rotate(trans, trans, Math.random() * 0.2, bit);

      let tempNormal: vec4 = vec4.fromValues(modNormal[0], modNormal[1], modNormal[2], 0);
      vec4.transformMat4(tempNormal, tempNormal, trans);

      let tempPosition: vec4 = vec4.fromValues(mesh.vertices[i*3], mesh.vertices[i*3+1], mesh.vertices[i*3+2], 1);

      vec4.transformMat4(tempNormal, tempNormal, this.model);
      vec4.transformMat4(tempPosition, tempPosition, this.model);

      tempNormals.push(tempNormal[0], tempNormal[1], tempNormal[2], 0);
      tempPositions.push(tempPosition[0], tempPosition[1], tempPosition[2], 1);
      tempColors.push(this.color[0], this.color[1], this.color[2], this.color[3]);
    }

    this.indices = new Uint32Array(tempIndices);
    this.normals = new Float32Array(tempNormals);
    this.positions = new Float32Array(tempPositions);
    this.colors = new Float32Array(tempColors);

//     this.indices = new Uint32Array([0, 1, 2,
//       0, 2, 3]);
// this.normals = new Float32Array([0, 0, 1, 0,
//       0, 0, 1, 0,
//       0, 0, 1, 0,
//       0, 0, 1, 0]);
// this.positions = new Float32Array([-1, -1, 0, 1,
//       1, -1, 0, 1,
//       1, 1, 0, 1,
//       -1, 1, 0, 1]);
// this.colors = new Float32Array([0, 1, 1, 1,
//       0, 1, 0, 1,
//       0, 1, 0, 1,
//       0, 1, 0, 1]);

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

export default Rock;
