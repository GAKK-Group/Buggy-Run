// myJavaScriptFile.js
// Version: 3.0.
// This exampe renders a simple sphere.

// Set the initialise function to be called
// when the page has loaded.
window.onload = init;

// set the size of our canvas / view onto the scene.
var WIDTH = 800;
var HEIGHT = 600;

// set camera properties / attributes.
var VIEW_ANGLE = 45;
var ASPECT_RATIO = WIDTH / HEIGHT;
var NEAR_CLIPPING_PLANE = 0.1;
var FAR_CLIPPING_PLANE = 10000;

// Declare the ariablss we will need for the three.js
var renderer;
var scene;
var camera;

// Decalre the variables for items in our sence.
var sphere;

// Initalise three.js
function init() {
  // Renderer.
  // ------------

  // create a WebGL renderer.
  renderer = new THREE.WebGLRender();

  // Set the rednerer size.
  renderer.setSize(WIDTH, HEIGHT);

  // Get element from the document ( our div) and append
  // the domElement (the canvas) to it.
  var docElement = document.getElementByID('myDivContainer');
  docElement.appendChild(renderer.domElement);

  // Set the dar colour.
  renderer.setClearColor(0xccccff);

  // Scene.
  // --------

  // Create a WebGL scene.
  scene = new THREE.Scene();

  // Camera.
  // ----------

  // Create a WebGL camera.
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT_RATIO, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);


  // Set the position of the camera.
  // The camera starts at 0,0,0 ...so we move it back.

  // Start the scene.
  // --------------------

  // Now lets initialise the scene. Put things in it,
  // such as meshes and light.
  initScene();

  // Start rendering the scene.
  render();
}

// Initialise the scene
function  initScene(){
  // A simple mesh.
  // -------------------
  // Lets now create a simple mesh to put in our scene.

  // set up the sphere variables.
  var radius = 100;
  var segments = 16;
  var rings = 16;

  // The sphere material.
  var sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0xff0000
  });

  // create a new mesh with sphere geometry.
  sphere = new THREE.Mesh( new THREE.SphereGeomety(radius, segments, rings), sphereMaterial);

  // Alther the position of the sphere. It's default position is 0,0,0.
  sphere.position.y = 2;

  // Add the spjere to the scene.
  scene.add(sphere);

  // A basic light.
  // ----------------

  // create a point light.
  var pointLight = new THREE.PointLight(0xFFFFF);

  // set its position.
  pointLight.position.x = 10;
  pointLight.position.y = 20;
  pointLight.position.z = 130;
  
  // add the scene.
  scene.add(pointLight);
}

// The game timer (aka game loop). Called x times per second.
function render(){
  // Render the scene.
  renderer.render(scene. camera);

  // Request the next frame.
  /* The "requestAnimationFrame()"" method tells the browser that
    you wish to perform an animation and request that browser call a specified
    function to update an anmiation before the next repaint. The method takes
    as an argument a callbakto be invoked before the repaint. */
  requestAnimationFrame(render);
}
