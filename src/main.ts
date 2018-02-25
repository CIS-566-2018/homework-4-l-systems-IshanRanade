import {vec3,vec4,mat4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Icosphere from './geometry/Icosphere';
import Square from './geometry/Square';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import LSystem from './LSystem'
import Plant from './Plant'
import PlantPart from './PlantPart'

var OBJ = require('webgl-obj-loader');
var meshes: any;
window.onload = function() {
  OBJ.downloadMeshes({
    'bark': 'src/objs/cylinder2.obj',
    'leaf': 'src/objs/leaf.obj',
    'cherryBlossom': 'src/objs/cherryBlossom.obj'
  }, function(m: any) {
    meshes = m;
    main();
  });
}

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  tesselations: 5,
  'Load Scene': loadScene, // A function pointer, essentially
};

let plant: Plant;

let bark: PlantPart;
let leaf: PlantPart;

function loadScene() {
  plant = new Plant(vec3.fromValues(0,0,0), meshes);
  plant.createTree();

  leaf = new PlantPart(vec3.fromValues(0,0,0), meshes, "cherryBlossom", vec4.fromValues(230/255.0,152/255.0,234/255.0,1), mat4.create());
  leaf.setInstanceProperties(plant.translationsLeaf, plant.quaternionsLeaf, plant.scalesLeaf, plant.leafInstanceCount);
  leaf.create();

  bark = new PlantPart(vec3.fromValues(0,0,0), meshes, "bark", vec4.fromValues(81/255.0, 63/255.0, 27/255.0, 1), mat4.create());
  bark.setInstanceProperties(plant.translationsBark, plant.quaternionsBark, plant.scalesBark, plant.barkInstanceCount);
  bark.create();

  console.log(leaf.instances);
  console.log(bark.instances);
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
  gui.add(controls, 'tesselations', 0, 8).step(1);
  gui.add(controls, 'Load Scene');

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

  const camera = new Camera(vec3.fromValues(0, 0,80), vec3.fromValues(0, 20, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.8, 0.8, 0.8, 1);
  gl.enable(gl.DEPTH_TEST);

  const lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    renderer.render(camera, lambert, [
       leaf,
       bark
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
