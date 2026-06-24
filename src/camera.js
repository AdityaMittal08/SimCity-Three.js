import * as THREE from 'three'
export function createCamera(gameWindow){
  const DEG2RAD = Math.PI / 180;
  const LEFT_MOUSE_BUTTON = 0;
  const MIDDLE_MOUSE_BUTTON = 1;
  const RIGHT_MOUSE_BUTTON = 2;
  const camera = new THREE.PerspectiveCamera(75, gameWindow.offsetWidth / gameWindow.offsetHeight, 0.1, 1000);

  const MIN_CAMERA_RADIUS = 10;
  const MAX_CAMERA_RADIUS = 12;
  const MIN_CAMERA_ELEVATION = 30;
  const MAX_CAMERA_ELEVATION = 90;

  let cameraRadius = (MIN_CAMERA_RADIUS + MAX_CAMERA_RADIUS)/2
  let cameraAzimuth = 135;
  let cameraElevation = 45;

  const cameraOrigin = new THREE.Vector3();

  const ROTATION_SENSTIVITY = 0.5;
  const ZOOM_SENSTIVITY = 0.02;
  const PANNING_SENSTIVITY = -0.01;

  let isLeftMouseDown = false;
  let isMiddleMouseDown = false;
  let isRightMouseDown = false;
  let prevMouseX = 0;
  let prevMouseY = 0;

  const Y_AXIS = new THREE.Vector3(0, 1, 0)

  updateCameraPosition()

  function onMouseDown(event){
    console.log('Mouse Down')
    if(event.button === LEFT_MOUSE_BUTTON){
      isLeftMouseDown = true;
    }else if(event.button === RIGHT_MOUSE_BUTTON){
      isRightMouseDown = true;
    }else if(event.button === MIDDLE_MOUSE_BUTTON){
      isMiddleMouseDown = true;
    }
  }

  function onMouseUp(event){
    console.log('Mouse Up')
    if(event.button === LEFT_MOUSE_BUTTON){
      isLeftMouseDown = false;
    }else if(event.button === RIGHT_MOUSE_BUTTON){
      isRightMouseDown = false;
    }else if(event.button === MIDDLE_MOUSE_BUTTON){
      isMiddleMouseDown = false;
    }
  }

  function onMouseMove(event){
    console.log('Mouse Move')

    const deltaX = (event.clientX - prevMouseX);
    const deltaY = (event.clientY - prevMouseY);

    //handles the rotation of the camera
    if(isLeftMouseDown){
      cameraAzimuth += -(deltaX * ROTATION_SENSTIVITY);
      cameraElevation += (deltaY * ROTATION_SENSTIVITY);
      cameraElevation = Math.min(MAX_CAMERA_ELEVATION , Math.max(MIN_CAMERA_ELEVATION, cameraElevation));
      updateCameraPosition();
    }

    //handles the zoom of the camera
    if(isRightMouseDown){
      cameraRadius += deltaY * ZOOM_SENSTIVITY;
      cameraRadius = Math.min(MAX_CAMERA_RADIUS, Math.max(MIN_CAMERA_RADIUS, cameraRadius))
      updateCameraPosition();
    }
    
    //handles the panning of the camera
    if(isMiddleMouseDown){
      const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD)
      const left = new THREE.Vector3(1, 0, 0).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD)

      cameraOrigin.add(forward.multiplyScalar(PANNING_SENSTIVITY * deltaY))
      cameraOrigin.add(left.multiplyScalar(PANNING_SENSTIVITY * deltaX))

      updateCameraPosition();
    }

    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
  }

  function updateCameraPosition(){
    camera.position.x = cameraRadius * Math.sin(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD)
    camera.position.y = cameraRadius * Math.sin(cameraElevation * DEG2RAD)
    camera.position.z = cameraRadius * Math.cos(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD)
    camera.position.add(cameraOrigin);
    camera.lookAt(cameraOrigin)
    camera.updateMatrix()
  }

  return {
    camera,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    updateCameraPosition
  }
}