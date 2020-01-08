const cameraView = document.getElementById('cameraview')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.ageGenderNet.loadFromUri('/models')
]).then(() => {
  navigator.getUserMedia(
    {
      video: {}
    },
    stream => cameraView.srcObject = stream,
    err => console.warn(err)
  )
});


cameraView.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(cameraView)
  document.body.append(canvas)
  const size = { width: cameraView.width, height: cameraView.height }
  faceapi.matchDimensions(canvas, size)
 
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(cameraView, new faceapi.TinyFaceDetectorOptions())
      .withAgeAndGender();

    const resizedResults = faceapi.resizeResults(detections, size);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    resizedResults.forEach(result => {
      const { age, gender, genderProbability } = result
      new faceapi.draw.DrawTextField(
        [
          `${faceapi.round(age, 0)} years`,
          `${gender} (${faceapi.round(genderProbability)})`
        ],
        result.detection.box.bottomRight
      ).draw(canvas);
    });
  }, 100);
});