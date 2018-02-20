import {vec3, vec4, mat4, mat3} from 'gl-matrix';
import Drawable from './rendering/gl/Drawable';
import {gl} from './globals';

class Turtle {
  position: vec3;
  rotation: mat4;
  aim: vec3;
  scale: vec3;

  constructor(position: vec3, rotation: mat4, aim: vec3, scale: vec3) {
    this.position = position;
    this.rotation = rotation;
    this.aim = aim;
    this.scale = scale;
  }

  getTransMatrix() {
    let trans: mat4 = mat4.create();
    mat4.scale(trans, trans, this.scale);
    mat4.multiply(trans, trans, this.rotation);
    mat4.translate(trans, trans, this.position);
    return trans;
  }
}

export default Turtle;