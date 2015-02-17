// myJavaScriptFile.js
// Version: 3.0.
// This exampe renders a simple sphere.

// Set the initialise function to be called
// when the page has loaded.
window.onload = init;

// set the size of our canvas / view onto the scene.
var WIDTH = 1280;
var HEIGHT =  720;

// set camera properties / attributes.
var VIEW_ANGLE = 45;
var ASPECT_RATIO = WIDTH / HEIGHT;
var NEAR_CLIPPING_PLANE = 0.1;
var FAR_CLIPPING_PLANE = 10000;

// Declare the ariablss we will need for the three.js
var renderer;
var scene;
var camera;

//stats information for our scene.
var stats; 

// declare the variables for items in our scene.
var cube;
var rotationDuration = 5; 

//used to determine the time between scene rendering
var clock = new THREE.clock();

//stores the three.js controls
var controls; 

// Initalise three.js
function init() {
  // Renderer.
  // ------------

  // create a WebGL renderer.
  renderer = new THREE.WebGLRenderer();

  // Set the rednerer size.
  renderer.setSize(WIDTH, HEIGHT);

  // Get element from the document ( our div) and append
  // the domElement (the canvas) to it.
  var docElement = document.getElementById('myDivContainer');
  docElement.appendChild(renderer.domElement);

  // Set the dar colour.
  renderer.setClearColor(0xccccff);
  
  //Stats. 
  // ------
stats = new Stats(); 
stats.domElement.style.position = 'absolute'; 
stats.domElement.style.top = '0px';
stats.domElement.style.zIndex = 100; 
docElement.appendChild( stats.domElement ); 
 
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
  camera.position.set(0,0, 300);
  
  // set up the camera controls
  controls = new THREE.FlyControls( camera );
  
  controls.movementSpeed = 100; 
  controls.domElement = docElement; 
  controls.rollSpeed = Math.PI / 12;
	controls.autoForward = false; 
	// means the user has to click and drag to look with the mouse
	controls.dragToLook = true; 

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
// a textured cube 
// -------------
// first  create the texture map
var textureMapURL = "images/wlv-logo.jpg"; 
var textureMap = THREE.ImageUtils.loadTexture(textureMapURL); 

// create a material and pass in the map
 var mapMaterial = new THREE.MeshBasicMaterial({ map: textureMap }); 
 
 // set up the box variables
 var height = 4; 
 var width = 4; 
 var depth = 4; 
 
 // create the box geometry
 var geometry = new THREE.BoxGeometry(height, width, depth ); 
 
cube = new THREE.Mesh(geometry, mapMaterial); 

  // position the cube in from of the camera  and tilt it toward the viewer
  cube.position.x = 0;
  cube.position.y = 0;
  cube.position.z = 0;

  // add the scene.
  scene.add(cube);
  
  //a basic light 
  // ------------
  
  // create a point light 
  var pointLight = new THREE.PointLight(0xFFFFFF);
  
  // set its position 
  pointLight.position.x = 10;
  pointLight.position.y = 20;
  pointLight.position.z = 130; 
  
  // add to the scene
  scene.add(pointLight); 
  }
  
// The game timer (aka game loop). Called x times per second.
function render(){
	var deltaTime = clock.getDelta();
	//update the controls
	controls.update( deltaTime );
	
  // Render the scene.
  renderer.render(scene, camera);

  //Update the stats
  stats.update(); 
  
  //rotate the cube 
  animate ( deltaTime ); 
  // Request the next frame.
  /* The "requestAnimationFrame()"" method tells the browser that
    you wish to perform an animation and request that browser call a specified
    function to update an anmiation before the next repaint. The method takes
    as an argument a callbakto be invoked before the repaint. */
  requestAnimationFrame(render);
}
