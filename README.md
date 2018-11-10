# OpenAlias Record Builder

This tool will allow you to easily build OpenAlias TXT records. All you need to do is select a currency and enter the address where funds should be received then copy the TXT record into your DNS config.

If you are building a record for an Ethereum based coin, you can use MetaMask to sign the address signature field.

There is no backend, all you need to do is build the site and you can run it in a browser from anywhere.

See an example here:  https://orb.outdoordevs.com

## Building

```
npm install
npm run build
```

The open index.html from the /build folder.

## Developing

Use `npm run start` to start a local dev server.  A browser window to http://localhost:3000 should appear.


## References


## References Used

https://openalias.org/#extend
https://kjur.github.io/jsrsasign/
https://kjur.github.io/jsrsasign/sample/sample-rsasign.html
https://github.com/kjur/jsrsasign/wiki/Tutorial-for-Signature-class
https://kjur.github.io/jsrsasign/api/symbols/KJUR.crypto.Signature.html
https://developers.google.com/speed/public-dns/docs/dns-over-https
https://wiki.parity.io/JSONRPC-personal-module#personal_sign
https://wiki.parity.io/JSONRPC-personal-module#personal_ecrecover

