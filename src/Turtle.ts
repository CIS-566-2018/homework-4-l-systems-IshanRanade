import {vec3, vec4, mat4, mat3, quat} from 'gl-matrix';
import Drawable from './rendering/gl/Drawable';
import {gl} from './globals';

class Turtle {
  position: vec3;
  aim: vec3;
  scale: vec3;
  height: number;
  up: vec3;

  constructor(position: vec3, aim: vec3, scale: vec3, height: number, up: vec3) {
    this.position = position;
    this.aim = aim;
    this.scale = scale;
    this.height = height;
    this.up = up;
  }

  getTransMatrix() {
    let trans: mat4 = mat4.create();
    mat4.translate(trans, trans, this.position);
    mat4.multiply(trans, trans, this.getRotationMatrixFromDirectionVector(this.aim, this.up));
    mat4.scale(trans, trans, this.scale);
    return trans;
  }

  getRotationMatrixFromDirectionVector(direction: vec3, up: vec3) {
    if(vec3.equals(direction, up)) {
      let result: mat4 = mat4.create();
      mat4.identity(result);
      return result;
    }

    let q: quat = quat.create();
    let a: vec3 = vec3.create();
    vec3.cross(a, up, direction);
    q[0] = a[0];
    q[1] = a[1];
    q[2] = a[2];
    q[3] = 1 + vec3.dot(up, direction);
    quat.normalize(q, q);

    let result: mat4 = mat4.create();
    mat4.fromQuat(result, q);

    return result;
  }

  toRadians(angle: number) {
    return Math.PI * angle / 180.0;
  }
  
  rotate(axis: vec3, angle: number) {
    vec3.normalize(axis, axis);

    let q: quat = quat.create();
    quat.setAxisAngle(q, axis, this.toRadians(angle));

    let trans: mat4 = mat4.create();
    mat4.fromQuat(trans, q);

    let tempAim: vec4 = vec4.fromValues(this.aim[0], this.aim[1], this.aim[2], 0);
    vec4.transformMat4(tempAim, tempAim, trans);

    vec4.normalize(tempAim, tempAim);

    this.aim = vec3.fromValues(tempAim[0], tempAim[1], tempAim[2]);
    vec3.normalize(this.aim, this.aim);
  }

  move() {
    let moveAmount: vec3 = vec3.create();
    vec3.copy(moveAmount, this.aim);
    vec3.scale(moveAmount, moveAmount, this.height * this.scale[1]);

    vec3.add(this.position, this.position, moveAmount);
  }

  copy() {
    let newPosition: vec3 = vec3.create();
    vec3.copy(newPosition, this.position);
    let newAim: vec3 = vec3.create();
    vec3.copy(newAim, this.aim);
    let newScale: vec3 = vec3.create();
    vec3.copy(newScale, this.scale);
    let newUp = vec3.create();
    vec3.copy(newUp, this.up);

    let newTurtle: Turtle = new Turtle(newPosition, newAim, newScale, this.height, newUp);
    return newTurtle;
  }
}

export default Turtle;