const dayjs = require('dayjs')
const forge = require('node-forge')
const crypto = require('crypto')

module.exports = class {
  constructor(certificate, password) {
    const prepared = this.prepare(certificate, password)
    this.private_key = prepared.private_key
    this.public_key = prepared.public_key
  }
  prepare(p12b64, password) {
    // prepare and extract data from p12 base64 encoded certificate
    // using node-forge
    let public_key;
    let private_key;
    // decode
    const p12Der = forge.util.decode64(p12b64);
    const p12Asn1 = forge.asn1.fromDer(p12Der);
    const p12 = forge.pkcs12.pkcs12FromAsn1(
      p12Asn1,
      password
    );
    // certbags and keybags
    const certBags = p12.getBags({bagType: forge.pki.oids.certBag});
    const pkeyBags = p12.getBags({bagType: forge.pki.oids.pkcs8ShroudedKeyBag});
    // TODO: check which certificate is pulling,
    // and decide what is best way to sign, using crypto or node-forge
    const certBag = certBags[forge.pki.oids.certBag][0];
    var keybag = pkeyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0];
    // extract keys
    public_key = forge.pki.publicKeyToPem(certBag.cert.publicKey)
    private_key = forge.pki.privateKeyToPem(keybag.key)

    return {
      public_key: public_key,
      private_key: private_key
    }
  }
  algorithm(data) {
    let total;
    // oib obveznika fiskalizacije
    total = data.oib
    // datVrij - datum i vrijeme izdavanja računa zapisani kao
    // tekst u formatu 'dd.MM.gggg hh:mm:ss'
    total += dayjs(data.datVrij).format('DD.MM.YYYY HH:mm:ss')
    // bor - brojčana oznaka računa
    total += data.bor
    // opp - oznaka poslovnog prostora
    total += data.opp
    // onu - oznaka naplatnog uređaja
    total += data.onu
    // uir - ukupan iznos računa
    total += data.uir
    let signature = this.sign(total, this.private_key)
    let hash = this.hash(signature)
    let verify = this.verify(total, this.public_key, signature)
    // console.log("verify: ", verify)
    return hash;
  }
  sign(data, private_key){
    let newData;
    let document; 
    let documentHex;
    const signer = crypto.createSign('RSA-SHA1')
    newData = Buffer.from(data.toString(), 'ascii')
    signer.update(newData)
    // if I add to hex it will not verify,
    // however you should do hex-encoding as
    // porezna-uprava.rh expects it like that
    document = signer.sign(private_key)
    documentHex = document.toString('hex')  
    /* console.log("sign() document: ", document)  
    console.log("sign() documentHex: ", documentHex)   */
    return document
  }
  verify(data, public_key, signature){
    const verifier = crypto.createVerify('RSA-SHA1')
    verifier.update(data)
    return verifier.verify(public_key, signature)
  }
  hash(data){
    const hasher = crypto.createHash('md5')
    const hash = hasher.update(data);
    return hash.digest('hex')
  }
}
