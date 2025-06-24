/**
 * Tiny wrapper around the browser's SpeechRecognition / webkitSpeechRecognition
 * so we don’t need an npm package.
 *
 * At build-time (when window is undefined) this module simply exports `null`,
 * preventing SSR / static build errors.  At run-time in the browser it exposes
 * the correct constructor or `null` if the API is unavailable.
 */
export type SpeechRecognitionConstructor = (new () => any) | null

const SpeechRecognitionImpl: SpeechRecognitionConstructor =
  typeof window !== "undefined"
    ? window.SpeechRecognition ||
      // Safari / some Chrome versions
      (window as any).webkitSpeechRecognition ||
      null
    : null

export default SpeechRecognitionImpl
