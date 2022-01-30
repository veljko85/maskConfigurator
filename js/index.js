var confCont = document.getElementById("conf-cont");
var confButtons = document.getElementById("confButtons");

// console.log(confButtons.offsetHeight);

// confButtons.style.top =
//   (confCont.offsetHeight - confButtons.offsetHeight / 2) / 2 + "px";

//BABYLON
var canvas = document.getElementById("renderCanvasBox");

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () {
  return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  });
};
//for loading
BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = function () {
  if (document.getElementById("customLoadingScreenDiv")) {
    // Do not add a loading screen if there is already one
    document.getElementById("customLoadingScreenDiv").style.display = "initial";
    return;
  }
  this._loadingDiv = document.createElement("div");
  this._loadingDiv.id = "customLoadingScreenDiv";
  this._loadingDiv.innerHTML = `<div id="lottieWraper" style: width: 200px; height: 200px; background-color: red;></div>`;
  let animItem = bodymovin.loadAnimation({
    wrapper: this._loadingDiv,
    animType: "svg",
    loop: true,
    // rendererSettings: {
    //   progressiveLoad: false,
    //   preserveAspectRatio: "xMidYMid meet",
    //   viewBoxSize: "10 10 10 10",
    // },
    path: "https://raw.githubusercontent.com/thesvbd/Lottie-examples/master/assets/animations/loading.json",
  });
  animItem.resize();
  var customLoadingScreenCss = document.createElement("style");
  customLoadingScreenCss.type = "text/css";
  customLoadingScreenCss.innerHTML = `
                #customLoadingScreenDiv{
                  max-width: 50px;
                max-height: 50px;
                    z-index: 20;
                    position: fixed;
                    margin-left: calc(25% - 25px);
                    margin-top: calc(25% - 25px);
                }
                 `;

  document.getElementsByTagName("head")[0].appendChild(customLoadingScreenCss);
  this._resizeLoadingUI();
  window.addEventListener("resize", this._resizeLoadingUI);
  document.body.appendChild(this._loadingDiv);
};

