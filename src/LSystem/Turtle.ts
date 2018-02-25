import {vec3, vec4, mat4, mat3, quat} from 'gl-matrix';
import {gl} from '../globals';

class Turtle {
  position: vec3;
  aim: vec3;
  scale: vec3;
  originalHeight: number;
  up: vec3;
  quaternion: quat;
  level: number;

  constructor(position: vec3, aim: vec3, scale: vec3, height: number, up: vec3, quaternion: quat, level: number) {
    this.position = position;
    this.aim = aim;
    this.scale = scale;
    this.originalHeight = height;
    this.up = up;
    this.quaternion = quaternion;
    this.level = level;
  }

  toRadians(angle: number) {
    return Math.PI * angle / 180.0;
  }

  rotateVectorByQuat(v: vec3) {
    let result: vec3 = vec3.create();
    vec3.transformQuat(result, v, this.quaternion);
    return result;
  }
  
  rotate(axis: vec3, angle: number) {
    vec3.normalize(axis, axis);

    let q: quat = quat.create();
    quat.setAxisAngle(q, axis, this.toRadians(angle));
    quat.normalize(q, q);

    let tempAim: vec4 = vec4.fromValues(this.aim[0], this.aim[1], this.aim[2], 0);
    vec4.transformQuat(tempAim, tempAim, q);
    this.aim = vec3.fromValues(tempAim[0], tempAim[1], tempAim[2]);

    quat.rotationTo(this.quaternion, this.up, this.aim);
    quat.normalize(this.quaternion, this.quaternion);
  }

  reverseAimY() {
    this.aim[1] = -this.aim[1];
    quat.rotationTo(this.quaternion, this.up, this.aim);
    quat.normalize(this.quaternion, this.quaternion);
  }

  move() {
    let moveAmount: vec3 = vec3.create();
    vec3.copy(moveAmount, this.aim);
    vec3.scale(moveAmount, moveAmount, this.originalHeight * this.scale[1]);

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
    let newQuat = quat.create();
    quat.copy(newQuat, this.quaternion);

    let newTurtle: Turtle = new Turtle(newPosition, newAim, newScale, this.originalHeight, newUp, newQuat, this.level);
    return newTurtle;
  }
}

export default Turtle;