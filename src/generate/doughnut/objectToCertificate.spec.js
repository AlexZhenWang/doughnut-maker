const objectToCertificate = require("./objectToCertificate");
const { stringToU8a } = require("@cennznet/util");

const issuerPublicKey = new Uint8Array([1, 2, 3, 4, 5, 6]);

const holderPublicKey = new Uint8Array([9, 8, 7, 6, 5]);
const expiry = 555;
const not_before = 654321;
const permissions = {
  myPermissions: true
};

describe("when using objectToCertificate", () => {
  it("should return the correct u8a", () => {
    const input = {
      issuer: issuerPublicKey,
      holder: holderPublicKey,
      expiry,
      not_before,
      permissions,
      version: 0
    };

    const result = objectToCertificate(input);

    const expected = stringToU8a(btoa(JSON.stringify(input)));

    expect(result).toEqual(expected);
  });
});
