/**
 * Convert IEEE 754 hex string to decimal number
 * @param {string} hexString - Hex string (e.g., '3f800000' for FP32)
 * @param {'fp16'|'fp32'|'fp64'} precision - Precision format
 * @returns {number} decimal number
 */
export function hexToFloat(hexString, precision = 'fp32') {
  const cleanHex = hexString.replace(/[^a-fA-F0-9]/g, '').toLowerCase();
  let expectedLength;

  switch (precision) {
    case 'fp16':
      expectedLength = 4;
      break;
    case 'fp32':
      expectedLength = 8;
      break;
    case 'fp64':
      expectedLength = 16;
      break;
    default:
      throw new Error(`Unsupported precision: ${precision}`);
  }

  if (cleanHex.length !== expectedLength) {
    throw new Error(
      `Invalid hex length for ${precision}: expected ${expectedLength}, got ${cleanHex.length}`
    );
  }

  const buffer = new ArrayBuffer(expectedLength / 2); // 2 hex chars = 1 byte
  const view = new DataView(buffer);

  // Parse hex bytes in LITTLE-ENDIAN order (standard in JS)
  for (let i = 0; i < expectedLength; i += 2) {
    const byte = parseInt(cleanHex.slice(i, i + 2), 16);
    view.setUint8(i / 2, byte);
  }

  switch (precision) {
    case 'fp16':
      return decodeFP16(view.getUint16(0, false)); // littleEndian=false
    case 'fp32':
      return view.getFloat32(0, false);
    case 'fp64':
      return view.getFloat64(0, false);
    default:
      throw new Error(`Unsupported precision: ${precision}`);
  }
}

/**
 * Convert decimal number to IEEE 754 hex string
 * @param {number} num - Decimal number
 * @param {'fp16'|'fp32'|'fp64'} precision - Precision format
 * @returns {string} hex string (lowercase, zero-padded)
 */
export function floatToHex(num, precision = 'fp32') {
  let buffer, byteLength, expectedHexLength;

  switch (precision) {
    case 'fp16':
      {
        const bits = encodeFP16(num);
        buffer = new ArrayBuffer(2);
        const view = new DataView(buffer);
        view.setUint16(0, bits, false); // littleEndian
        byteLength = 2;
        expectedHexLength = 4;
      }
      break;
    case 'fp32':
      buffer = new ArrayBuffer(4);
      new DataView(buffer).setFloat32(0, num, false);
      byteLength = 4;
      expectedHexLength = 8;
      break;
    case 'fp64':
      buffer = new ArrayBuffer(8);
      new DataView(buffer).setFloat64(0, num, false);
      byteLength = 8;
      expectedHexLength = 16;
      break;
    default:
      throw new Error(`Unsupported precision: ${precision}`);
  }

  // Convert buffer to hex string
  const view = new DataView(buffer);
  let hex = '';
  for (let i = 0; i < byteLength; i++) {
    const b = view.getUint8(i);
    hex += b.toString(16).padStart(2, '0');
  }

  return hex.toLowerCase();
}

// --- FP16 (Half Precision) Helper Functions ---

/**
 * Decode FP16 (16-bit) to JS number (FP64)
 * @param {number} bits - 16-bit unsigned integer
 * @returns {number}
 */
function decodeFP16(bits) {
  const sign = (bits & 0x8000) >> 15;
  const exp = (bits & 0x7c00) >> 10;
  const frac = bits & 0x03ff;

  if (exp === 0x1f) {
    // Infinity or NaN
    return frac === 0 ? (sign ? -Infinity : Infinity) : NaN;
  }

  if (exp === 0) {
    // Subnormal or zero
    const value = frac / (2 ** 10) * 2 ** -14;
    return sign ? -value : value;
  }

  // Normal number
  const value = (1 + frac / (2 ** 10)) * 2 ** (exp - 15);
  return sign ? -value : value;
}

/**
 * Encode JS number to FP16 (16-bit) bits
 * @param {number} num
 * @returns {number} 16-bit unsigned integer
 */
function encodeFP16(num) {
  if (isNaN(num)) return 0x7e00; // Quiet NaN
  if (num === Infinity) return 0x7c00;
  if (num === -Infinity) return 0xfc00;

  const sign = num < 0 || (num === 0 && 1 / num < 0) ? 1 : 0;
  let abs = Math.abs(num);

  let exp, frac;

  if (abs === 0) {
    exp = 0;
    frac = 0;
  } else if (abs < 2 ** -14) {
    // Subnormal
    frac = Math.round(abs / 2 ** -24);
    exp = 0;
    if (frac === 1024) {
      // Underflow to normal
      frac = 0;
      exp = 1;
    }
  } else if (abs >= 65536) {
    // Overflow to infinity
    exp = 31;
    frac = 0;
  } else {
    // Normal
    const normalized = abs;
    exp = Math.floor(Math.log2(normalized)) + 15;
    if (exp <= 0) {
      // Underflow to subnormal
      frac = Math.round(normalized / 2 ** -24);
      exp = 0;
    } else if (exp >= 31) {
      // Overflow to infinity
      exp = 31;
      frac = 0;
    } else {
      frac = Math.round((normalized / 2 ** (exp - 15) - 1) * 1024);
      if (frac === 1024) {
        // Round up to next exponent
        frac = 0;
        exp++;
        if (exp === 31) {
          // Overflow
          frac = 0;
        }
      }
    }
  }

  return (sign << 15) | (exp << 10) | frac;
}