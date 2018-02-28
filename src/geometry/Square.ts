import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';

class Square extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;
  colors: Float32Array;
  center: vec4;

  constructor(center: vec3) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);
  }

  create() {

    let topLeft: vec3     = vec3.fromValues(196, 77, 255);
    vec3.scale(topLeft, topLeft, 1/255.0);
    let topRight: vec3    = vec3.fromValues(196, 77, 255);
    vec3.scale(topRight, topRight, 1/255.0);
    let bottomLeft: vec3  = vec3.fromValues(255, 117, 26);
    vec3.scale(bottomLeft, bottomLeft, 1/255.0);
    let bottomRight: vec3 = vec3.fromValues(255, 117, 26);
    vec3.scale(bottomRight, bottomRight, 1/255.0);

    this.indices = new Uint32Array([0, 1, 2,
                                    0, 2, 3]);
    this.normals = new Float32Array([0, 0, 1, 0,
                                    0, 0, 1, 0,
                                    0, 0, 1, 0,
                                    0, 0, 1, 0]);
    this.positions = new Float32Array([-1.0, -1.0, 0.99999, 1,
                                    1.0, -1.0, 0.99999, 1,
                                    1.0, 1.0, 0.99999, 1,
                                    -1.0, 1.0, 0.99999, 1]);
    this.colors = new Float32Array([bottomLeft[0], bottomLeft[1], bottomLeft[2], 1,
                                    bottomRight[0], bottomRight[1], bottomRight[2], 1,
                                    topRight[0], topRight[1], topRight[2], 1,
                                    topLeft[0], topLeft[1], topLeft[2], 1]);

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

export default Square;
