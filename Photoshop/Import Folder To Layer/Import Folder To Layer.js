/*
  IMPORT FOLDER TO LAYER
  By: Saad Azim
  Last Edit: 2022.01.12

  Imports all images in a folder to the target file, as layers.

  Released under GNU GPL 3.0
  ... er ... that's about it.
*/

'use strict';

importLayers=function(){
  var inputFolder=Folder.selectDialog("Select Image Folder")
      ,inputArray=inputFolder.getFiles()
      ,tmpFrame

      ,targetDoc

      ,i=0
  
      ;
  $.writeln('Processing '+(inputArray.length)+' files\n');

  if(documents.length==0){
    tmpFrame=app.open(new File(inputArray[i++]));
    app.activeDocument.layers[0].selected=true;
    app.activeDocument.layers[0].copy();
    
    targetDoc=app.documents.add(
        app.activeDocument.width
        ,app.activeDocument.height
        ,app.activeDocument.resolution
        ,'New Document'
        ,app.activeDocument.Mode
        ,DocumentFill.TRANSPARENT
      );
    tmpFrame.close(SaveOptions.DONOTSAVECHANGES);
    targetDoc.paste();
  }else{
    targetDoc=app.activeDocument;
  }

  for(i;i<inputArray.length;i+=1){
    tmpFrame=app.open(new File(inputArray[i]));
    app.activeDocument.layers[0].selected=true;
    app.activeDocument.layers[0].copy();
    tmpFrame.close(SaveOptions.DONOTSAVECHANGES);
    targetDoc.paste();
  }

  return 'Done importing layers :D';
}

try{
  importLayers();
}catch(errorMessage){
  alert(errorMessage);
}