BABYLON.DefaultLoadingScreen.prototype.hideLoadingUI = function () {
  document.getElementById("customLoadingScreenDiv").style.display = "none";
  // console.log("scene is now loaded");
};
//end of loading
var createScene = function () {
  //loading
  engine.displayLoadingUI();
  var scene = new BABYLON.Scene(engine);

  //scene colors - first color, second transperent
  scene.clearColor = new BABYLON.Color3.FromHexString("#c8c8c8");
  // scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

  var light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 1),
    scene
  );
  light.intensity = 0.8;
  var light2 = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, -1),
    scene
  );
  light2.intensity = 0.7;
  // var light3 = new BABYLON.HemisphericLight(
  //   "light",
  //   new BABYLON.Vector3(0, -1, -1),
  //   scene
  // );
  // light3.intensity = 1;
  // var light4 = new BABYLON.HemisphericLight(
  //   "light",
  //   new BABYLON.Vector3(0, -1, 1),
  //   scene
  // );
  // light4.intensity = 1;

  //camera
  var camera = new BABYLON.ArcRotateCamera(
    "Camera",
    0,
    0,
    0,
    new BABYLON.Vector3(0, 0, 0),
    scene
  );
  camera.attachControl(canvas, false);
  camera.setPosition(new BABYLON.Vector3(0, 0, 25));

  //camera radius
  camera.lowerRadiusLimit = 10;
  camera.upperRadiusLimit = 50;

  //enviormant
  // scene.environmentTexture = new BABYLON.CubeTexture("studio.env", scene);
  // scene.environmentIntensity = 1.5;

  //fabric canvas size
  var textureWidth = confCont.offsetWidth * 0.8;
  var textureHeight = confCont.offsetWidth * 0.4;

  var paintCanvas = document.getElementById("paintCanvas");
  paintCanvas.style.marginTop =
    (confCont.offsetHeight - textureHeight) / 2 + "px";

  paintCanvas.style.marginLeft =
    (confCont.offsetWidth - textureWidth) / 2 + "px";

  // init fabric canvas
  var fabricCanvas = new fabric.Canvas("paintCanvas", {
    width: textureWidth,
    height: textureHeight,
    backgroundColor: "#FFFFFF",
    selectionColor: "transparent",
    selectionLineWidth: 3,
    borderColor: "red",
    cornerColor: "orange",
    cornerSize: 10,
  });

  // document.getElementById("picker").onclick = () => {
  //   console.log(picker.getColor());
  //   fabricCanvas.set({
  //     backgroundColor: picker.getColor(),
  //   });
  //   fabricCanvas.renderAll();
  // };
  function updateColor(value) {
    colorOfBox = value;
    fabricCanvas.set({
      backgroundColor: colorOfBox,
    });
    fabricCanvas.renderAll();
  }
  let colorOfBox = "#ffffff";
  window.picker = new EasyLogicColorPicker({
    color: colorOfBox,
    container: document.getElementById("picker"),
    onChange: function (colorOfBox) {
      updateColor(colorOfBox);
    },
    swatchColors: ["#FF0000", "#FFFF00", "#FFFFFF", "#000000", "#C7C8C4"],
  });
  var pickerOpen = false;
  document.getElementById("pickColor").onclick = () => {
    if (!pickerOpen) {
      document.getElementById("picker").style.display = "block";
      document.getElementById("pickerBackground").style.display = "block";
      pickerOpen = true;
    } else {
      document.getElementById("picker").style.display = "none";
      document.getElementById("pickerBackground").style.display = "none";
      pickerOpen = false;
    }
  };

  // create a rectangle with angle=45
  function addRect() {
    var rect = new fabric.Rect({
      left: textureWidth * 0.25,
      top: textureHeight * 0.2,
      fill: "red",
      angle: 25,
      width: textureWidth * 0.2,
      height: textureWidth * 0.2,
      // angle: 45,
      cornerSize: 10,
      strokeWidth: 3,
      // selectable: false,
      // evented: false,
    });
    fabricCanvas.add(rect);
  }

  function addCircle() {
    var circle = new fabric.Circle({
      // fill: "red",
      // width: textureWidth * 0.2,
      // height: textureWidth * 0.2,
      angle: 25,
      // cornerSize: 10,
      // strokeWidth: 3,

      left: textureWidth * 0.25,
      top: textureHeight * 0.2,
      radius: textureWidth * 0.1,
      // stroke: "red",
      strokeWidth: 3,
      fill: "red",
    });
    fabricCanvas.add(circle);
  }

  document.getElementById("addShape").onclick = () => {
    document.getElementById("chooseShape").style.display = "block";
    document.getElementById("pickerBackground").style.display = "block";
  };

  document.getElementById("addRect").onclick = () => {
    addRect();
    document.getElementById("chooseShape").style.display = "none";
    document.getElementById("pickerBackground").style.display = "none";
  };

  document.getElementById("addCircle").onclick = () => {
    addCircle();
    document.getElementById("chooseShape").style.display = "none";
    document.getElementById("pickerBackground").style.display = "none";
  };

  function updateColorOfShape(value) {
    colorOfShape = value;
    document.getElementById("colorOfShape").style.backgroundColor =
      colorOfShape;
    fabricCanvas.getActiveObject().set({
      fill: colorOfShape,
    });
    fabricCanvas.renderAll();
  }

  let colorOfShape = "#ff0000";

  window.pickerForShape = new EasyLogicColorPicker({
    color: colorOfShape,
    container: document.getElementById("pickerForShape"),
    onChange: function (colorOfShape) {
      updateColorOfShape(colorOfShape);
    },
    swatchColors: ["#FF0000", "#FFFF00", "#FFFFFF", "#000000", "#C7C8C4"],
  });
  var pickerForShapeOpen = false;
  document.getElementById("colorOfShape").onclick = () => {
    if (!pickerForShapeOpen) {
      document.getElementById("pickerForShape").style.display = "block";
      document.getElementById("pickerBackground").style.display = "block";
      pickerForShapeOpen = true;
    } else {
      document.getElementById("pickerForShape").style.display = "none";
      document.getElementById("pickerBackground").style.display = "none";
      pickerForShapeOpen = false;
    }
  };

  document.onclick = () => {
    if (
      fabricCanvas.getActiveObject() != undefined ||
      fabricCanvas.getActiveObject() != null
    ) {
      document.getElementById("bringForward").style.visibility = "visible";
      document.getElementById("sendBackwards").style.visibility = "visible";
      if (
        fabricCanvas.getActiveObject().type === "rect" ||
        fabricCanvas.getActiveObject().type === "circle" ||
        fabricCanvas.getActiveObject().type === "i-text"
      ) {
        document.getElementById("shapeColor").style.display = "block";
        document.getElementById("colorOfShape").style.backgroundColor =
          fabricCanvas.getActiveObject().fill;
      }
    } else {
      document.getElementById("shapeColor").style.display = "none";
      document.getElementById("pickerForShape").style.display = "none";
      document.getElementById("bringForward").style.visibility = "hidden";
      document.getElementById("sendBackwards").style.visibility = "hidden";
      pickerForShapeOpen = false;
    }
  };

  document.getElementById("pickerBackground").onclick = () => {
    document.getElementById("picker").style.display = "none";
    document.getElementById("pickerForShape").style.display = "none";
    document.getElementById("pickerBackground").style.display = "none";
    document.getElementById("chooseShape").style.display = "none";
    pickerOpen = false;
    pickerForShapeOpen = false;
  };

  // document.getElementById("pickerForShape").onclick = () => {
  //   console.log(pickerForShape.getColor());
  //   document.getElementById("colorOfShape").style.backgroundColor =
  //     pickerForShape.getColor();
  //   fabricCanvas.getActiveObject().set({
  //     fill: pickerForShape.getColor(),
  //   });
  //   fabricCanvas.renderAll();
  // };
  // console.log(fabricCanvas.getObjects()[0].type);
  // setInterval(function () {
  //   console.log(fabricCanvas.getActiveObject().type);
  //   // if (fabricCanvas.getActiveObject().type === "rect") {
  //   //   console.log("aaaa");
  //   // }
  // }, 1000);
  // fabricCanvas.getActiveObject().set({
  //   fill: "blue",
  // });
  // fabricCanvas.renderAll();
  // fabricCanvas.moveTo(fabricCanvas.getObjects()[0], 10);

  function addText() {
    text = new fabric.IText("Click to edit text", {
      fontSize: 25,
      fontWeight: "bold",
      fontFamily: "Barlow",
      // stroke: "#FF0000",
      angle: 25,
      fill: "#000000",
      strokeWidth: 0,
      top: textureHeight * 0.38,
      left: textureWidth * 0.2,
      lockScalingX: false,
      lockScalingY: false,
      uniScaleTransform: true,
      lockUniScaling: true,
    });
    fabricCanvas.add(text);
  }

  document.getElementById("addText").onclick = () => {
    document.getElementById("picker").style.display = "none";
    pickerOpen = false;
    addText();
  };
  // text.set({
  //   borderColor: "red",
  //   cornerColor: "orange",
  //   cornerSize: 10,
  // });

  document.getElementById("upload").onchange = function handleImage(e) {
    var reader = new FileReader();
    reader.onload = function (event) {
      var imgObj = new Image();
      imgObj.src = event.target.result;
      imgObj.onload = function () {
        var image = new fabric.Image(imgObj);
        image.set({
          angle: 25,
          padding: 0,
          cornersize: 10,
          left: textureWidth * 0.25,
          top: textureHeight * 0.25,
          // height: 128,
          // width: 128,
        });
        image.scaleToHeight(textureWidth * 0.2);
        image.scaleToWidth(textureWidth * 0.2);
        // fabricCanvas.centerObject(image);
        fabricCanvas.add(image);
        fabricCanvas.renderAll();
      };
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  //bring to front or back
  // fabricCanvas.sendToBack(myObject)
  // fabricCanvas.bringToFront(myObject)
  document.getElementById("bringForward").onclick = () => {
    fabricCanvas.bringForward(fabricCanvas.getActiveObject());
  };
  document.getElementById("sendBackwards").onclick = () => {
    fabricCanvas.sendBackwards(fabricCanvas.getActiveObject());
  };

  //delete import shape img text
  function lintenKeysEvents() {
    document.onkeydown = checkKey;
    function checkKey(event) {
      if (event.keyCode == 46) {
        fabricCanvas.remove(fabricCanvas.getActiveObject());
        document.getElementById("shapeColor").style.display = "none";
        document.getElementById("pickerForShape").style.display = "none";
        document.getElementById("bringForward").style.visibility = "hidden";
        document.getElementById("sendBackwards").style.visibility = "hidden";
        pickerForShapeOpen = false;
      }
    }
  }
  lintenKeysEvents();

  //function to discard active objects
  function discardActvObj() {
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();
  }

  canvas.onclick = () => {
    discardActvObj();
  };

  //CREATE DYNAMIC MATERIAL

  var groundTexture = new BABYLON.DynamicTexture(
    "dyntex",
    paintCanvas,
    scene,
    true
  );

  var dynamicMaterial = new BABYLON.StandardMaterial("mat", scene);
  dynamicMaterial.diffuseTexture = groundTexture;
  dynamicMaterial.bumpTexture = new BABYLON.Texture(
    "textures/MaskNormalMap_1.png",
    scene
  );
  dynamicMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
  dynamicMaterial.bumpTexture.uScale = 1; //and/or the following for vScale:
  dynamicMaterial.bumpTexture.vScale = -1; //(-1.0 or some other value)
  dynamicMaterial.backFaceCulling = false;

  //MASK MESH
  BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "https://raw.githubusercontent.com/veljko85/glbModels/gh-pages/faceMask/",
    "maska.glb"
  ).then((result) => {
    var mask = result.meshes[0];
    // mask.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);
    // mask.rotationQuaternion = null;
    mask.position.y = -1;
    mask.position.z = 5;
    scene.getMeshByName("Mask Front.001").material = dynamicMaterial;
    scene.getMaterialByID("Back").bumpTexture = new BABYLON.Texture(
      "textures/normalBack.png",
      scene
    );
    scene.getMaterialByID("Nose").bumpTexture = new BABYLON.Texture(
      "textures/normalBack.png",
      scene
    );
    scene.getMeshByName("StrapsShort.001").isVisible = false;

    //FACE MESH
    BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "https://raw.githubusercontent.com/veljko85/glbModels/gh-pages/face/",
      "Glava.glb"
    ).then((resultFace) => {
      var face = resultFace.meshes[0];
      // face.scaling = new BABYLON.Vector3(6.9, 6.9, 6.9);
      // face.rotationQuaternion = null;
      face.position.y = -1;
      face.position.z = 5;
      for (let i = 0; i < resultFace.meshes.length; i++) {
        resultFace.meshes[i].isVisible = false;
      }

      //head-face toggle
      var faceOn = false;
      document.getElementById("addFaceBut").onclick = () => {
        if (!faceOn) {
          document.getElementById("addFaceButTitle").innerHTML = "Remove Face";
          scene.getMeshByName("StrapsShort.001").isVisible = true;
          scene.getMeshByName("StrapsShort.002").isVisible = false;
          camera.upperBetaLimit = 1.6;
          camera.lowerRadiusLimit = 20;
          faceOn = true;
          for (let i = 0; i < resultFace.meshes.length; i++) {
            resultFace.meshes[i].isVisible = true;
          }
        } else {
          document.getElementById("addFaceButTitle").innerHTML = "Add Face";
          scene.getMeshByName("StrapsShort.001").isVisible = false;
          scene.getMeshByName("StrapsShort.002").isVisible = true;
          camera.upperBetaLimit = 3.14;
          camera.lowerRadiusLimit = 10;
          faceOn = false;
          for (let i = 0; i < resultFace.meshes.length; i++) {
            resultFace.meshes[i].isVisible = false;
          }
        }
      };
    });

    //for loading
    engine.hideLoadingUI();
  });

  //screenshot of product

  document.getElementById("screenshotBut").onclick = () => {
    discardActvObj();
    setTimeout(function () {
      BABYLON.Tools.CreateScreenshot(engine, camera, 2048);
    }, 1000);
  };

  fabricCanvas.renderAll();
  groundTexture.update(false);

  // Update Texture when fabricjs canvas changed
  fabricCanvas.on("after:render", function () {
    groundTexture.update(false);
  });

  var onPointer = function (event) {
    event.stopPropagation();
    var e = getEvent(event.type.replace("pointer", "mouse"), event);
    //console.log(e);
    if (e != null) {
      if (e != null) {
        fabricCanvas.upperCanvasEl.dispatchEvent(e);
      }
    }

    // Set current cursor used by fabricjs
    canvas.style.cursor = fabricCanvas.upperCanvasEl.style.cursor;
    // Important for Internet Explorer!
    return false;
  };

  // Get Converted Event by name
  var getEvent = function (name, event) {
    var pickResult = scene.pick(scene.pointerX, scene.pointerY);
    var texcoords = pickResult.getTextureCoordinates();

    if (texcoords) {
      var clicked_x = texcoords.x;
      var clicked_y = texcoords.y;

      var posX = (clicked_x * textureWidth) | 0;
      var posY = (textureWidth - clicked_y * textureHeight) | 0;

      var rect1 = fabricCanvas.upperCanvasEl.getBoundingClientRect();

      var clientX = (posX + rect1.left) | 0;
      var clientY = (posY + rect1.top) | 0;

      // Doesn't matter
      var screenX = 0; //clientX;// - $(window).scrollLeft();
      var screenY = 0; //clientY;// - $(window).scrollTop();

      var evt = document.createEvent("MouseEvents");
      evt.initMouseEvent(
        name,
        true,
        true,
        window,
        1,
        screenX,
        screenY,
        clientX,
        clientY,
        event.ctrlKey,
        event.altKey,
        event.shiftKey,
        event.metaKey,
        event.button,
        canvas.upperCanvasEl
      );

      return evt;
    } else {
    }
    return null;
  };

  canvas.addEventListener("pointerdown", onPointer, false);
  canvas.addEventListener("pointerup", onPointer, false);
  canvas.addEventListener("pointermove", onPointer, false);

  scene.onDispose = function () {
    canvas.removeEventListener("pointerdown", onPointer);
    canvas.removeEventListener("pointerup", onPointer);
    canvas.removeEventListener("pointermove", onPointer);
  };

  //download pdf
  var download = document.getElementById("download");

  var formats = {
    a4: [300, 150],
    a3: [400, 200],
  };

  download.onclick = () => {
    discardActvObj();

    setTimeout(function () {
      html2canvas(document.getElementById("paintCanvas"), {
        onrendered: function (fabricCanvas) {
          var img = fabricCanvas.toDataURL("image/jpeg,1.0");
          // pdf.output("datauri");
          var imgData = new Image();
          imgData.src = "./img/Maska_linije.png";
          var pdf = new jsPDF("l", "mm", formats.a4);
          pdf.addImage(img, "PNG", 0, 0, 300, 150);
          pdf.addImage(imgData, "PNG", 0, 0, 300, 150);
          pdf.save("Mask Configurator.pdf");
        },
      });
    }, 1000);
  };

  //download 3d model
  document.getElementById("downLoadModel").onclick = () => {
    let options = {
      shouldExportNode: function (node) {
        return node.isVisible == true;
      },
    };

    BABYLON.GLTF2Export.GLBAsync(scene, "Mask Model", options).then((glb) => {
      glb.downloadFiles();
    });
  };

  //END OF SCENE
  return scene;
};

window.initFunction = async function () {
  var asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log(
        "the available createEngine function failed. Creating the default engine instead"
      );
      return createDefaultEngine();
    }
  };

  window.engine = await asyncEngineCreation();
  if (!engine) throw "engine should not be null.";
  window.scene = createScene();
};
initFunction().then(() => {
  sceneToRender = scene;
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
});

// Resize
window.addEventListener("resize", function () {
  engine.resize();
});
