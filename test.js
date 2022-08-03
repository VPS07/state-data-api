const cheerio = require("cheerio");
const axios = require("axios");
var nietos = [];
var obj = {};
obj["01"] = "jiii";
obj["02"] = "hgfsdf";
nietos.push({ obj });
// console.log(nietos);
const str = "0.763[4] (high)";
const after_ = str.replace(" ", "-");

console.log(str.length, after_);

function demoObj(key, value) {
  this.key = this.value;
}

const obj2 = new demoObj("name", "test");
// console.log(obj2);

async function getData() {
  try {
    const { data } = await axios.get("http://localhost:5000/api/state_data/");
    console.log(data.Government["Chief-Minister"]);
  } catch (err) {
    console.log(err);
  }
}

getData();
