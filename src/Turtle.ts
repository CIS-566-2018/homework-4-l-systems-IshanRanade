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

  move() {
    let tempAim: vec4 = vec4.fromValues(this.aim[0], this.aim[1], this.aim[2], 0);
    vec4.normalize(tempAim, tempAim);
    vec4.scale(tempAim, tempAim, this.height * this.scale[1]);
    vec4.transformMat4(tempAim, tempAim, this.rotation);
    
    
    vec3.add(this.position, this.position, vec3.fromValues(tempAim[0], tempAim[1], tempAim[2]));
  }

  copy() {
    let newTurtle: Turtle = new Turtle(this.position, this.rotation, this.aim, this.scale, this.height);
    return newTurtle;
  }
}

export default Turtle;