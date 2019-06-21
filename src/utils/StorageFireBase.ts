//let Storage : any = null;
// Create a root reference
var storageRef :any = null;

function setRef(storage: any) {
  //Storage = storage;
  storageRef = storage.ref();
}

function uploadImg(nombre: number, fileContent: string, callBack : any) {
    let file = storageRef.child(nombre+'');
    file.putString(fileContent, 'data_url').then(function(snapshot: any) {
        console.log('Uploaded a base64url string!');
        snapshot.ref.getDownloadURL().then(function(downloadURL: any) {
            console.log('File available at', downloadURL);
            callBack(nombre, downloadURL);
        });
    });    
}

export default {setRef, uploadImg};