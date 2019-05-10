const FULL_STOP_ASCII = 46;

const createCompact = (prefixU8a, certificateU8a, signatureU8a) =>
  new Uint8Array([
    ...prefixU8a,
    ...certificateU8a,
    FULL_STOP_ASCII,
    ...signatureU8a
  ]);

const destructureCompact = compact => {
  const prefixU8a = compact.slice(0, 1);
  const fullStopIndex = compact.indexOf(FULL_STOP_ASCII);

  const certificateU8a = compact.slice(1, fullStopIndex);
  const signatureU8a = compact.slice(fullStopIndex + 1);

  return { prefixU8a, certificateU8a, signatureU8a };
};

module.exports = { createCompact, destructureCompact };
