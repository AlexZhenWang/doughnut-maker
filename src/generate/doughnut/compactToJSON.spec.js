const compactToJSON = require("./compactToJSON");
const { objectToCertificateU8a } = require("./certificateMappers");

const FULL_STOP_ASCII = 46;

const certificateObj = {
  issuer: new Uint8Array([1, 2, 3, 4]),
  holder: new Uint8Array([4, 3, 2, 1]),
  expiry: 555,
  not_before: 1234,
  permissions: { data: "here" },
  version: 0
};
const certificateUInt8Array = objectToCertificateU8a(certificateObj);

describe("when using compactToJSON", () => {
  it("should return the certificate as an object and signature as UInt8Array", () => {
    const compact = new Uint8Array([
      ...certificateUInt8Array,
      FULL_STOP_ASCII,
      5,
      3,
      2,
      1
    ]);

    const result = compactToJSON(compact);

    const expected = {
      certificate: certificateObj,
      signature: new Uint8Array([5, 3, 2, 1])
    };

    expect(result).toEqual(expected);
  });
});
