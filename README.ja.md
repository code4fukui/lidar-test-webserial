# lidar-test-webserial

[Web Serial API](https://developer.mozilla.org/en-US/docs/Web/API/Serial) を使用した、[LiDARユニット GS2](https://akizukidenshi.com/catalog/g/gM-17407/) 用のブラウザベースのテストおよび可視化ツールです。

## デモ

https://code4fukui.github.io/lidar-test-webserial/

デモでは、HTML Canvas上にLiDARの距離データをリアルタイムでスクロールするウォーターフォールプロットとして可視化します。

## 機能

- Webブラウザから直接LiDARユニット GS2に接続します。
- Web Serial APIを利用して、ドライバ不要のハードウェア通信を行います。
- 距離データのリアルタイムなウォーターフォール可視化を描画します。

## 要件

- [LiDARユニット GS2](https://akizukidenshi.com/catalog/g/gM-17407/) センサ。
- Web Serial APIをサポートするブラウザ（例: Chrome、Edge、Opera 89+）。

## 使い方

1. LiDARセンサをコンピュータにUSBで接続します。
2. [デモページ](https://code4fukui.github.io/lidar-test-webserial/)を対応ブラウザで開きます。
3. `requestPort` ボタンをクリックし、LiDARセンサのシリアルポートを選択します。
4. `startScan` ボタンをクリックして、リアルタイムのデータ可視化を開始します。

## API

コアロジックは `LiDAR` クラス（`LiDAR.js`）にあります。`onupdate` プロパティにコールバック関数を割り当てることで、センサデータを受信できます。

```javascript
import { LiDAR } from "./LiDAR.js";

const port = await navigator.serial.requestPort();
const lidar = await LiDAR.init(port);

lidar.onupdate = (env, intensity, distance) => {
  // データ処理用のコード
  console.log(distance);
};
lidar.start();
```

`onupdate` コールバックは、データパケットごとに以下の3つの引数を受け取ります。

- `env`: 環境光レベルを表す整数（0-65535）。
- `intensity`: 信号強度を表す160個の整数の配列（0-127）。
- `distance`: 測定距離を表す160個の整数の配列（0-511）。

## ライセンス

MIT License — 詳細は [LICENSE](LICENSE) を参照してください。
