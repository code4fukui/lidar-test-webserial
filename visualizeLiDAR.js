const canvas = document.createElement("canvas");
visualizer.appendChild(canvas);
canvas.width = 160;
canvas.height = 500;
canvas.style.width = (160 * 3) + "px";
canvas.style.height = canvas.height + "px";
canvas.willReadFrequently = true;
const g = canvas.getContext("2d");
let l = 0;

export const visualizeLiDAR = (env, intensity, distance) => {
  //const view = intensity;
  const view = distance
  const img = g.getImageData(0, 0, canvas.width, canvas.height);
  /*
  for (let i = canvas.height - 1; i > 1; i--) {
    for (let j = 0; j < canvas.width * 4; j++) {
      img.data[i * canvas.width * 4 + j] = img.data[(i - 1) * canvas.width * 4 + j]
    }
  }
  */
  for (let i = 0; i < distance.length; i++) {
    //const off = i * 4 + canvas.width * 4 * (canvas.height - 1);
    //const off = i * 4;
    const off = i * 4 + l * canvas.width * 4;
    img.data[off + 0] = view[i];
    img.data[off + 1] = view[i];//intensity[i];
    img.data[off + 2] = view[i];
    img.data[off + 3] = 255;
  }
  g.putImageData(img, 0, 0); // , 0, 0, canvas.width, canvas.height);
  l++;
  l %= 500;
  //console.log(distance[0], l);
};