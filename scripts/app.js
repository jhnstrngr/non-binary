const cameraView = document.getElementById('cameraview')

//  Loads trained AI models.
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.ageGenderNet.loadFromUri('/models')
]).then(startVideo)

//  Starts capturing webcam.
function startVideo() {
  navigator.getUserMedia(
    {
      video: {}
    },
    stream => cameraView.srcObject = stream,
    err => console.warn(err)
  )
}

//  Event listener that applies the library to video.
cameraView.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(cameraView)
  document.body.append(canvas)
  const size = { width: cameraView.width, height: cameraView.height }
  faceapi.matchDimensions(canvas, size)

  let genderField = document.getElementById("genderField");
  let probField = document.getElementById("probField");
 
//  Asycrinous tast that checks the face every 2 seconds and prints the results into the fields set.
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(cameraView, new faceapi.TinyFaceDetectorOptions())
      .withAgeAndGender();

    // console.log(detections);

    const resizedResults = faceapi.resizeResults(detections, size);
    resizedResults.forEach(result => {
      const { age, gender, genderProbability } = result

      genderField.innerHTML = "";
      genderField.innerHTML += `${gender}`;

      probField.innerHTML = "";
      probField.innerHTML += `${faceapi.round(genderProbability*100)}`;    
    });

  }, 2000);
});