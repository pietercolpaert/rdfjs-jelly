import { JellyConformanceError } from '../errors';

export function encodeVarint(value: number): Uint8Array {
  if (!Number.isSafeInteger(value) || value < 0 || value > 0xffff_ffff) {
    throw new JellyConformanceError(`Invalid uint32 value: ${value}`);
  }
  const output: number[] = [];
  let remaining = value;
  do {
    let byte = remaining % 128;
    remaining = Math.floor(remaining / 128);
    if (remaining) byte |= 0x80;
    output.push(byte);
  } while (remaining);
  return Uint8Array.from(output);
}

export interface DecodedVarint {
  value: number;
  offset: number;
}

export function decodeVarint(input: Uint8Array, offset = 0): DecodedVarint | undefined {
  let value = 0;
  let multiplier = 1;
  for (let i = 0; i < 5; i++) {
    const byte = input[offset + i];
    if (byte === undefined) return undefined;
    value += (byte & 0x7f) * multiplier;
    if ((byte & 0x80) === 0) {
      if (value > 0xffff_ffff) throw new JellyConformanceError('Varint exceeds uint32 range');
      return { value, offset: offset + i + 1 };
    }
    multiplier *= 128;
  }
  throw new JellyConformanceError('Varint is longer than 5 bytes');
}

export function concatBytes(chunks: readonly Uint8Array[]): Uint8Array {
  const length = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
  const output = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output;
}

export function asUint8Array(input: Uint8Array | ArrayBuffer): Uint8Array {
  return input instanceof Uint8Array ? input : new Uint8Array(input);
}

