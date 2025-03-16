import brotliPromise from '/node_modules/brotli-wasm/index.web.js';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export function useBrotli() {
  async function compress(data) {
    try {
      const brotli = await brotliPromise;
      const inputData = textEncoder.encode(data);
      const compressedData = brotli.compress(inputData);
      if (!compressedData) {
        throw new Error('Compression returned null');
      }
      return btoa(String.fromCharCode.apply(null, compressedData));
    } catch (err) {
      console.error("Brotli Compression failed:", err);
      return data;
    }
  }

  async function decompress(compressedData) {
    try {
      const brotli = await brotliPromise;
      const binaryString = atob(compressedData);
      const inputData = Uint8Array.from(binaryString, c => c.charCodeAt(0));
      const decompressedData = brotli.decompress(inputData);
      if (!decompressedData) {
        throw new Error('Decompression returned null');
      }
      return textDecoder.decode(decompressedData);
    } catch (err) {
      console.error("Brotli Decompression failed:", err);
      return compressedData;
    }
  }

  return { compress, decompress };
}