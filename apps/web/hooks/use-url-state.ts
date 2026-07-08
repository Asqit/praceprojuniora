// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=
// Most browser allow atmost 2K worth of characters
// That roughly is 2kb given that 1 char is 1 byte (8bits)
// Zlib (pako) has ratio from 2:1 to 5:1
// this gives us headroom for about 4k of characters 100% sure
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=
import { deflate } from "pako"
