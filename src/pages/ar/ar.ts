import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-ar',
  templateUrl: 'ar.html'
})
export class arPage {

  constructor(public navCtrl: NavController) {

  }

  var  stats, clock, controls;
	var camera, scene, renderer, mixer;
	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );


	init();
	animate();


	//////////////////////////////////////////////////////////////////////////////////
	//		Init
	//////////////////////////////////////////////////////////////////////////////////


	function init() {

		// Renderer
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );
				

		// array of functions for the rendering loop
		var onRenderFcts= [];

		// init scene and camera
		scene	= new THREE.Scene();

		// add light
		var ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
		scene.add( ambientLight );
		var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
		directionalLight.position.set( 1, 1, - 1 );
		scene.add( directionalLight );
		
		//////////////////////////////////////////////////////////////////////////////////
		//		Initialize a basic camera
		//////////////////////////////////////////////////////////////////////////////////

		// Create a camera
		camera = new THREE.Camera();
		camera.position.x = 0;
		camera.position.y = 0;
		camera.position.z = 100;
		scene.add(camera);

		// Add clock
		clock = new THREE.Clock();

		controls = new THREE.TrackballControls( camera, renderer.domElement );
		controls.rotateSpeed = 1.0;
				controls.zoomSpeed = 3;
				controls.noZoom = false;
				controls.noPan = false;
				controls.noRotate = true;
				controls.staticMoving = true;
				controls.dynamicDampingFactor = 0.3;
				controls.keys = [ 65, 83, 68 ];
				controls.addEventListener( 'change', render );
		////////////////////////////////////////////////////////////////////////////////
		//          handle arToolkitSource
		////////////////////////////////////////////////////////////////////////////////

		var arToolkitSource = new THREEx.ArToolkitSource({
			// to read from the webcam 
			sourceType : 'webcam',

			// to read from an image
			// sourceType : 'image',
			// sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',		

			// to read from a video
			// sourceType : 'video',
			// sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',		
		})

		arToolkitSource.init(function onReady(){
			onResize()
		})
		
		// handle resize
		window.addEventListener('resize', function(){
			onResize()
		})
		function onResize(){
			arToolkitSource.onResizeElement()	
			arToolkitSource.copyElementSizeTo(renderer.domElement)	
			if( arToolkitContext.arController !== null ){
				arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)	
			}	
		}
		////////////////////////////////////////////////////////////////////////////////
		//          initialize arToolkitContext
		////////////////////////////////////////////////////////////////////////////////
		
		 stats = new Stats();

		// create atToolkitContext
		var arToolkitContext = new THREEx.ArToolkitContext({
			cameraParametersUrl: THREEx.ArToolkitContext.baseURL + 'camera_para.dat',
			detectionMode: 'mono',
			maxDetectionRate: 30,
			canvasWidth: 80*3,
			canvasHeight: 60*3,
		})
		// initialize it
		arToolkitContext.init(function onCompleted(){
			// copy projection matrix to camera
			camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
		})

		// update artoolkit on every frame
		onRenderFcts.push(function(){
			if( arToolkitSource.ready === false )	return

			arToolkitContext.update( arToolkitSource.domElement )
		})
		
		
		////////////////////////////////////////////////////////////////////////////////
		//          Create a ArMarkerControls
		////////////////////////////////////////////////////////////////////////////////
		
		var markerRoot = new THREE.Group
		scene.add(markerRoot)
		new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
			type : 'pattern',
			patternUrl : THREEx.ArToolkitContext.baseURL + 'patt.hiro'
			// patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji'
		})

		// build a smoothedControls
		var smoothedRoot = new THREE.Group()
		scene.add(smoothedRoot)
		var smoothedControls = new THREEx.ArSmoothedControls(smoothedRoot, {
			lerpPosition: 0.4,
			lerpQuaternion: 0.3,
			lerpScale: 1,
		})
		onRenderFcts.push(function(delta){
			smoothedControls.update(markerRoot)
		})
		//////////////////////////////////////////////////////////////////////////////////
		//		add an object in the scene
		//////////////////////////////////////////////////////////////////////////////////

		var arWorldRoot = smoothedRoot

		var loader = new THREE.ColladaLoader();
					loader.load( 'castellana.dae', function ( collada ) {
						var avatar = collada.scene;
						avatar.scale.set(10, 12, 10);
						arWorldRoot.add( avatar );
					} );


		//////////////////////////////////////////////////////////////////////////////////
		//		render the whole thing on the page
		//////////////////////////////////////////////////////////////////////////////////

		// run the rendering loop
		var lastTimeMsec= null
		requestAnimationFrame(function animate(nowMsec){
			// keep looping
			requestAnimationFrame( animate );
			// measure time
			lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
			var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
			lastTimeMsec	= nowMsec
			// call each update function
			onRenderFcts.forEach(function(onRenderFct){
				onRenderFct(deltaMsec/1000, nowMsec/1000)
			})
		})
	}


	function animate() {
				requestAnimationFrame( animate );
				render();
				controls.update();
			}
	function render() {
		var delta = clock.getDelta();
		if ( mixer !== undefined ) {
			mixer.update( delta );
		}
		renderer.render( scene, camera );
	}

}
