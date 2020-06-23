import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { FilesCollection } from 'meteor/ostrio:files';
import { check } from 'meteor/check';


export const Images = new FilesCollection({ // Meteor.Files FilesCollection
  storagePath: ( Meteor.settings.FS_STORE_RELATIVE ) ? ( Meteor.absolutePath +'/' + Meteor.settings.FS_STORE_FILESYSTEM_PATH ) : (Meteor.settings.FS_STORE_FILESYSTEM_PATH) , //'assets/app/uploads/uploadedFiles',
  collectionName: 'Images',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 1024*1024*20 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 20MB';
    }
  }
});

if (Meteor.isServer) {
  Meteor.publish('files.all', function () {
    return Images.collection.find({});
  });
}

Meteor.methods({
  /*'files.images.insert'(file, fileLocator){
      // Vemos si el tipo 'text' es String
      


      /*if (!  this.userId) {
          throw new Meteor.Error('not-authorized');
      }*/
/*
      Images.insert({
        file: file,
        meta: {
          locator: fileLocator,
          userId: Meteor.userId() // Optional, used to check on server for file tampering
        },
        streams: 'dynamic',
        chunkSize: 'dynamic',
        allowWebWorkers: true // If you see issues with uploads, change this to false
      }, false)

  },*/

  'files.images.remove'(imageId){
      check(imageId, String);
      const image = Images.findOne(imageId);
      if (image.meta.userId !== this.userId) { // || admin ???
          // make sure only the owner can delete it
          throw new Meteor.Error('not-authorized');
      }

      Images.remove(imageId);
  },

  'files.images.rename'(imageId, prompt){
    check(imageId, String);   

    Images.update(imageId, {
      $set: { name: prompt },
    });
    
  },

  'files.images.updateLocation'(imageId, location){

    Images.update(imageId, {
      $set: { "meta.locator"  : location },
    });

  },

  
  

});