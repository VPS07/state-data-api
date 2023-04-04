const axios = require("axios");
const cheerio = require("cheerio");

///// getting states data from wikipedia /////

const scrapeData = async (state_name) => {
  const url = `https://en.wikipedia.org/wiki/${state_name},_India`;
  //// Format of data
  const stateDataObj = {
    government: {},
    area: {},
    population: {},
    gdp: {},
    languages: {},
  };
  try {
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);

    // all properties
    const state_name = $("div.fn").text();
    const stateRawData = $("tbody tr");
    stateDataObj["state_name"] = state_name;

    let stateAllInfoValue = [];
    let stateAllInfoKey = [];
    let headerValueObj = [];

    // remove spaces from string
    function removeSpaces(str) {
      if (str.includes(String.fromCharCode(160)) && str.includes("\xA0")) {
        return str.substring(0, 10);
      } else if (str.includes(" ")) {
        return str.substring(0, str.indexOf(" "));
      } else if (str.includes("[")) {
        return str.substring(0, str.indexOf("["));
      }
      return str;
    }

    // remove dots from string
    function removeDots(str) {
      if (str.includes(String.fromCharCode(160)) && str.includes("\xA0")) {
        return str.substring(3, str.length);
      }
      return str;
    }

    // remove brackets,front space and back space from string
    function removeBracketsFrontBackSpaces(str) {
      if (str.includes("[")) {
        str = str.substring(0, str.indexOf("["));
      }
      if (str[0] === " " || str[0] === "\n") {
        str = str.substring(1, str.length);
      }
      if (str[str.length - 1] === " ") {
        str = str.substring(0, str.lastIndexOf(" "));
      }
      if (str.includes("\n")) {
        str = str.replaceAll("\n", ",");
      }
      return str;
    }

    // replace space with dash
    function replaceSpaceWithDash(str) {
      if (str.includes("(")) {
        str = str.substring(0, str.indexOf("("));
      }
      if (str.includes(" ")) {
        str = removeBracketsFrontBackSpaces(str);
        str = str.replaceAll(" ", "_");
      }
      if (str.includes(String.fromCharCode(160))) {
        str = str.replace(String.fromCharCode(160), "_");
      }
      return str;
    }

    // change gsdp to gdp
    function changeGsdpToGdp(str) {
      if (str.includes("GSDP")) {
        str = str.replace("GSDP", "GDP");
      }
      return str;
    }

    let objName = "";
    stateRawData.each((idx, el) => {
      let infoBoxData = $(el).children(".mergedtoprow td.infobox-data").text();
      let infoBoxLabel = $(el)
        .children(".mergedtoprow th.infobox-label")
        .text();
      let infoBoxheader = $(el)
        .children(".mergedtoprow th.infobox-header")
        .text();

      let infoBoxheaderData = $(el)
        .children(".mergedrow td.infobox-data")
        .text();
      let infoBoxheaderLabel = $(el)
        .children(".mergedrow th.infobox-label")
        .text();

      if (infoBoxheaderData === "" && infoBoxheaderLabel === "") {
        if (infoBoxheader !== "" || infoBoxheader === "") {
          objName = infoBoxheader;
        }
        if (infoBoxData === "" && infoBoxLabel === "") {
          return;
        } else {
          stateAllInfoValue.push(
            removeBracketsFrontBackSpaces(infoBoxData).toLowerCase()
          );
          stateAllInfoKey.push(
            replaceSpaceWithDash(infoBoxLabel).toLowerCase()
          );
        }
        return;
      } else {
        headerValueObj.push({
          objName: changeGsdpToGdp(removeSpaces(objName)).toLowerCase(),
          key: replaceSpaceWithDash(
            removeDots(infoBoxheaderLabel)
          ).toLowerCase(),
          value: removeBracketsFrontBackSpaces(infoBoxheaderData).toLowerCase(),
        });
      }
    });

    for (let i = 0; i < stateAllInfoKey.length; i++) {
      stateDataObj[stateAllInfoKey[i]] = stateAllInfoValue[i];
    }

    for (let j = 0; j < headerValueObj.length; j++) {
      if (stateDataObj[headerValueObj[j].objName] === undefined) {
        stateDataObj[headerValueObj[j].key] = headerValueObj[j].value;
      } else {
        stateDataObj[headerValueObj[j].objName][headerValueObj[j].key] =
          headerValueObj[j].value;
      }
    }

    return stateDataObj;
  } catch (error) {
    console.log(error);
  }
};

module.exports = scrapeData;
