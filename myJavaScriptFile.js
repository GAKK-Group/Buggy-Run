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

// Declare the variables we will need for the three.js
var renderer;
var scene;
var camera;
var stats;

var clock = new THREE.Clock();
var keyboard = new THREEx .KeyboardState();

var mouseOverCanvas;
var mouseDown;

var keyboard;

var raycaster;
var raycasterf;

var objects = [];

var canJump = false;
var yVelocity = 0;
var yAcceleration = 2.0;

var seaMesh;
var landMesh;

var myColladaLoader;
var car;
var terrain;
var ring;

var ringAnimations;
var keyFrameAnimations = [];
var keyFrameAnimationsLength = 0;
var lastFrameCurrentTime = [];

var projector;

var skyBoxMesh;
var texture_placeholder;

function init() {

  renderer = new THREE.WebGLRenderer();


  var docElement = document.getElementById('myDivContainer');
  docElement.appendChild(renderer.domElement);

  renderer.setClearColor("rgb(135,206,250)");

  renderer.setSize( window.innerWidth, window.innerHeight );
  // Set the rednerer size for window rescale.
  window.addEventListener( 'resize', onWindowResize, false );
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  stats.domElement.style.zIndex = 100;
  docElement.appendChild( stats.domElement );

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT_RATIO, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);

  scene.add(camera);
  camera.position.set(0,0,30);
  camera.lookAt(scene.position);


  raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0 ,-1, 0), 0, 10);



  initScene();


  render();
}


function initScene() {

  texture_placeholder = document.createElement( 'canvas' );
  texture_placeholder.width = 128;
  texture_placeholder.height = 128;

  var context = texture_placeholder.getContext( '2d' );
  context.fillStyle = 'rgb( 200, 200, 200)';
  context.fillRect( 0 , 0, texture_placeholder.width, texture_placeholder.height );

  var materials = [
    loadTexture( ' textures/cube/skybox/nx.png' ),
    loadTexture( ' textures/cube/skybox/px.png' ),
    loadTexture( ' textures/cube/skybox/py.png' ),
    loadTexture( ' textures/cube/skybox/ny.png' ),
    loadTexture( ' textures/cube/skybox/pz.png' ),
    loadTexture( ' textures/cube/skybox/nz.png' )
  ];

skyBoxMesh = new THREE.Mesh( new THREE.BoxGeometry( 10000, 10000, 10000, 7, 7, 7), new THREE.MeshFaceMaterial( materials ));

skyBoxMesh.scale.x = - 1;
scene.add(skyBoxMesh);

  var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
  light.position.set( 1, 1, 1 );
  scene.add( light );

  projector = new THREE.Projector();

  var light2 = new THREE.DirectionalLight( 0xffffff, 0.75);
  light2.position.set( -1, - 0.5, -1 );
  scene.add( light2 );

  myColladaLoader = new THREE.ColladaLoader();
  myColladaLoader.options.convertUpAxis = true;

	var ring = myColladaLoader.load( 'ringanimated.DAE', function ( collada ) {
			// Here we store the dae in a global variable.
			ring = collada.scene;

      ringAnimations = collada.animations;

      keyFrameAnimationsLength = ringAnimations.length;

      for ( var i = 0; i < keyFrameAnimationsLength; i++ ) {
        lastFrameCurrentTime[i];
      }

      for ( var i = 0; i < keyFrameAnimationsLength; i++ ) {
        var animation = ringAnimations[ i ];

        var keyFrameAnimation = new THREE.KeyFrameAnimation( animation );
        keyFrameAnimation.timeScale = 1;
        keyFrameAnimation.loop = false;

        keyFrameAnimations.push( keyFrameAnimation );
      }

			// Position your model in the scene (world space).objects
      ring.position.set(0,-1.5,20);
      ring.rotation.y = 4.6;
			// Scale your model to the correct size.
      ring.scale.x = ring.scale.y = ring.scale.z = 0.03;
      ring.updateMatrix();

			// Add the model to the scene.

      ring.name = "ring";
			scene.add(ring);
      objects.push(ring);

		} );


    myColladaLoader.load( 'TerrainAza (2).DAE', function ( collada ) {
        // Here we store the dae in a global variable.
        terrain = collada.scene;

        // Position your model in the scene (world space).
        terrain.position.x = 0;
        terrain.position.y = 11;
        terrain.position.z = 0;

        // Scale your model to the correct size.
        terrain.scale.x = terrain.scale.y = terrain.scale.z = 1;
        terrain.updateMatrix();

        // Add the model to the scene.
        terrain.name = "terrain";
        scene.add(terrain);
        objects.push(terrain);

        startAnimations();
      } );

}

function startAnimations() {
  for ( var i = 0; i < keyFrameAnimationsLength; i++)  {
    var animation = keyFrameAnimations[i];
    animation.play();
  }
}


function loopAnimations() {
  for ( var i = 0; i < keyFrameAnimationsLength; i ++ ) {
    if(keyFrameAnimations[i].isPlaying && !keyFrameAnimations[i].isPaused) {
      if(keyFrameAnimations[i].currentTime == lastFrameCurrentTime[i]) {
        keyFrameAnimations[i].stop();
        keyFrameAnimations[i].play();
        lastFrameCurrentTime[i] = 0;
      }
    }
  }
}

function render() {

  var deltaTime = clock.getDelta();

  THREE.AnimationHandler.update( deltaTime );
  loopAnimations();

  var tmpY = camera.position.y;

  var matrix = new THREE.Matrix4();
  matrix.extractRotation( camera.matrix );

  //raycasterf = new THREE.Raycaster( camera.position,0,50);
  //raycasterf.ray.origin.copy( camera.position );
  //raycasterf.ray.origin.x = 1;
  //var intersections = raycasterf.intersectObjects(objects,true);

  camera.position.y = tmpY;

  raycaster.ray.origin.copy( camera.position );
  raycaster.ray.y = -5;
  var intersections = raycaster.intersectObjects( objects, true );

  yVelocity = yVelocity  - yAcceleration * deltaTime;

  camera.position.y = camera.position.y = yVelocity;

  document.getElementById("debugInfo").innerHTML =  "intersections.length = " + intersections.length;

    if ( intersections.length > 0) {
      if(camera.position.y < tmpY) {
        camera.position.y = tmpY;
      }
    }

    var moveDistance = 20 * deltaTime;
    var rotateAngle = Math.PI / 2 * deltaTime;
    var rotation_matrix = new THREE.Matrix4().identity();

    if ( keyboard.pressed("W") ) {
      camera.translateZ( -moveDistance );
    }
    if ( keyboard.pressed("S") ) {
      camera.translateZ(  moveDistance );
    }
    if ( keyboard.pressed("A") ) {
      camera.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
    }
    if ( keyboard.pressed("D") ) {
      camera.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
    }



  renderer.render(scene, camera);

  stats.update();

  requestAnimationFrame(render);

  for ( var i = 0; i < keyFrameAnimationsLength; i++ ) {
    lastFrameCurrentTime[i] = keyFrameAnimations[i].currentTime;
  }
}
function loadTexture( path ) {
  var texture = new THREE.Texture( texture_placeholder );
  var material = new THREE.MeshBasicMaterial( {map: texture, overdraw: 0.5 });

  var image = new Image();

  image.onload = function () {
    texture.image = this;
    texture.needsUpdate = true;
  };

  image.src = path;

  return material;
}
