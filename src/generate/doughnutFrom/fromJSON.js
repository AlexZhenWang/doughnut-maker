const { hexToU8a } = require("@polkadot/util");
const createCompact = require("../doughnut/createCompact");
const fromUint8Array = require("./fromUint8Array");
const {
  objectToCertificateU8a,
  certificateObjToSnakeCase
} = require("../doughnut/certificateMappers");
const { isEvenHex, validateCertificate } = require("../../util");

const validate = compactJSON => {
  validateCertificate(compactJSON.certificate);

  if (!isEvenHex(compactJSON.signature)) {
    throw new Error(
      "Compact JSON should have a property 'signature' that is a hex string of even length"
    );
  }
};

const generateDoughnutFromJSON = compactJSON => {
  validate(compactJSON);
  const certificateObjCamelCase = compactJSON.certificate;
  const signatureHexString = compactJSON.signature;

  const certificateU8a = objectToCertificateU8a(
    certificateObjToSnakeCase(certificateObjCamelCase)
  );
  const signatureU8a = hexToU8a(signatureHexString);

  const compact = createCompact(certificateU8a, signatureU8a);
  return fromUint8Array(compact);
};

module.exports = generateDoughnutFromJSON;
