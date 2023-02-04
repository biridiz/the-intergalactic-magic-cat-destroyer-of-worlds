var scene;
var camera; 
var fieldOfView; 
var aspectRatio;
var nearPlane;
var farPlane;
var gobalLight; 
var shadowLight; 
var backLight;
var renderer;
var container;
var controls;
var bigBall;
var smallBall;
var HEIGHT;
var WIDTH;
var cat;

function initScreen() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  scene = new THREE.Scene();
  aspectRatio = WIDTH / HEIGHT;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  camera.position.x = 0;
  camera.position.z = 300;
  camera.position.y = 250;
  camera.lookAt(scene.position);
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMapEnabled = true;
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);
	controls = new THREE.OrbitControls( camera, renderer.domElement );
}

function createLights() {
  globalLight = new THREE.HemisphereLight(0xffffff, 0xffffff, .5)
  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  shadowLight.position.set(200, 200, 200);
  shadowLight.castShadow = true;
  shadowLight.shadowMapWidth = shadowLight.shadowMapHeight = 2048;
  backLight = new THREE.DirectionalLight(0xffffff, .4);
  backLight.position.set(-100, 100, 100);
  backLight.castShadow = true;
  backLight.shadowMapWidth = shadowLight.shadowMapHeight = 2048;
  scene.add(globalLight);
  scene.add(shadowLight);
  scene.add(backLight);
}

function createFloor(){ 
  floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2500,2500, 100),
    new THREE.MeshBasicMaterial({ color: 'white' })
  );
  floor.rotation.x = -Math.PI/2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  scene.add(floor);
}

function createCat() {
  cat = new Cat();
  scene.add(cat.threeGroup);
}

function createBigBall() {
  var sphereGeom =  new THREE.SphereGeometry( 20, 64, 32 );
	bigBallCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
	scene.add( bigBallCamera );
	var refractMaterial = new THREE.MeshPhongMaterial( { 
		envMap: bigBallCamera.renderTarget, 
		refractionRatio: 0.1, 
		reflectivity: 0.1,
  });		
	bigBall = new THREE.Mesh( sphereGeom, refractMaterial );
	bigBall.position.set(0,130,0);
  bigBall.castShadow = true;
  bigBall.receiveShadow = true;
	bigBallCamera.position = bigBall.position;
	scene.add(bigBall);
}

function createSmallBall() {
  var sphereGeom =  new THREE.SphereGeometry( 10, 64, 32 );
	smallBallCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
	scene.add( smallBallCamera );
	var refractMaterial = new THREE.MeshPhongMaterial( { 
		envMap: smallBallCamera.renderTarget, 
		refractionRatio: 0.1, 
		reflectivity: 0.1,
  });
	smallBall = new THREE.Mesh( sphereGeom, refractMaterial );
	smallBall.position.set(0,130,0);
  smallBall.castShadow = true;
  smallBall.receiveShadow = true;
	smallBallCamera.position = smallBall.position;
	scene.add(smallBall);
}

function smallBallNormalMove(t) {
  smallBall.rotation.y += 0.01;
  smallBall.position.x = 40*Math.cos(t) + 0;
  smallBall.position.y = 10*Math.cos(t) + 130;
  smallBall.position.z = 40*Math.sin(t) + 0;
}

function bigBallNormalMove(t) {
  bigBall.rotation.z += 0.1;
  bigBall.position.x = 5*Math.cos(t) + 0;
  bigBall.position.z = 5*Math.sin(t) + 0;
}

function levitate(t) {
  floor.rotation.z += 0.03;
  floor.position.y = 5*Math.cos(t) + -5;
  floor.position.z = 1*Math.sin(t) + 5;
}

var t=0;
function loop(){
  t+=.05;
  cat.updateTail(t);
  requestAnimationFrame(loop);
	controls.update();
  renderer.render(scene, camera);
  smallBallNormalMove(t);
  bigBallNormalMove(t);
  levitate(t);
}

function init(){
  initScreen();
  createLights();
  createFloor()
  createCat();
  createBigBall();
  createSmallBall();
  loop();
}

window.addEventListener('load', init, false);