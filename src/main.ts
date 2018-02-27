import {vec3,vec4,mat4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Icosphere from './geometry/Icosphere';
import Square from './geometry/Square';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import LSystem from './LSystem/LSystem'
import Plant from './LSystem/Plant'
import PlantPart from './geometry/PlantPart'
import Rock from './geometry/Rock';

var OBJ = require('webgl-obj-loader');
var meshes: any;
window.onload = function() {
  OBJ.downloadMeshes({
    'bark': 'src/objs/cylinder.obj',
    'cherryBlossom': 'src/objs/cherryBlossom.obj',
    'rock': 'src/objs/rock.obj'
  }, function(m: any) {
    meshes = m;
    main();
  });
}

var seedrandom = require('seedrandom');

let plant: Plant;

let bark: PlantPart;
let leaf: PlantPart;
let rock: Rock;

let background: Square;

let barkColor: vec3 = vec3.fromValues(30,2,2);
let leafColor: vec3 = vec3.fromValues(245, 177, 245);
let rockColor: vec3 = vec3.fromValues(50,50,50);

let iterations = 6;
let seed: number = 9;

let collisionCheck: boolean = false;

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  tesselations: 5,
  'Generate': loadScene, // A function pointer, essentially
  'Leaf Color': [leafColor[0], leafColor[1], leafColor[2]],
  'Bark Color': [barkColor[0], barkColor[1], barkColor[2]],
  'Iterations': 6,
  'Leaf Collision': (function() {
    collisionCheck = !collisionCheck;
    seed--;
    loadScene();
  })
};

function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex: string) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
}

function loadScene() {
  plant = new Plant(vec3.fromValues(0,0,0), meshes, iterations, seedrandom(seed), collisionCheck);
  plant.createTree();

  leaf = new PlantPart(vec3.fromValues(0,0,0), meshes, "cherryBlossom", 
          vec4.fromValues(leafColor[0]/255.0,leafColor[1]/255.0,leafColor[2]/255.0,1), mat4.create());
  leaf.setInstanceProperties(plant.translationsLeaf, plant.quaternionsLeaf, plant.scalesLeaf, plant.leafInstanceCount);
  leaf.create();

  bark = new PlantPart(vec3.fromValues(0,0,0), meshes, "bark", 
          vec4.fromValues(barkColor[0]/255.0, barkColor[1]/255.0, barkColor[2]/255.0, 1), mat4.create());
  bark.setInstanceProperties(plant.translationsBark, plant.quaternionsBark, plant.scalesBark, plant.barkInstanceCount);
  bark.create();

  background = new Square(vec3.fromValues(0,0,0));
  background.create();

  seed++;
}

function main() {
  
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.addColor
  gui.add(controls, 'Generate');
  gui.addColor({'Leaf Color': rgbToHex(leafColor[0], leafColor[1], leafColor[2])}, 'Leaf Color').onChange(
    function(hex: string) {
      let rgb = hexToRgb(hex);
      leafColor = vec3.fromValues(rgb.r,rgb.g,rgb.b);
    }
  );
  gui.addColor({'Bark Color': rgbToHex(barkColor[0], barkColor[1], barkColor[2])}, 'Bark Color').onChange(
    function(hex: string) {
      let rgb = hexToRgb(hex);
      barkColor = vec3.fromValues(rgb.r,rgb.g,rgb.b);
    }
  );
  gui.add(controls, 'Iterations').min(1).max(7).step(1).onChange(
    function(iter: number) {
      iterations = iter;
    }
  )
  gui.add(controls, 'Leaf Collision');

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  let cameraPos: vec3 = vec3.fromValues(0, 25, -200);
  vec3.rotateY(cameraPos, cameraPos, vec3.fromValues(0,0,0), 290 * Math.PI / 180.0);
  const camera = new Camera(cameraPos, vec3.fromValues(0, 35, 0));

  const renderer = new OpenGLRenderer(canvas);
  //renderer.setClearColor(1,0,0,1);
  //renderer.setClearColor(187/255.0, 249/255.0, 249/255.0, 1);
  //renderer.setClearColor(239/255.0, 201/255.0, 212/255.0, 1);
  gl.enable(gl.DEPTH_TEST);

  const lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
  ]);

  const backgroundShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/background-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/background-frag.glsl')),
  ]);

  let rockTrans: mat4 = mat4.create();
  mat4.translate(rockTrans, rockTrans, vec3.fromValues(12,-315,-23));
  mat4.rotateY(rockTrans, rockTrans, 10);
  mat4.scale(rockTrans, rockTrans, vec3.fromValues(15,15,15));

  rock = new Rock(vec3.fromValues(0,0,0), meshes, "rock", 
          vec4.fromValues(rockColor[0]/255.0,rockColor[1]/255.0,rockColor[2]/255.0,1), rockTrans);
  rock.create();

  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();

    renderer.render(camera, backgroundShader, [
      background
    ]);

    renderer.render(camera, lambert, [
      leaf,
      bark,
      rock
    ]);



    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();

  // Start the render loop
  tick();
}
