import {vec3, vec4, mat4, mat3} from 'gl-matrix';
import Drawable from './rendering/gl/Drawable';
import {gl} from './globals';

class Turtle {
  position: vec3;
  rotation: mat4;
  aim: vec3;
  scale: vec3;
  height: number;

  constructor(position: vec3, rotation: mat4, aim: vec3, scale: vec3, height: number) {
    this.position = position;
    this.rotation = rotation;
    this.aim = aim;
    this.scale = scale;
    this.height = height;
  }

  getTransMatrix() {
    let trans: mat4 = mat4.create();
    mat4.translate(trans, trans, this.position);
    mat4.multiply(trans, trans, this.rotation);
    mat4.scale(trans, trans, this.scale);
    return trans;
  }
  
  rotate(axis: vec3, angle: number) {
    mat4.rotate(this.rotation, this.rotation, angle * 3.14159265 / 180.0, axis);
  }

  move(prevTurtle: Turtle) {
    let tempAim: vec4 = vec4.fromValues(prevTurtle.aim[0], prevTurtle.aim[1], prevTurtle.aim[2], 0);
    vec4.normalize(tempAim, tempAim);
    vec4.scale(tempAim, tempAim, prevTurtle.height * prevTurtle.scale[1]);
    vec4.transformMat4(tempAim, tempAim, prevTurtle.rotation);
    
    
    vec3.add(this.position, this.position, vec3.fromValues(tempAim[0], tempAim[1], tempAim[2]));
  }
}

export default Turtle;