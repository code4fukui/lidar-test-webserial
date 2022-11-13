const BUF_SIZE = 1024 * 10;

export class BufferedReader {
  constructor(reader) {
    this.r = reader;
    this.len = 0;
    this.pos = 0;
    this.eof = false;
    this.decoder = new TextDecoder();
  }
  async read(len) {
    //console.log(this.buf.length - this.pos, this.buf.length)
    if (this.len - this.pos == 0) {
      if (this.eof) {
        throw new Error("eof");
      }
      const { value, done } = await this.r.read(new Uint8Array(BUF_SIZE));
      //console.log("read1", value, done, this.r);
      if (value === null) {
        throw new Error("eof");
      }
      this.buf = value;
      //console.log("read", this.buf?.length);
      this.len = value?.length;
      this.pos = 0;
      this.eof = done;
    }
    //console.log("BUF", this.buf)
    const res = new Uint8Array(len);
    let off = 0;
    for (;;) {
      //console.log("for", len, this.len, this.pos);
      const remain = this.len - this.pos;
      if (len <= remain) {
        for (let i = 0; i < len; i++) {
          res[off + i] = this.buf[this.pos + i];
        }
        this.pos += len;
        return res;
      } else {
        for (let i = 0; i < remain; i++) {
          res[off + i] = this.buf[this.pos + i];
        }
        off += remain;
        len -= remain;
        if (this.eof) {
          throw new Error("eof");
        }
        const { value, done } = await this.r.read(new Uint8Array(BUF_SIZE));
        //console.log("read2", value?.length, done);
        this.buf = value;
        this.pos = 0;
        this.len = value?.length;
        this.eof = done;
      }
    }
  }
  async readString(len) {
    return this.decoder.decode(await this.read(len));
  }
  async readInt() {
    const b = await this.read(4);
    return b[0] | (b[1] << 8) | (b[2] << 16) | (b[3] << 24);
  }
  async readShort() {
    const b = await this.read(2);
    return b[0] | (b[1] << 8);
  }
  async readByte() {
    const b = await this.read(1);
    return b[0];
  }
  async close() {
    await this.r.close();
  }
}
