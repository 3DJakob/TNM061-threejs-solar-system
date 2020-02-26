// Lots of global variables. (This is JavaScript. No use complaining.)
const container = document.getElementById('container')
let camera, scene, renderer

// Time stamp for animation timing
let previousTime

// Group nodes and Mesh nodes
const sceneRoot = new THREE.Group()
const sunOrbitSpin = new THREE.Group()
const sunSpin = new THREE.Group()
const earthTranslation = new THREE.Group()
const earthSpin = new THREE.Group()
const earthOrbitSpin = new THREE.Group()
const moonTranslation = new THREE.Group()
const moonSpin = new THREE.Group()
let sunMesh, earthMesh, moonMesh

// Some things need to change when the window is resized
function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function init () {
  scene = new THREE.Scene()

  // Set up the camera
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.x = 0
  camera.position.y = 0
  camera.position.z = 10
  camera.lookAt(scene.position) // Deafult scene position is (0,0,0)

  // Set up lights
  const color = 0xFFFFFF
  const intensity = 1
  const light = new THREE.PointLight(color, intensity)
  light.position.set(0, 0, 0)
  scene.add(light)

  // Mesh
  const geometrySun = new THREE.SphereGeometry(2, 32, 32)
  const geometryEarth = new THREE.SphereGeometry(1, 20, 20)
  const geometryMoon = new THREE.SphereGeometry(0.5, 20, 20)

  // Material
  const materialEarth = new THREE.MeshPhongMaterial()
  const loaderEarth = new THREE.TextureLoader()
  loaderEarth.load('earth.png', function (texture) {
    materialEarth.map = texture
    materialEarth.needsUpdate = true
    materialEarth.overdraw = 0.5
  })

  const materialSun = new THREE.MeshBasicMaterial()
  const loaderSun = new THREE.TextureLoader()
  loaderSun.load('sun.png', function (texture) {
    materialSun.map = texture
    materialSun.needsUpdate = true
    materialSun.overdraw = 0.5
  })

  const materialMoon = new THREE.MeshPhongMaterial()
  const loaderMoon = new THREE.TextureLoader()
  loaderMoon.load('moon.png', function (texture) {
    materialMoon.map = texture
    materialMoon.needsUpdate = true
    materialMoon.overdraw = 0.5
  })

  // Texture
  const materialBox = new THREE.MeshPhongMaterial({ color: 0xffffff })

  sunMesh = new THREE.Mesh(geometrySun, materialSun)
  earthMesh = new THREE.Mesh(geometryEarth, materialEarth)
  moonMesh = new THREE.Mesh(geometryMoon, materialMoon)

  // Top-level node
  scene.add(sceneRoot)

  // Sun branch
  sceneRoot.add(sunOrbitSpin)
  sunOrbitSpin.add(sunMesh)

  // Sun spin
  sceneRoot.add(sunSpin)
  sunSpin.add(sunMesh)

  // Earth translation branch
  sunOrbitSpin.add(earthTranslation)
  earthTranslation.add(earthMesh)

  // Earth spin
  earthTranslation.add(earthSpin)
  earthSpin.add(earthMesh)
  earthTranslation.add(earthOrbitSpin)

  // Moon translation branch
  earthOrbitSpin.add(moonTranslation)
  moonTranslation.add(moonMesh)
  moonTranslation.add(moonSpin)
  moonSpin.add(moonMesh)

  renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(0x000000)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(renderer.domElement)

  window.addEventListener('resize', onWindowResize, false)

  // Time stamp for animation timing, done properly
  previousTime = Date.now()
}

// Calculate time in seconds for one revolution
function revolutionTime (revolutions, deltaTime) {
  return 2 * Math.PI / revolutions * deltaTime
}

earthSpin.rotation.x = 0.4

function render () {
  // Perform animations with absolute speed (elapsed time, not frame numbers)
  const currentTime = Date.now()
  let deltaTime = (currentTime - previousTime) * 0.001 // getTime() returns milliseconds
  deltaTime = deltaTime * Number(document.querySelector('input').value)
  previousTime = currentTime

  sunOrbitSpin.rotation.y += revolutionTime(365, deltaTime) // Rotate 0.8 radians per second
  sunSpin.rotation.y += revolutionTime(25, deltaTime)
  earthTranslation.position.x = 7
  earthSpin.rotation.y += revolutionTime(1, deltaTime)
  earthOrbitSpin.rotation.y += revolutionTime(27.3, deltaTime)
  moonSpin.rotation.y += revolutionTime(27.3, deltaTime)

  moonTranslation.position.x = 3

  // Render the scene
  renderer.render(scene, camera)
}

function animate () {
  window.requestAnimationFrame(animate) // Request to be called again for next frame
  render()
}

init() // Set up the scene
animate() // Start an infinite animation loop
