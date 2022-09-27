const fs = require('fs')
const zki = require('./zki')
const demo = require('./demo')

let config = {
  client_certificate: {
    path: "./FISKAL_DEMO.p12",
    password: "1234aA"
  }
}
// load cert
const p12b64 = fs.readFileSync(
  config.client_certificate.path,
  'base64'
)


let a = new zki(
  p12b64,
  config.client_certificate.password
)

let zk = a.algorithm(demo)
console.log(zk)
