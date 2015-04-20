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

var projector;

var skyBoxMesh;
var texture_placeholder;

function init() {

  renderer = new THREE.WebGLRenderer();


  var docElement = document.getElementById('myDivContainer');
  docElement.appendChild(renderer.domElement);

  renderer.setClearColor("rgb(135,206,250)");

  renderer.domElement.onmouseover=function(e) { mouseOverCanvas = true; }
  renderer.domElement.onmousemove=function(e) { mouseOverCanvas = true; }
  renderer.domElement.onmouseout=function(e) { mouseOverCanvas = false; }

  renderer.domElement.onmousedown=function(e) { mouseDown = true; }
  renderer.domElement.onmouseup=function(e) { mouseDown = false; }

  renderer.domElement.ondbclick=onDoubleClick;

  docElement.onkeydown=function(e) {
    switch (e.keyCode ) {
      case 32:
        if(canJump){
          yVelocity= 2.5;
          canJump = false;
        }
    }
  }


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

  var seaGeometry = new THREE.PlaneGeometry( 10000, 10000, 100, 100 );
  seaGeometry.applyMatrix( new THREE.Matrix4().makeRotationX(  -Math.PI  / 2) );

  var seaMaterial = new THREE.MeshBasicMaterial( {color: 0x1e90ff} );

  seaMesh = new THREE.Mesh(seaGeometry, seaMaterial);

  seaMesh.position.y = -10;

  seaMesh.name = "sea";
  scene.add( seaMesh );
  objects.push( seaMesh );

  /*var landGeometry = new THREE.PlaneGeometry( 1500, 1500, 100, 100 );
  landGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI / 2 ) );

  for (var i = 0; i < landGeometry.vertices.length; i ++) {
    var vertex = landGeometry.vertices[ i ];
    vertex.x +=Math.random() * 20 - 10;
    vertex.y += Math.random() * 2;
    vertex.z += Math.random() * 20 - 10;
  }

  for (var i = 0; i < landGeometry.faces.length; i ++) {
    var face = landGeometry.faces[ i ];
    face.vertexColors[ 0 ] = new THREE.Color("rgb(0,255,0)").setHSL (Math.random() * 0.2 + 0.25, 0.75, 0.75);
    face.vertexColors[ 1 ] = new THREE.Color("rgb(0,255,0)").setHSL (Math.random() * 0.2 + 0.25, 0.75, 0.75);
    face.vertexColors[ 2 ] = new THREE.Color("rgb(0,255,0)").setHSL (Math.random() * 0.2 + 0.25, 0.75, 0.75);
  }

  var landMaterial = new THREE.MeshBasicMaterial( {vertexColors: THREE.VertexColors} );
  landMesh = new THREE.Mesh( landGeometry, landMaterial );

  landMesh.position.y = -10;

  landMesh.name = "land";
  scene.add( landMesh );
  objects.push( landMesh );*/

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

	myColladaLoader.load( 'ringnew.DAE', function ( collada ) {
			// Here we store the dae in a global variable.
			ring = collada.scene;

			// Position your model in the scene (world space).objects
      ring.position.set(-3,-0.8,20);
      ring.rotation.y = 4.6;
			// Scale your model to the correct size.
      ring.scale.x = ring.scale.y = ring.scale.z = 0.03;
      ring.updateMatrix();

			// Add the model to the scene.

      ring.name = "ring";
			scene.add(ring);
      objects.push(ring);
		} );


    myColladaLoader.load( 'terrain4.DAE', function ( collada ) {
        // Here we store the dae in a global variable.
        terrain = collada.scene;

        // Position your model in the scene (world space).
        terrain.position.x = 0;
        terrain.position.y = -1;
        terrain.position.z = 0;

        // Scale your model to the correct size.
        terrain.scale.x = terrain.scale.y = terrain.scale.z = 1;
        terrain.updateMatrix();

        // Add the model to the scene.
        scene.add(terrain);
        objects.push(terrain);
      } );

}

function onDoubleClick( event ) {
  mouseDown = false;

  var canvasLeft = 10;
  var canvasTop = 10;

  var tempX = event.clientX - canvasLeft;
  var tempY = event.clientY - canvasTop;

  var vector = new THREE.Vecotr3( ( tempX / WIDTH) * 2 - 1, - ( tempY / HEIGHT) * + 1, 0.5);

  projector.unprojectVecotr( vector, camera);

  var raycaster = new THREE.Raycaster( camera.position, vector.sub(camera.position).normalize());

  var intersects = raycaster.intersectObjects( objects, true);

  if (interscets.length > 0) {
    var tempStr = "Number of items: " + intersects.length + " ";

    for(var i = 0;  i < intersects.length; i++) {
      if(intersects[ i ].object.name != " ") {
        tempStr += " | Name: " + intersects[ i ].object.name;
      } else {
        tempStr += " | Name: " + intersects[ i ].object.parent.id;
      }
    }
    document.getElementById("debugInfo2").innerHTML = tempStr + ".<br>";
  }
}


function render() {



  var deltaTime = clock.getDelta();

  var tmpY = camera.position.y;



  camera.position.y = tmpY;

  raycaster.ray.origin.copy( camera.position );
  raycaster.ray.y = -5;
  var intersections = raycaster.intersectObjects( objects );

  yVelocity = yVelocity  - yAcceleration * deltaTime;

  camera.position.y = camera.position.y = yVelocity;

  document.getElementById("debugInfo").innerHTML = "Debug Info: <br>" + "camera.position.y = " + camera.position.y
    + ".<br>" + "intersections.length = " + intersections.length + ".<br>" + "yVelocity = " + yVelocity + ".<br>";

    if ( intersections.length > 0) {
      if(camera.position.y < tmpY) {
        camera.position.y = tmpY;
        canJump = true;
        yVelocity = 0.0;
      }
    } else {
      canJump = false;
    }

    var moveDistance = 10 * deltaTime;
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
