const pinataSDK = require("@pinata/sdk");
require("dotenv").config();

const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET);

pinata
  .testAuthentication()
  .then((result) => {
    //handle successful authentication here
    console.log(result);

    pinata
      .pinList({
        hashContains: "QmUJ8R4fgxEicPiRheUf9h34EQrYN8xMvwJQ2HqRnLYiYd",
      })
      .then((result) => {
        console.log(result);
      });
  })
  .catch((err) => {
    //handle error here
    console.log(err);
  });
