/**
 * 使用 Deflate 算法（zlib格式）压缩文本并返回 Blob 对象
 */
export async function deflateCompress(text: string): Promise<Blob> {
  const cs = new CompressionStream("deflate");
  const compressedStream = new Blob([text]).stream().pipeThrough(cs);
  return new Response(compressedStream).blob();
}

export async function encodeBuildCode(xml: string): Promise<string> {
  const bytes = new Uint8Array(
    await (await deflateCompress(xml)).arrayBuffer(),
  );
  const chunks: string[] = [];
  for (let i = 0; i < bytes.length; i += 8192) {
    chunks.push(String.fromCharCode(...bytes.subarray(i, i + 8192)));
  }
  return btoa(chunks.join("")).replaceAll("+", "-").replaceAll("/", "_");
}
