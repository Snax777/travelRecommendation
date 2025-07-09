const jsonFile = "./travel_recommendation_api.json";

async function getJSONData(file) {
  const response = await fetch(file);

  if (!response.ok) {
    return new Error("Failed to fetch data");
  }

  const data = await response.json();

  console.log(data); //

  return data;
}

async function getValidSearch() {
  const userInput = document.querySelector(".search-value").value.trim();
  const jsonData = await getJSONData(jsonFile);
  const jsonDataKeysArray = Object.keys(jsonData);
  const jsonDataKey = jsonDataKeysArray[0];
  let filteredData = [];

  if (!userInput) {
    window.alert("Please enter a keyword");
    return;
  } else {
    console.log(userInput);
  } //

  if (
    userInput.toLowerCase() === "country" ||
    jsonDataKey.includes(userInput.toLowerCase())
  ) {
    const dataObject = jsonData["countries"];

    for (data of dataObject) {
      filteredData = filteredData.concat(data["cities"]);
    }
  } else {
    for (let i = 1; i < jsonDataKeysArray.length; i++) {
      if (jsonDataKeysArray[i].includes(userInput.toLowerCase())) {
        const dataObject = jsonData[jsonDataKeysArray[i]];

        for (data of dataObject) {
          let dataCopy = {
            ...data,
          };
          filteredData = filteredData.concat(dataCopy);
        }

        break;
      }
    }
  }

  console.log(filteredData); //

  return filteredData;
}

function removeRecommendations() {
    if (document.getElementById("recommendations")) {
        document.getElementById("recommendations").remove();
    }

    if (document.getElementById("no-results")) {
        document.getElementById("no-results").remove();
    }
}

async function getRecommendations() {
    const validResults = await getValidSearch();
    const length = validResults.length;
    let overviewDiv = document.getElementById("overview");
        

    removeRecommendations();

    if (!validResults || length === 0) {
        let noResultsDiv = document.createElement("div");
        let heading1Element = document.createElement("h1");
        heading1Element.innerHTML = "No results";

        noResultsDiv.setAttribute("id", "no-results");
        noResultsDiv.appendChild(heading1Element);
        overviewDiv.appendChild(noResultsDiv);
        document.body.appendChild(overviewDiv);
    } else {
        let recommendationsDiv = document.createElement("div");
        
        recommendationsDiv.setAttribute("id", "recommendations");
    }
}