// For help writing plugins, visit the documentation to get started:
//   https://support.insomnia.rest/article/173-plugins
const {
  signQuery,
  signTransaction,
  getSinFromPublicKey,
} = require("@fluree/crypto-utils");
const Url = require("url-parse");

const txParams = () => {
  const rollNonce = () => Math.ceil(Math.random() * 100);
  return { expire: Date.now() + 1500, fuel: 100000, nonce: rollNonce() };
};

module.exports.requestHooks = [
  ({ request }) => {
    const publicKey = request.getEnvironmentVariable("FLUREE_PUBLIC_KEY");
    const privateKey = request.getEnvironmentVariable("FLUREE_PRIVATE_KEY");
    const verbose = !!request.getEnvironmentVariable("VERBOSE_TX");
    // debugger;
    const path = request.getUrl();
    if (publicKey && privateKey) {
      const parsedUrl = new Url(path);
      const splitPath = parsedUrl.pathname.split("/");
      const network = splitPath[2];
      const db = splitPath[3];
      const command = splitPath[4];
      const param = request.getBody();
      const miniParam = JSON.stringify(JSON.parse(param.text));
      const auth = getSinFromPublicKey(publicKey);
      if (command === "command") {
        const { expire, fuel, nonce } = txParams();
        const command = signTransaction(
          auth,
          `${network}/${db}`,
          expire,
          fuel,
          nonce,
          privateKey,
          miniParam
        );
        if (verbose) command["txid-only"] = false;
        const stringCmd = JSON.stringify(command);
        request.setBody({ mimeType: "application/json", text: stringCmd });
      } else if (command === "query") {
        /** @todo Mention omission of auth from signQuery docs */
        const signedRequest = signQuery(
          privateKey,
          miniParam,
          command,
          `${network}/${db}`,
          auth
        );
        const headerArr = Object.entries(signedRequest.headers);
        headerArr.forEach((header) => {
          request.addHeader(header[0], header[1]);
        });
        request.setBody({
          mimeType: "application/json",
          text: signedRequest.body,
        });
      }
    }
  },
  (context) => {
    debugger;
  },
];
