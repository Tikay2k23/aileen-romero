import { Instrument_Serif } from "next/font/google";

// Loaded once here and imported where it's used: every call to a font function hosts its own copy.
// The serif italic accent in headings (the hero's "real growth", the Work heading's "Systems.")
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});
