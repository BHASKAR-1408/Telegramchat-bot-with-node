const GoogleSpreadSheet = require("google-spreadsheet");
const { promisify } = require("util");

const cred = require("./client_secret.json");

// function for accessing spreadsheet

async function sendDatatoBot(chatId) {
  console.log(chatId, 1);
  const doc = new GoogleSpreadSheet(
    "19lUEk10Lx9d7eoDYMPGL0vI8IZG0R4nRsY-NXWsxdiQ"
  );
  //   console.log("this is working");
  await promisify(doc.useServiceAccountAuth)(cred);
  const info = await promisify(doc.getInfo)();
  const sheet = info.worksheets[0];

  // getting data from sreadsheet
  const rows = await promisify(sheet.getRows)({
    offset: 1,
  });

  //list of data of perticular user
  var finalValue = "";
  rows.forEach((element) => {
    if (chatId == element.chatid) {
      finalValue += element.userquery + "\n";
    }
  });
  return "These are all your queires:-" + " \n" + finalValue;
}

module.exports = { sendDatatoBot };

// function h() {
//   return "this is my function";
// }
// module.exports = h;
