import { useEffect, useState } from 'react';

import {
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';

import UploadLoader from '../UploadLoader/UploadLoader';

const StorageWork = ({ data }) => {

  const [loadDone, setLoadDone] = useState(false);

  // Get a reference to the storage service
  const storage = getStorage();

  const metadata = {
    contentType: data.fileType,
  };

  // Create a storage reference from my storage service
  const storageRef = ref(storage, data.storagePath);

  useEffect(() => {

    uploadBytes(storageRef, data.file, metadata).then(() => {
   
      setLoadDone(true)
      
    });
  // eslint-disable-next-line
  },[]);

  useEffect(() => {

    if(loadDone) {

      data.setFileLoaded(true); 
      
    }
  // eslint-disable-next-line  
  },[loadDone]);


  // const uploadTask = uploadBytesResumable(storageRef, data.file, metadata);

  // Listen for state changes, errors, and completion of the upload.
  // uploadTask.on(
  //   'state_changed',
  //   snapshot => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //     console.log('Upload is ' + progress + '% done');
     
  //     switch (snapshot.state) {
  //       case 'paused':
          // setUploadStatus('paused');
  //         console.log('Upload is paused');
  //         break;
  //       case 'running':
  //         console.log('Upload is running');
  //         break;
  //     }
  //   },
  //   error => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
  //     switch (error.code) {
  //       case 'storage/unauthorized':
          // User doesn't have permission to access the object
  //         break;
  //       case 'storage/canceled':
          // User canceled the upload
  //         break;

        // .../

  //       case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
  //         break;
  //     }
  //   },
  //   () => {

      // Upload completed successfully, now we can get the download URL
      // getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
      //   console.log('File available at', downloadURL);
      // })
  //     setTimeout(() => setLoadDone(true), 2000);
      
  //   }
  // );
  
  return (
    <div>
      {loadDone ? '' : <UploadLoader />}
    </div>
  );
};

export default StorageWork;
