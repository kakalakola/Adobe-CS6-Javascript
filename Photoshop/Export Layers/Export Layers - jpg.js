/*
  EXPORT LAYERS AS JPG
  By: Saad Azim
  Last Edit: 2021.01.22

  A little script for Photoshop CS6 to export visible layers in a Photoshop file as JPEG images.

  Released under GNU GPL 3.0
  ... er ... that's about it.
*/

    //Modify these variables to determine how the layers are exported
var exportFolder='jpg'
    ,prependFileName=false

    //JPEG Export options
    ,jpgQuality=85
    ,jpgMatteColorHex='ff0000'
    ,jpgBlur=0

    ,jpgIncludeProfile=false
    ,jpgOptimized=true //Default "true" (switches between Progressive and Optimized
    ,jpgFormat=SaveDocumentType.JPEG

    ,exportLayers
    ;

exportLayers=function(){
  'use strict';
  //Files & folder bits
  var fileNameBase=(prependFileName)?(activeDocument.name+' - '):''
      ,outPath=activeDocument.path+((exportFolder.length)?('/'+exportFolder):'')+'/'
      ,outFolder=new Folder(outPath) //Used to check if the export folder exists

      //JPEG export formats
      ,jpgOptions=new ExportOptionsSaveForWeb()
      ,jpgMatteColor=new RGBColor()

      ,bgColorBackup=app.backgroundColor


      //Variables used to loop through layers & export to JPEG format
      ,activeLayer
      ,outFile
      ,i=0
      ,totalLayers=activeDocument.layers.length
      ,noLayersVisible=true

      ,layerVisibility=[] //Keep track of which layers are visible

      ;

  jpgMatteColor.hexValue=jpgMatteColorHex;

  //JPEG Export options
  jpgOptions.blur=jpgBlur;
  jpgOptions.format=jpgFormat;
  jpgOptions.includeProfile=jpgIncludeProfile;
  jpgOptions.matteColor=jpgMatteColor;
  jpgOptions.optimized=jpgOptimized;
  jpgOptions.quality=jpgQuality;

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

    //Export layers as JPEG files
    for(i=0;i<totalLayers;i+=1){
      activeLayer=activeDocument.layers[i];
      activeLayer.visible=layerVisibility[i];
      if(activeLayer.visible){
        noLayersVisible=false;
        $.writeln('Exporting '+activeLayer.name+' to '+outPath+fileNameBase+activeLayer.name+'.jpg');
        outFile=new File(outPath+fileNameBase+activeLayer.name+'.jpg');
        activeDocument.exportDocument(
          outFile//Export path+file
          ,ExportType.SAVEFORWEB //Export type ILLUSTRATORPATHS | SAVEFORWEB
          ,jpgOptions
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