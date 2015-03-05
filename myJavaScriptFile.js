// myJavaScriptFile.js
// Version: 3.0.
// This exampe renders a simple sphere.

// Set the initialise function to be called
// when the page has loaded.
window.onload = init;

// set the size of our canvas / view onto the scene.
var WIDTH = window.innerWidth;
var HEIGHT =  window.innerHeight;

// set camera properties / attributes.
var VIEW_ANGLE = 45;
var ASPECT_RATIO = WIDTH / HEIGHT;
var NEAR_CLIPPING_PLANE = 0.1;
var FAR_CLIPPING_PLANE = 10000;

// Declare the ariablss we will need for the three.js
var renderer, scene, camera, stats, keyboard, myColladaLoader, car, terrain;

//used to determine the time between scene rendering
var clock = new THREE.Clock();
var keyboard = new THREEx .KeyboardState();

// Initalise three.js
function init() {
  // Renderer.
  // ------------

  // create a WebGL renderer.
  renderer = new THREE.WebGLRenderer();

// Set the renderer size.
  renderer.setSize( window.innerWidth, window.innerHeight );
  // Set the rednerer size for window rescale.
  window.addEventListener( 'resize', onWindowResize, false );
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

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
  scene.add(camera);
  camera.position.set(0,20,50);
  camera.lookAt(scene.position);

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

	// Basic lights.
	// --------------

	var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
	light.position.set( 1, 1, 1 );
	scene.add( light );

	var light = new THREE.DirectionalLight( 0xffffff, 0.75 );
	light.position.set( -1, - 0.5, -1 );
	scene.add( light );

	// Add a model to the scene.
	// -------------------------
	myColladaLoader = new THREE.ColladaLoader();
	myColladaLoader.options.convertUpAxis = true;

	myColladaLoader.load( 'car.dae', function ( collada ) {
			// Here we store the dae in a global variable.
			car = collada.scene;

			// Position your model in the scene (world space).
			car.position.x = 0;
			car.position.y = 1.6;
			car.position.z = 0;
			car.rotation.set( -Math.PI * 0,-1.5,0);

			// Scale your model to the correct size.
			car.scale.x = car.scale.y = car.scale.z = 0.1;
			car.updateMatrix();

			// Add the model to the scene.
			scene.add( car );
		} );

	// Add a model to the scene.
	// -------------------------
	myColladaLoader = new THREE.ColladaLoader();
	myColladaLoader.options.convertUpAxis = true;

	myColladaLoader.load( 'terrain.dae', function ( collada ) {
			// Here we store the dae in a global variable.
			terrain = collada.scene;

			// Position your model in the scene (world space).
			terrain.position.x = 0;
			terrain.position.y = 0;
			terrain.position.z = 0;

			// Scale your model to the correct size.
			terrain.scale.x = terrain.scale.y = terrain.scale.z = 3;
			terrain.updateMatrix();

			// Add the model to the scene.
			scene.add( terrain );
		} );
}

// The game timer (aka game loop). Called x times per second.
function render(){

	// Here we control how the camera looks around the scene.
  var deltaTime = clock.getDelta();
  var moveDistance = 30 * deltaTime;
  var rotateAngle = Math.PI / 2 * deltaTime;
  var rotation_matrix = new THREE.Matrix4().identity();

  if ( keyboard.pressed("W") ) {
    car.translateX( -moveDistance );
  }
  if ( keyboard.pressed("S") ) {
    car.translateX(  moveDistance );
  }
  if ( keyboard.pressed("A") ) {
    car.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
  }
  if ( keyboard.pressed("D") ) {
    car.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
  }


    /*var relativeCameraOffset = new THREE.Vector3(0,50,200);
    var cameraOffset = relativeCameraOffset.applyMatrix4( car.matrixWorld);
    camera.position.x = cameraOffset.x;
    camera.position.y = cameraOffset.y;
    camera.position.z = cameraOffset.z;
    camera.lookAt( car.position );*/

  // Render the scene.
  renderer.render(scene, camera);

  //Update the stats
  stats.update();

  // Request the next frame.
  /* The "requestAnimationFrame()"" method tells the browser that
    you wish to perform an animation and request that browser call a specified
    function to update an anmiation before the next repaint. The method takes
    as an argument a callbakto be invoked before the repaint. */
  requestAnimationFrame(render);
}
