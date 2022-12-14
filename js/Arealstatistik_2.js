
////////////////////////////////////
//Drop Down Menu to chose a canton//
////////////////////////////////////

// List all Cantons for the drop-down menu
var allCantons = [{
    label: "Aargau",
    value: 1
},
{
    label: "Appenzell Inerrhoden",
    value: 2
}, 
{
    label: "Appenzell Ausserrhoden",
    value: 3
}, 
{
    label: "Bern",
    value: 4
}, 
{
    label: "Basel-Landschaft",
    value: 5
}, 
{
    label: "Basel-Stadt",
    value: 6
}, 
{
    label: "Freiburg",
    value: 7
}, 
{
    label: "Genf",
    value: 8
}, 
{
    label: "Glarus",
    value: 9
}, 
{
    label: "Graubünden",
    value: 10
}, 
{
    label: "Jura",
    value: 11
}, 
{
    label: "Luzern",
    value: 12
}, 
{
    label: "Neuenburg",
    value: 13
}, 
{
    label: "Niedwalden",
    value: 14
}, 
{
    label: "Obwalden",
    value: 15
}, 
{
    label: "St. Gallen",
    value: 16
}, 
{
    label: "Schaffhausen",
    value: 17
}, 
{
    label: "Solothurn",
    value: 18
}, 
{
    label: "Schwyz",
    value: 19
}, 
{
    label: "Thurgau",
    value: 20
}, 
{
    label: "Tessin",
    value: 21
}, 
{
    label: "Uri",
    value: 22
}, 
{
    label: "Waadt",
    value: 23
}, 
{
    label: "Wallis",
    value: 24
}, 
{
    label: "Zug",
    value: 25
}, 
{
    label: "Zürich",
    value: 26
}, 
];

// Add the Cantons to the button
d3.select("#selectCanton")
    .selectAll("myOptions")
        .data(allCantons)
    .enter()
        .append("option")
    .text(function(d){ return d.label;}) // text shown in the menu
    .attr("value", function (d){return d.value;}) //corresponding value returned


///////////////////////////////////
// Set the scene (is not updated)//
///////////////////////////////////

/// Scene: Set the scene incl. background
var scene = new THREE.Scene();
scene.background = new THREE.Color("white");
/// Camera: Set the Camera
/// Different camera types --> Here "PerspectiveCamera"
/// First Number: "Field of View" --> Defines in degrees the extent of the scene that is seen on the display
/// Second Number: Aspect Ratio, normally width/height
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight);
/// Because coordinates are at (0,0,0) either move camera out or cube in --> here cube in.
camera.position.z = 6;
/// Renderer: Where the magic happens --> WebGLRenderer is standard, other types rather for older browsers
var renderer = new THREE.WebGLRenderer({antialias: true});

/// Defines the size at which the figure is rendered
renderer.setSize(window.innerWidth,window.innerHeight);
/// This defines the canvas element (in the HTML) the rendere uses to display the scene --> other than body?
document.body.appendChild(renderer.domElement);

var controls = new THREE.TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 5.0;
controls.zoomSpeed = 5;
controls.panSpeed = 2;

controls.dynamicDampingFactor = 0.3;


///////////////////
//Update Function//
///////////////////

