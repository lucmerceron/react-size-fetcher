export default function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message)
  }
  /* eslint-enable no-console */
  try {
    throw new Error(message)
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}