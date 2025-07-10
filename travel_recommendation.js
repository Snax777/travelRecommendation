const jsonFile = "./travel_recommendation_api.json";

async function getJSONData(file) {
  const response = await fetch(file);

  if (!response.ok) {
    return new Error("Failed to fetch data");
  }

  const data = await response.json();

  return data;
}

async function getValidSearch() {
  let userInput = document.querySelector(".search-value").value.trim();
  let userInputLowerCase = userInput.toLowerCase();
  const jsonData = await getJSONData(jsonFile);
  const jsonDataKeysArray = Object.keys(jsonData);
  const jsonDataKey1 = jsonDataKeysArray[0];
  let filteredData = [];
  const singularKeyArray = ["country", "temple", "beach"];

  if (!userInput) {
    window.alert("Please enter a keyword");
    return;
  }

  if (
    jsonDataKeysArray.includes(userInputLowerCase) ||
    singularKeyArray.includes(userInputLowerCase)
  ) {
    if (
      userInputLowerCase === "country" ||
      jsonDataKey1.includes(userInputLowerCase)
    ) {
      const dataObject = jsonData["countries"];

      for (const data of dataObject) {
        filteredData = filteredData.concat(data["cities"]);
      }
    } else {
      for (let i = 1; i < jsonDataKeysArray.length; i++) {
        if (
          jsonDataKeysArray[i] === userInputLowerCase ||
          jsonDataKeysArray[i].includes(userInputLowerCase)
        ) {
          const dataObject = jsonData[jsonDataKeysArray[i]];

          for (const data of dataObject) {
            let dataCopy = {
              ...data,
            };
            filteredData = filteredData.concat(dataCopy);
          }

          break;
        }
      }
    }
  }

  return filteredData;
}

function removeRecommendations() {
  if (document.getElementById("recommendations")) {
    document.getElementById("recommendations").remove();
  }

  if (document.getElementById("no-results")) {
    document.getElementById("no-results").remove();
  }

  if (document.querySelector(".search-value").value) {
    document.querySelector(".search-value").value = "";
  }
}

async function getRecommendations() {
  const validResults = await getValidSearch();

  removeRecommendations();

  if (validResults === undefined || validResults.length === 0) {
    let noResultsDiv = document.createElement("div");
    let heading1Element = document.createElement("h1");
    heading1Element.textContent =
      "No results for the keyword '" +
      document.querySelector(".search-value").value.trim() +
      "'";

    noResultsDiv.setAttribute("id", "no-results");
    noResultsDiv.appendChild(heading1Element);
    document.getElementById("overview").appendChild(noResultsDiv);
  } else {
    let recommendationsDiv = document.createElement("div");

    recommendationsDiv.setAttribute("id", "recommendations");

    for (let i = 0; i < 2; i++) {
      const data = validResults[i];
      let recommendationDiv = document.createElement("div");
      let newImgElement = document.createElement("img");

      recommendationDiv.setAttribute("class", "recommendation");

      newImgElement.setAttribute("src", data.imageUrl);
      newImgElement.setAttribute("width", "300px");
      newImgElement.setAttribute("height", "200px");

      recommendationDiv.appendChild(newImgElement);

      let heading4Element = document.createElement("h4");
      heading4Element.innerHTML = data.name;

      recommendationDiv.appendChild(heading4Element);

      let paragraphElement = document.createElement("p");
      paragraphElement.innerHTML = data.description;

      recommendationDiv.appendChild(paragraphElement);
      recommendationsDiv.appendChild(recommendationDiv);
    }

    document.getElementById("overview").appendChild(recommendationsDiv);
  }
}
