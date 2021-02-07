import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/GLTFLoader.js';


function main() {
  const canvas = document.querySelector('#d');
  const renderer = new THREE.WebGLRenderer({canvas, logarithmicDepthBuffer: true});
  renderer.setSize( window.innerWidth * 5/6, window.innerHeight * 5/6 );
  const fov = 70;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = -3;
  camera.position.x = -5;
  camera.position.y = 10;

  const controls = new OrbitControls(camera, canvas);
  controls.enableZoom = true;
  controls.target.set(0, 3, 0);
  controls.update();

  // const controls = new TrackballControls(camera, canvas);
  // controls.target.set(0, 90, 0);
  // controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffffff );


  // Lights
  const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
  hemiLight.position.set( 0, 20, 0 );
  scene.add( hemiLight );

  const dirLight = new THREE.DirectionalLight( 0xffffff );
  dirLight.position.set( - 3, 10, - 10 );
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 2;
  dirLight.shadow.camera.bottom = - 2;
  dirLight.shadow.camera.left = - 2;
  dirLight.shadow.camera.right = 2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 40;
  scene.add( dirLight );


  if (window.location.href.includes('model=')) {
    var model = decodeURI(window.location.href.split('model=')[1].split('?')[0]);
  }
  else
  {
    var model = '0_Minotaur.glb';
  }

  const loader = new GLTFLoader();

  loader.load( 'models_glb/' + model, function ( gltf ) {

      scene.add( gltf.scene );

  }, undefined, function ( error ) {

      console.error( error );

  } );


  // Read model list
  function getList() {
    var request = new XMLHttpRequest();
    // console.log('cubemap_list_' + ver + '.txt')
    request.open('GET', 'models_glb/data.txt', true);
    request.send(null);
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        var type = request.getResponseHeader('Content-Type');
        if (type.indexOf("text") !== 1) {
          var model_array = request.responseText.split('\n');
          // Adding buttons
          for (let m of model_array) {
            let btn = document.createElement('button');
            btn.classList.add('btn');
            btn.classList.add('modelb');
            btn.classList.add('btn-outline-dark')
            btn.setAttribute('data-key', m);
            console.log(m);
            if (m === undefined || m === '') {
              continue;
            }
            let split = m.split('_')[1].split('.')[0]
            btn.textContent = split;
            document.getElementById('buttons').append(btn);
          }

          // Adding button fn
          const buttons = document.querySelectorAll(".modelb");

          for (const btn of buttons) {
            btn.addEventListener('click', changeModel);
          }


          function changeModel(e) {
            var model = e.target.dataset.key;
            loader.load('models_glb/' + model, function (gltf) {
              for (let i = scene.children.length - 1; i >= 0; i--) {
                if (scene.children[i].type === 'Group')
                  scene.remove(scene.children[i]);
              }
              scene.add(gltf.scene);

            }, undefined, function (error) {

              console.error(error);

            });

            var refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + '?model=' + model;
            window.history.pushState({path: refresh}, '', refresh);
          }
        }
      }
    }
  }
  getList();

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }


    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }



  requestAnimationFrame(render);
}
main();
