# lidar-test-webserial

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A browser-based test and visualization tool for the [LiDAR unit GS2](https://akizukidenshi.com/catalog/g/gM-17407/) using the [Web Serial API](https://developer.mozilla.org/en-US/docs/Web/API/Serial).

## Demo

https://code4fukui.github.io/lidar-test-webserial/

The demo visualizes the LiDAR's distance data in real-time as a scrolling waterfall plot on an HTML Canvas.

## Features

- Connects directly to a LiDAR unit GS2 from a web browser.
- Utilizes the Web Serial API for driverless hardware communication.
- Renders a real-time waterfall visualization of distance data.

## Requirements

- A [LiDAR unit GS2](https://akizukidenshi.com/catalog/g/gM-17407/) sensor.
- A browser that supports the Web Serial API (e.g., Chrome, Edge, or Opera 89+).

## Usage

1.  Connect the LiDAR sensor to your computer via USB.
2.  Open the [demo page](https://code4fukui.github.io/lidar-test-webserial/) in a compatible browser.
3.  Click the `requestPort` button and select the serial port for your LiDAR sensor.
4.  Click the `startScan` button to begin the real-time data visualization.

## API

The core logic is in the `LiDAR` class (`LiDAR.js`). You can receive sensor data by assigning a callback function to the `onupdate` property.

```javascript
import { LiDAR } from "./LiDAR.js";

const port = await navigator.serial.requestPort();
const lidar = await LiDAR.init(port);

lidar.onupdate = (env, intensity, distance) => {
  // Your code to process the data
  console.log(distance);
};
lidar.start();
```

The `onupdate` callback receives three arguments with each data packet:

-   `env`: An integer representing the ambient light level (0-65535).
-   `intensity`: An array of 160 integers representing signal intensity (0-127).
-   `distance`: An array of 160 integers representing measured distance (0-511).

## License

MIT License — see [LICENSE](LICENSE).