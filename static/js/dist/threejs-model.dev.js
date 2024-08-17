"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// 声明全局变量
var model, mixer, head, body, rightArm, leftArm, rightLeg, leftLeg;
var clock = new THREE.Clock();
var mouseX = 0,
    mouseY = 0; // 初始化函数

function init() {
  // 获取容器
  var container = document.getElementById('threejs-container');

  if (!container) {
    console.error("Element with ID 'threejs-container' not found.");
    return;
  } // 设置场景、相机和渲染器


  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 3; // 创建渲染器并启用 alpha 透明度

  var renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0xffffff, 0); // 设置背景为透明

  container.appendChild(renderer.domElement); // 添加环境光

  var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight); // 添加半球光

  var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  hemisphereLight.position.set(0, 1, 0);
  scene.add(hemisphereLight); // 加载模型

  var loader = new THREE.GLTFLoader();
  loader.load('/models/model.gltf', function (gltf) {
    model = gltf.scene;
    model.rotation.y = Math.PI; // 使模型旋转180度，面向相机

    model.position.set(0, -1, 0); // 将模型向下移动1个单位，使头部显示出来

    scene.add(model); // 获取各部位节点

    head = model.getObjectByName('Head');
    body = model.getObjectByName('Body');
    rightArm = model.getObjectByName('RightArm');
    leftArm = model.getObjectByName('LeftArm');
    rightLeg = model.getObjectByName('RightLeg');
    leftLeg = model.getObjectByName('LeftLeg'); // 创建动画混合器

    mixer = new THREE.AnimationMixer(model); // 手臂和腿的摆动动画

    var rightArmRotationKF = new THREE.QuaternionKeyframeTrack('RightArm.quaternion', [0, 0.5, 1], [].concat(_toConsumableArray(new THREE.Quaternion().setFromEuler(new THREE.Euler(0.3, 0, 0)).toArray()), _toConsumableArray(new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.3, 0, 0)).toArray()), _toConsumableArray(new THREE.Quaternion().setFromEuler(new THREE.Euler(0.3, 0, 0)).toArray())));
    var leftArmRotationKF = new THREE.QuaternionKeyframeTrack('LeftArm.quaternion', [0, 0.5, 1], [].concat(_toConsumableArray(new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.3, 0, 0)).toArray()), _toConsumableArray(new THREE.Quaternion().setFromEuler(new THREE.Euler(0.3, 0, 0)).toArray()), _toConsumableArray(new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.3, 0, 0)).toArray())));
    var rightLegRotationKF = new THREE.QuaternionKeyframeTrack('RightLeg.quaternion', [0, 0.5, 1], [].concat(_toConsumableArray(new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.3, 0, 0)).toArray()), _toConsumableArray(new THREE.Quaternion().setFromEuler(new THREE.Euler(0.3, 0, 0)).toArray()), _toConsumableArray(new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.3, 0, 0)).toArray())));
    var leftLegRotationKF = new THREE.QuaternionKeyframeTrack('LeftLeg.quaternion', [0, 0.5, 1], [].concat(_toConsumableArray(new THREE.Quaternion().setFromEuler(new THREE.Euler(0.3, 0, 0)).toArray()), _toConsumableArray(new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.3, 0, 0)).toArray()), _toConsumableArray(new THREE.Quaternion().setFromEuler(new THREE.Euler(0.3, 0, 0)).toArray()))); // 创建动画剪辑

    var clip = new THREE.AnimationClip('walk', 1, [rightArmRotationKF, leftArmRotationKF, rightLegRotationKF, leftLegRotationKF]); // 应用并播放动画

    var action = mixer.clipAction(clip);
    action.setLoop(THREE.LoopRepeat);
    action.play();
  }); // 监听鼠标移动事件

  document.addEventListener('mousemove', onDocumentMouseMove, false); // 动画循环

  function animate() {
    requestAnimationFrame(animate);

    if (mixer) {
      mixer.update(clock.getDelta());
    } // 动态调整头部和身体部分的旋转


    if (head) {
      head.rotation.y = mouseX * Math.PI * 0.3; // 头部更大幅度左右旋转

      head.rotation.x = mouseY * Math.PI * 0.1; // 头部轻微上下旋转
    }

    if (body) {
      body.rotation.y = mouseX * Math.PI * 0.1; // 身体轻微左右旋转
    }

    if (rightArm && leftArm) {
      rightArm.rotation.y = mouseX * Math.PI * 0.05; // 右臂轻微左右旋转

      leftArm.rotation.y = mouseX * Math.PI * 0.05; // 左臂轻微左右旋转
    }

    if (rightLeg && leftLeg) {
      rightLeg.rotation.y = mouseX * Math.PI * 0.05; // 右腿轻微左右旋转

      leftLeg.rotation.y = mouseX * Math.PI * 0.05; // 左腿轻微左右旋转
    }

    renderer.render(scene, camera);
  }

  animate();
} // 鼠标移动事件处理函数


function onDocumentMouseMove(event) {
  mouseX = event.clientX / window.innerWidth * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
} // 等待 DOM 完全加载


document.addEventListener('DOMContentLoaded', function () {
  init();
});