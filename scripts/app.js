const cameraView = document.getElementById('cameraview')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.ageGenderNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    {
      video: {}
    },
    stream => cameraView.srcObject = stream,
    err => console.warn(err)
  )
}

// document.getElementById("myText").value = `${faceapi.round(age, 0)} years`,
// `${gender} (${faceapi.round(genderProbability)})`;

cameraView.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(cameraView)
  document.body.append(canvas)
  const size = { width: cameraView.width, height: cameraView.height }
  faceapi.matchDimensions(canvas, size)
  let genderField = document.getElementById("genderField");
  let probField = document.getElementById("probField");
 
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(cameraView, new faceapi.TinyFaceDetectorOptions())
      .withAgeAndGender();

      console.log(detections);

      


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