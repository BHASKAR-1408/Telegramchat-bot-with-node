const GoogleSpreadSheet = require("google-spreadsheet");
const { promisify } = require("util");

const cred = require("./client_secret.json");

// function for accessing spreadsheet

async function accessSpreadsheet(Id, firstname, userQuery) {
  const doc = new GoogleSpreadSheet(
    "19lUEk10Lx9d7eoDYMPGL0vI8IZG0R4nRsY-NXWsxdiQ"
  );
  console.log("this is working");
  await promisify(doc.useServiceAccountAuth)(cred);
  const info = await promisify(doc.getInfo)();
  const sheet = info.worksheets[0];
  // adding data to the spreadsheet
  const row = {
    chatId: Id,
    first_name: firstname,
    userQuery: userQuery,
  };
  await promisify(sheet.addRow)(row);
}

module.exports = { accessSpreadsheet };
