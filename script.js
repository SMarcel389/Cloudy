const APIKey1 = "TGQTF69JNXQ3LLU62FV45MRXR";
const APIKey2 = "44XPLUJN6FNUK953SYLLZM2EY";
let targetlocation = "Pécs";
let unitGroup = "metric";
let language = "hu";

const now = new Date();
const currentTime = now.toLocaleTimeString();
console.log(currentTime);

function langSelector() {
  const langselect = document.querySelector(".langselect");
  let langs = ["hu", "en"];
  langs.forEach((lang) => {
    const button = document.createElement("button");
    button.className = lang;
    button.innerText = lang.toUpperCase();
    button.addEventListener("click", () => {
      language = lang;
      console.log(`Set language to \"${lang}\"`);
      refresh(targetlocation, lang);
    });
    langselect.appendChild(button);
  });
}

function unitSelector() {
  const unitselect = document.querySelector(".unitselect");
  let units = [
    {
      group: "metric",
      sign: "°C",
    },
    {
      group: "us",
      sign: "°F",
    },
  ];
  units.forEach((unit) => {
    const button = document.createElement("button");
    button.className = unit.group;
    button.innerText = unit.sign;
    button.addEventListener("click", () => {
      unitGroup = unit.group;
      console.log(`Set unitGroup to \"${unit.group}\", using ${unit.sign}`);
      refresh(targetlocation, language, unitGroup);
    });
    unitselect.appendChild(button);
  });
}
langSelector();
unitSelector();

// Fetch data from the API
function fetchWeather() {
  let MyAPIKey = APIKey1;
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
    targetlocation
  )}?unitGroup=${unitGroup}&key=${MyAPIKey}&lang=${language}`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status} ${response.statusText}`
        ); // Check for HTTP errors
      }
      return response.json();
    })
    .then((data) => {
      let weather = {
        address: data.address,
        datetime: data.currentConditions.datetime,
        temp: data.currentConditions.temp,
        condition: data.currentConditions.conditions,
        condIcon: data.currentConditions.icon,
        status: data.description,
        alerts: data.alerts,
        days: data.days,
      };
      console.log(weather);
      return weather;
    })
    .catch((errorResponse) => {
      if (errorResponse && typeof errorResponse.text === "function") {
        errorResponse.text().then((errorMessage) => {
          console.error("Error:", errorMessage);
        });
      } else {
        console.error("Failed to fetch data.", errorResponse);
      }
    });
}

function renderCurrent(weather) {
  if (!weather) return;
  const currentPanel = document.querySelector(".current");
  currentPanel.innerHTML = "";

  const currentInfo = document.createElement("div");
  currentInfo.className = "currentInfo";

  const currentLocation = document.createElement("h1");
  const currentTimeLocal = new Date().toLocaleTimeString();
  currentLocation.innerText = targetlocation + " " + currentTimeLocal;

  const currentTemp = document.createElement("h1");
  currentTemp.innerText = weather.temp + getUnits();

  const currentCondition = document.createElement("p");
  currentCondition.innerText = weather.status;

  currentInfo.append(currentLocation, currentTemp, currentCondition);

  const statusIcon = document.createElement("img");
  statusIcon.src = `./img/icons/meteocons--${weather.condIcon}.svg`;

  currentPanel.append(currentInfo, statusIcon);
}

fetchWeather().then(renderCurrent);

function refresh(newloc, lang = "hu", units = unitGroup) {
  targetlocation = newloc;
  language = lang;
  unitGroup = units;
  fetchWeather().then(renderCurrent);
}

const button = document.querySelector("#execute");
const searchbox = document.querySelector("#search");

button.addEventListener("click", () => {
  const currentPanel = document.querySelector(".current");
  if (currentPanel) {
    currentPanel.innerHTML = "";
  }

  let searchquery = searchbox.value;
  newTargetLoc = capFirst(searchquery);
  refresh(newTargetLoc);
});

function capFirst(str) {
  return str.toLowerCase().replace(/(^|\s)\S/g, (firstLetter) => {
    return firstLetter.toUpperCase();
  });
}

function getUnits() {
  if (unitGroup === "metric") {
    return "°C";
  } else if (unitGroup === "us") {
    return "°F";
  } else {
    return "unkown units";
  }
}
