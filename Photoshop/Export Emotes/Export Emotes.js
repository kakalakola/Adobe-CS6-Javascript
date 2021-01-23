/*
  RESIZE AND EXPORT LAYERS FOR DISCORD AND TWITCH
  By: Saad Azim
  Last Edit: 2021.01.22

  Resizes & export layers in PNG-24 format.

  Released under GNU GPL 3.0
  ... er ... that's about it.
*/

var customOutputBase='Project Name'
    ,pngMatteColorHex='3b0257' //Dark Purple

    //Export sizes and folder name
    ,emoteFormat=[
      {'size':512,'folder':'High Res'}
      ,{'size':112,'folder':'Twitch/112x112'}
      ,{'size':56,'folder':'Twitch/56x56'}
      ,{'size':32,'folder':'Discord'}
      ,{'size':28,'folder':'Twitch/28x28'}
    ]

    ,checkFolder
    ,processImage
    ,resizeImage
    ,exportImage

    ,exportEmotes
    ;

checkFolder=function(){
  'use strict';
  outFolder=new Folder(arguments[0])
  return (!outFolder.exists)?outFolder.create():null;
}

processImage=function(){
  'use strict';
  var totalLayers=activeDocument.layers.length
      ,currentLayer
      ,imageSize=UnitValue(arguments[1],'px')
      ,i
      ;

  resizeImage(imageSize);

  for(i=0;i<totalLayers;i+=1){
    currentLayer=activeDocument.layers[i];
    currentLayer.visible=false;
  }

  for(i=0;i<totalLayers;i+=1){
    currentLayer=activeDocument.layers[i];
    currentLayer.visible=true;
    exportImage(arguments[0]+'/'+currentLayer.name);
    currentLayer.visible=false;
  }
}

resizeImage=function(){
  'use strict';
  app.activeDocument.resizeImage(
    arguments[0] //Width
    ,arguments[0] //Height
    ,72 //Resolution
    ,ResampleMethod.BICUBICSHARPER //Resample Method
  );
}

exportImage=function(){
  'use strict';
  var pngOptions=new ExportOptionsSaveForWeb()
      ,pngMatteColor=new RGBColor()
      ,outFile=new File(arguments[0]+'.png');
      ;

  pngMatteColor.hexValue=pngMatteColorHex;

  pngOptions.format=SaveDocumentType.PNG;
  pngOptions.transparency=true;
  pngOptions.PNG8=false;
  pngOptions.matteColor=pngMatteColor;

  activeDocument.exportDocument(
    outFile
    ,ExportType.SAVEFORWEB
    ,pngOptions
  );
}

exportEmotes=function(){
  'use strict';

  var i
      ,outPath
      ,format
      ,saveState=app.activeDocument.activeHistoryState
      ;

  for(i=0;i<emoteFormat.length;i+=1){
    format=emoteFormat[i];
    outPath=activeDocument.path+'/output'+((customOutputBase.length)?('/'+customOutputBase):'')+'/'+format.folder;
    checkFolder(outPath);
    processImage(outPath,format.size);
  }

  app.activeDocument.activeHistoryState=saveState;
  return 'Done exporting layers :D';
}

try{
  exportEmotes();
}catch(errorMessage){
  alert(errorMessage);
}