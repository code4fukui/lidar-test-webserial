import * as t from "https://deno.land/std/testing/asserts.ts";
import { BufferedReader } from "./BufferedReader.js";

Deno.test("simple", async () => {
  const file = await Deno.open("./test.txt", { read: true });
  const r = new BufferedReader(file.readable.getReader({ mode: "byob" }));
  //const r = new BufferedReader(file.readable.getReader());
  const buf = await r.read(4);
  //console.log(buf);
  const txt = new TextDecoder().decode(buf);
  t.assertEquals(txt, "ABCD");
  const txt2 = new TextDecoder().decode(await r.read(2));
  t.assertEquals(txt2, "EF");
  /*
  t.assertThrows(async () => {
    const res = await r.read(5);
    console.log(res);
  });
  */
  //await r.close();
  await file.close();
});
