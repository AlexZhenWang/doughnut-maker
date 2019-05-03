const {
  schnorrkelKeypairFromSeed,
  stringToU8a,
  cryptoWaitReady,
  schnorrkelVerify
} = require("@cennznet/util");
const doughnutMaker = require("./");
const {
  objectToCertificate
} = require("./generate/doughnut/certificateMappers");
const createCompact = require("./generate/doughnut/createCompact");

let issuerKeyPair;
let holderKeyPair;
let doughnut;
const expiry = 5555;
const not_before = 1234;
const permissions = {
  has: "permissions"
};

beforeAll(async () => {
  await cryptoWaitReady();

  issuerKeyPair = schnorrkelKeypairFromSeed(
    stringToU8a("cennznetjstest".padEnd(32, " "))
  );
  holderKeyPair = schnorrkelKeypairFromSeed(
    stringToU8a("holderkeypair".padEnd(32, " "))
  );
  doughnut = doughnutMaker.generate.doughnut(
    issuerKeyPair,
    holderKeyPair.publicKey,
    expiry,
    not_before,
    permissions
  );
});

describe("when generating doughnut", () => {
  describe("input verification", () => {
    it("should throw if issuerKeyPair publicKey not u8a", () => {
      expect(() =>
        doughnutMaker.generate.doughnut(
          {
            publicKey: "6".repeat(32),
            secretKey: issuerKeyPair.secretKey
          },
          holderKeyPair.publicKey,
          expiry,
          not_before,
          permissions
        )
      ).toThrow(
        "IssuerKeyPair must contain a publicKey of UInt8Array length 32"
      );
    });

    it("should throw if issuerKeyPair publicKey not length 32", () => {
      expect(() =>
        doughnutMaker.generate.doughnut(
          {
            publicKey: new Uint8Array([1, 2, 3, 4]),
            secretKey: issuerKeyPair.secretKey
          },
          holderKeyPair.publicKey,
          expiry,
          not_before,
          permissions
        )
      ).toThrow(
        "IssuerKeyPair must contain a publicKey of UInt8Array length 32"
      );
    });

    it("should throw if issuerKeyPair secretKey not u8a", () => {
      expect(() =>
        doughnutMaker.generate.doughnut(
          {
            publicKey: issuerKeyPair.publicKey,
            secretKey: "6".repeat(64)
          },
          holderKeyPair.publicKey,
          expiry,
          not_before,
          permissions
        )
      ).toThrow(
        "IssuerKeyPair must contain a secretKey of UInt8Array length 64"
      );
    });

    it("should throw if issuerKeyPair secretKey not length 64", () => {
      expect(() =>
        doughnutMaker.generate.doughnut(
          {
            publicKey: issuerKeyPair.publicKey,
            secretKey: new Uint8Array([1, 2, 3, 4])
          },
          holderKeyPair.publicKey,
          expiry,
          not_before,
          permissions
        )
      ).toThrow(
        "IssuerKeyPair must contain a secretKey of UInt8Array length 64"
      );
    });

    it("should throw if holderPublicKey not a u8a", () => {
      expect(() =>
        doughnutMaker.generate.doughnut(
          issuerKeyPair,
          "6".repeat(32),
          expiry,
          not_before,
          permissions
        )
      ).toThrow("Input HolderPublicKey should be a UInt8Array of length 32");
    });

    it("should throw if holderPublicKey a u8a of length not 32", () => {
      expect(() =>
        doughnutMaker.generate.doughnut(
          issuerKeyPair,
          new Uint8Array([1, 2, 3, 4]),
          expiry,
          not_before,
          permissions
        )
      ).toThrow("Input HolderPublicKey should be a UInt8Array of length 32");
    });

    it("should throw if not_before not a number", () => {
      expect(() =>
        doughnutMaker.generate.doughnut(
          issuerKeyPair,
          holderKeyPair.publicKey,
          expiry,
          "",
          permissions
        )
      ).toThrow("Input not_before should be unix timestamp number");
    });

    it("should throw if expiry not a number", () => {
      expect(() =>
        doughnutMaker.generate.doughnut(
          issuerKeyPair,
          holderKeyPair.publicKey,
          "",
          not_before,
          permissions
        )
      ).toThrow("Input expiry should be unix timestamp number");
    });

    it("should throw if permissions not an object", () => {
      expect(() =>
        doughnutMaker.generate.doughnut(
          issuerKeyPair,
          holderKeyPair.publicKey,
          expiry,
          not_before,
          () => {}
        )
      ).toThrow("Input permissions should be an object");
    });
  });
  // it("should have properties value and toJSON", () => {
  //   expect(doughnut.value).toBeInstanceOf(Uint8Array);
  //   expect(typeof doughnut.toJSON).toBe("function");
  // });

  // test("value should be made from certificate and signature", () => {
  //   const { value } = doughnut;
  //   const { certificate, signature } = doughnut.toJSON();

  //   const certificateU8a = objectToCertificate(certificate);
  //   expect(value).toEqual(createCompact(certificateU8a, signature));
  // });

  // it("should return the correct certificate", () => {
  //   const { certificate } = doughnut.toJSON();

  //   const expectedCertificateObject = {
  //     issuer: issuerKeyPair.publicKey,
  //     holder: holderKeyPair.publicKey,
  //     expiry,
  //     not_before,
  //     permissions,
  //     version: 0
  //   };

  //   expect(certificate).toEqual(expectedCertificateObject);
  // });

  // it("should return the correct signature", () => {
  //   // assuming that the certificate is correct from above
  //   const { certificate, signature } = doughnut.toJSON();

  //   const certificateU8a = objectToCertificate(certificate);
  //   expect(
  //     schnorrkelVerify(certificateU8a, signature, issuerKeyPair.publicKey)
  //   ).toBe(true);
  // });
});
