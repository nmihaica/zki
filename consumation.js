

const fs = require('fs')
const zki = require('./zki')

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

const invoice = {
  oib: '11111999998',
  uSustPdv: true,
  datVrij: new Date(2021, 0, 2),
  //datVrij: new Date().toISOString(),
  oznSlijed: 'P',
  brRac: {
    bor: '22002',
    opp: 'blag001',
    onu: '1',
  },
  uir: '12.50',
  //pdv nije obvezan
  pdv: [{
    stopa: '25.00',
    osnovica: '10.00',
    iznos: '2.50'
  },{
    stopa: '10.00',
    osnovica: '10.00',
    iznos: '1.00'
  }],
  //pnp nije obvezan
  pnp: [{
    stopa: '25.00',
    osnovica: '10.00',
    iznos: '2.50'
  }],
  //naknade nije obvezan
  naknade: [{
    nazivN: 'Povratna Naknada',
    iznosN: '1.00'
  }],
  nacinPlac: 'G',
  oibOper: '11111999998',
  nakDost: false,
  paragonBrRac: '123/33/22',
  specNamj: 'Navedeno kao primjer'
}

let a = new zki(
  p12b64,
  config.client_certificate.password
)

let zk = a.algorithm(invoice)
console.log(zk)
