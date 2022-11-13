import { BufferedReader } from "./BufferedReader.js";
import { sleep } from "https://js.sabae.cc/sleep.js";

class LiDARReader {
  constructor(bufreader) {
    this.r = bufreader;
  }
  async read() {
    let nskip = 0;
    let na5 = 0;
    for (let i = 0; i < 10000; i++) {
      const n = await this.r.readByte();
      nskip++;
      if (n != 0xa5) {
        //console.log(n)
        na5 = 0;
      } else {
        na5++;
        if (na5 == 4) {
          break;
        }
      }
    }
    /*
    console.log("nskip", nskip - 4)
    const header = await this.r.readInt(4);
    if (header != 0xa5a5a5a5) {
      throw new Error("not packet: " + header.toString(16));
    }
    //*/
    const address = await this.r.readByte();
    const cmd = await this.r.readByte();
    const len = await this.r.readShort();
    const data = await this.r.read(len);
    const chk = await this.r.readByte();
    // todo: check checksum
    //console.log(address, cmd, len, buf.length);
    return { address, cmd, data };
  }
  async readScan() { // env, data
    const { address, cmd, data } = await this.read();
    if (cmd != CMD_SCAN || data.length != 322) {
      return { env: undefined, data: undefined };
    }
    const view = new DataView(data.buffer);
    const env = view.getUint16(0);
    const res = [];
    const res2 = [];
    for (let i = 0; i < 160; i++) {
      const n = view.getUint16(2 + i * 2);
      // the upper 7 bits are intensity data
      // the lower 9 bits are distance
      const u = n & 0x7f;
      const l = n >> 7;
      res.push(u);
      res2.push(l);
    }
    return { env, intensity: res, distance: res2 };
  }
};

const CMD_ADDRESS = 0x60; // 96
const CMD_SCAN = 0x63; // 99
const CMD_STOP = 0x64; // 100
const CMD_RESET = 0x67;

const makeCommand = (cmd) => {
  console.log("makeCommand", cmd.toString(16));
  return new Uint8Array([
    0xa5, 0xa5, 0xa5, 0xa5,
    0x00,
    cmd,
    0x00, 0x00,
    cmd,
  ])
};

export class LiDAR {
  constructor(port) {
    this.port = port;
    this.writer = port.writable.getWriter();
    this.reader = port.readable.getReader({ mode: "byob" });
    this.lreader = new LiDARReader(new BufferedReader(this.reader));
    this.scanmode = false;
  }
  static async init(port) {
    const baudRate = 921600;
    await port.open({ baudRate });
    const res = new LiDAR(port);
    return res;
  }
  async start() {
    if (this.scanmode) {
      return;
    }
    this.scanmode = true;
    await this.writer.write(makeCommand(CMD_SCAN));
    for (;;) {
      const { env, intensity, distance } = await this.lreader.readScan();
      if (env === undefined) {
        break;
      }
      this.onupdate(env, intensity, distance);
    }
    console.log("end_start")
  }
  async reset() {
    await this.writer.write(makeCommand(CMD_RESET));
    //const { value, done } = await reader.read();
    //console.log(value, done);
    await sleep(100);
  }
  async stop() {
    if (!this.scanmode) {
      return;
    }
    this.scanmode = false;
    await this.writer.write(makeCommand(CMD_STOP));
    //const r = await this.lreader.read();
    //const r = await this.reader.read(new Uint8Array(100));
    //console.log(r);
  }
  onupdate(env, intensity, distance) { // env (ambient light), data.length == 160
    console.log(env, intensity, distance);
  }
};
