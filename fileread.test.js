const file = await Deno.open("./test.txt", { read: true });
const r = file.readable.getReader({ mode: "byob" });
console.log(r);
const { value, done } = await r.read(new Uint8Array(10));
console.log(value, done);