// Get the selected canton
function updateValue() {

scene.clear()

/// Turn on shadows in the renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
/// Create a Spotlight and turn on shadows for the light
var color = 0xffffff;
var intensity = 1.4;
var light = new THREE.SpotLight(color, intensity);
light.position.set(7, -3, 7);
light.castShadow = true;
light.shadow.mapSize.width = 512;
light.shadow.mapSize.height = 512;
scene.add(light);

var selectedCanton = d3.select("#selectCanton option:checked").node().value

d3.csv("https://raw.githubusercontent.com/schlegeltobias/avs/main/Arealstatistik_01lur.csv").then(function(data) {
    data.forEach(function(d){
        d.kntNr = +d.kntNr;
        d.typ =+d.typ;
        d.l2004 =+ d.l2004;
        d.h2004 =+ d.h2004;
        d.lwachstum =+ d.lwachstum;
        d.hwachstum =+ d.hwachstum;
        d.flaeche2004 =+ d.flaeche2004;
        d.dichte2004 =+ d.dichte2004;
        d.flaechewachstum =+ d.flaechewachstum;
        d.dichtehypo =+ d.dichtehypo;
});

var dataCanton = data.filter(function(d){return d.kntNr == selectedCanton})

/////////////////////////////////////
// Save measures for chosen canton //
/////////////////////////////////////

var dataCantonX = dataCanton.map(function(d) {return d.l2004/10})
var dataCantonY = dataCanton.map(function(d) {return d.l2004/10})
var dataCantonZ = dataCanton.map(function(d) {return d.h2004/10})

var dataGrowthX = dataCanton.map(function(d) {return d.lwachstum/10})
var dataGrowthY = dataCanton.map(function(d) {return d.lwachstum/10})
var dataGrowthZ = dataCanton.map(function(d) {return d.hwachstum/10})

////////////
//Big Cube//
////////////
/// Add the cube using BoxGeometry. This is an object that contains all the points and fill (faces) of the cube
var cube_status_quo = new THREE.BoxGeometry(1,1,1,)

/// Material is used to color the cube. There are other materials than "MeshPhongMaterial" --> here used to show shadows
var material = new THREE.MeshPhongMaterial({color: "#e2201a"})
material.shininess = 50;
/// Mesh: A mesh is an object that takes a geometry, and applies a material to it, which we then can insert to our scene and move freely around
var cube_sq = new THREE.Mesh(cube_status_quo,material);

cube_sq.scale.x = dataCantonX;
cube_sq.scale.y = dataCantonY;
cube_sq.scale.z = dataCantonZ;

// cube.receiveShadow = true;
cube_sq.castShadow = true;

/// Things we want to add are added to the scene to the coordinates (0,0,0)
scene.add(cube_sq);

/// Reposition cube
cube_sq.translateX(dataCantonX/2);
cube_sq.translateY(-dataCantonY/2);
cube_sq.translateZ(dataCantonZ/2);

///////////////////////////
// Smaller Cube (Growth) //
///////////////////////////
/// Add the cube using BoxGeometry. This is an object that contains all the points and fill (faces) of the cube
var cube_growth = new THREE.BoxGeometry(1,1,1,)

/// Material is used to color the cube. There are other materials than "MeshPhongMaterial" --> here used to show shadows
var material = new THREE.MeshPhongMaterial({color: "#808080"})
material.shininess = 50;
/// Mesh: A mesh is an object that takes a geometry, and applies a material to it, which we then can insert to our scene and move freely around
var cube_growth = new THREE.Mesh(cube_growth,material);

cube_growth.scale.x = dataGrowthX;
cube_growth.scale.y = dataGrowthY;
cube_growth.scale.z = dataGrowthZ;

// cube.receiveShadow = true;
cube_growth.castShadow = true;

/// Things we want to add are added to the scene to the coordinates (0,0,0)
scene.add(cube_growth);

/// Reposition cube

shift = dataCantonX*1.5  

cube_growth.translateX(shift);
cube_growth.translateY(-dataGrowthY/2);
cube_growth.translateZ(dataGrowthZ/2);

//////////////
// Add grid //
//////////////

var d = 10

var grid = new THREE.GridHelper(d,d*5);
// Rotate grid by 90 Degree 
grid.rotation.x = Math.PI*0.5;
grid.translateX(d/2)
grid.translateZ(d/2)
// Lower grid by half the size of the cube
scene.add(grid);

var grid = new THREE.GridHelper(d,d*5);
grid.rotation.x = 0
grid.translateX(d/2)
grid.translateZ(d/2)
scene.add(grid);


var grid = new THREE.GridHelper(d,d*5);
grid.rotation.z = Math.PI*0.5;
grid.translateX(-d/2)
grid.translateZ(d/2)
scene.add(grid);

/////////////////////////
// Rotate Entire Scene //
/////////////////////////

scene.rotation.x = -1.2;
scene.rotation.y = 0;
scene.rotation.z =-0.6;

/////////////////////////////////////////////////////////////////
// Helper for camera and light (can be disabled when finished) //
/////////////////////////////////////////////////////////////////
/*
const helper = new THREE.CameraHelper( light.shadow.camera );
scene.add( helper );
var worldAxis = new THREE.AxesHelper(20);
scene.add(worldAxis);
*/
/// Renderer or animate loop: creates a loop that causes the renderer to draw the scene every time the screen is refreshed
renderer.render(scene,camera);

/*
var animate = function(){
    scene.rotation.x += 0.01;
    scene.rotation.y += 0.01;
    renderer.render(scene,camera);
    requestAnimationFrame(animate);
    }
    
    animate();
*/

})
}

updateValue()