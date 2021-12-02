// For help writing plugins, visit the documentation to get started:
//   https://support.insomnia.rest/article/173-plugins
var crypto = require("crypto");
const { signQuery, getSinFromPublicKey } = require("@fluree/crypto-utils");
const Url = require("url-parse");

// TODO: Add plugin code here...
// module.exports.requestActions = [
//   {
//     label: "Send request",
//     action: async (context, data) => {
//       const { request } = data;
//       const response = await context.network.sendRequest(request);
//       const html = `<code>${request.name}: ${response.statusCode}</code>`;
//       context.app.showGenericModalDialog("Results", { html });
//     },
//   },
// ];

module.exports.requestHooks = [
  ({ request }) => {
    const publicKey = request.getEnvironmentVariable("FLUREE_PUBLIC_KEY");
    const privateKey = request.getEnvironmentVariable("FLUREE_PRIVATE_KEY");
    const path = request.getUrl();
    if (publicKey && privateKey) {
      console.log({ publicKey, privateKey });
      const parsedUrl = new Url(path);
      const splitPath = parsedUrl.pathname.split("/");
      const network = splitPath[2];
      const db = splitPath[3];
      const command = splitPath[4];
      const param = request.getBody();
      const miniParam = JSON.stringify(JSON.parse(param.text));
      const auth = getSinFromPublicKey(publicKey);
      debugger;
      if (command === "command") {
        console.log("transact");
      } else if (command === "query") {
        /** @todo Mention omission of auth from signQuery docs */
        const signedRequest = signQuery(
          privateKey,
          miniParam,
          command,
          `${network}/${db}`,
          auth
        );
        debugger;
        const headerArr = Object.entries(signedRequest.headers);
        headerArr.forEach((header) => {
          request.addHeader(header[0], header[1]);
        });
        request.setBody({
          mimeType: "application/json",
          text: signedRequest.body,
        });
        console.log(request.getBody());
        const gotHeaders = request.getHeaders();
        console.log(gotHeaders);
        console.log(request.getMethod());
      }
    }
  },
  (context) => {
    debugger;
  },
];
