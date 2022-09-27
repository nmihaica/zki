```
npm install zki
```

ili

```  
yarn add zki
```

```
let generator = new zki(
  p12b64,
  'lozinka_certifikata'
)

let zk = generator.algorithm(invoice)
console.log(zk)
```

ZKI je modul za potpisivanje, izračunavanje zaštitnog koda za račune po pseudokodu i algoritmu zadanom od PURH.

ZKI  - zaštitni kod izdavatelja  
PURH - porezna uprava republike hrvatska

node consumation.js

node v14.15.0  
npm   v6.14.8  
yarn   1.22.5
