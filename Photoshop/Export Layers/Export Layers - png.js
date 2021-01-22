/*
  EXPORT LAYERS
  By: Saad Azim
  Last Edit: 2021.01.22

  A little script for Photoshop CS6 to export visible layers in a Photoshop file as PNG images.

  Released under GNU GPL 3.0
  ... er ... that's about it.
*/

       //Modify these variables to determine how the layers are exported
var exportFolder='png'
    ,prependFileName=false

    //General PNG options
    ,png8=true //False means the file is exported as PNG-24
    ,pngTransparency=false //Default "true"
    ,pngMatteColorHex='ff0000'

    //PNG-8 options, ignored for PNG-24
    ,pngColors=4 //Number of colors for 8-bit PNG format
    ,pngColorReduction=ColorReductionType.SELECTIVE //ADAPTIVE | BLACKWHITE | CUSTOM | GRAYSCALE | MACINTOSH | PERCEPTUAL | RESTRICTIVE | SELECTIVE | WINDOWS
    ,pngDither=Dither.DIFFUSION //DIFFUSION | NOISE | NONE | PATTERN
    ,pngDitherAmount=100 //0-100, default 100, only valid for Dither.DIFFUSION
    ,pngTransparencyDither=Dither.DIFFUSION //DIFFUSION | NOISE | NONE | PATTERN
    ,pngTransparencyDitherAmount=50 //Transparency dither amount, if applicable
    ,pngWebSnap=0 //The amount to snap to within web-safe colors, default 0

    ,exportLayers
    ;

exportLayers=function(){
  'use strict';
  //Files & folder bits
  var fileNameBase=(prependFileName)?(activeDocument.name+' - '):''
      ,outPath=activeDocument.path+((exportFolder.length)?('/'+exportFolder):'')+'/'
      ,outFolder=new Folder(outPath) //Used to check if the export folder exists

      ,pngOptions=new ExportOptionsSaveForWeb()
      ,pngMatteColor=new RGBColor()

      //Variables used to loop through layers & export to JPEG format
      ,activeLayer
      ,outFile
      ,i=0
      ,totalLayers=activeDocument.layers.length
      ,noLayersVisible=true

      ,layerVisibility=[] //Keep track of which layers are visible

      ;

  pngMatteColor.hexValue=pngMatteColorHex;

  //Configure general export options
  pngOptions.format=SaveDocumentType.PNG;
  pngOptions.transparency=pngTransparency;
  pngOptions.PNG8=png8;
  pngOptions.matteColor=pngMatteColor;

  //Configure PNG-8 specific options
  if(png8){
    pngOptions.colorReduction=pngColorReduction;
    pngOptions.colors=pngColors;
    pngOptions.dither=pngDither;
    pngOptions.ditherAmount=pngDitherAmount;
    pngOptions.transparencyDither=pngTransparencyDither;
    pngOptions.transparencyDitherAmount=pngTransparencyDitherAmount;
    pngOptions.webSnap=pngWebSnap;
  }

  //First pass, make sure at least some layers are visible
  for(i=0;i<totalLayers;i+=1){
    activeLayer=activeDocument.layers[i];
    layerVisibility.push(activeLayer.visible);
    if(activeLayer.visible){
      noLayersVisible=false;
    }
    activeLayer.visible=false;
  }

  //If at least one layer is visible, check to see if the output folder exists
  if(!noLayersVisible){
    if(!outFolder.exists){
      outFolder.create();
    }

    //Export layers as PNG files
    for(i=0;i<totalLayers;i+=1){
      activeLayer=activeDocument.layers[i];
      activeLayer.visible=layerVisibility[i];
      if(activeLayer.visible){
        noLayersVisible=false;
        $.writeln('Exporting '+activeLayer.name+' to '+outPath+fileNameBase+activeLayer.name+'.png');
        outFile=new File(outPath+fileNameBase+activeLayer.name+'.png');
        activeDocument.exportDocument(
          outFile//Export path+file
          ,ExportType.SAVEFORWEB //Export type ILLUSTRATORPATHS | SAVEFORWEB
          ,pngOptions
        );
        outFile=null;
        activeLayer.visible=false;
      }
    }

    //Restore old layer visibility
    for(i=0;i<totalLayers;i+=1){
      activeLayer=activeDocument.layers[i];
      activeLayer.visible=layerVisibility[i];
    }

  }else{
    alert('No layers were visible in this file. Exported 0 files.');
  }

  return 'Done exporting layers :D';
}

try{
  exportLayers();
}catch(errorMessage){
  alert(errorMessage);
}