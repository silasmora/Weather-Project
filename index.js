//Creating a class for 'saved areas'

class SavedAreas {
  constructor() {
    this.areas = []
  }

  addArea(area) {
    this.areas.push({...area, timestamp: new Date()})
  }

  removeArea(area) {
    this.areas = this.areas.filter(a => a !== area)
  }
}

const savedAreas = new SavedAreas()

//creating a function that adds to the dom such an 'Li' and a new refetch button to the saved areas div. 
//Refetch button has an event listener that allows the user to re-check the wearher for that saved area as well as last update timestamp.

const areaUl = document.querySelector(".area-card > ul")

function addAreaToSavedList(area) {
  const newLi = document.createElement("li")
  newLi.textContent = `${area.name} -last updated: ${area.timestamp.toLocaleString()}`
  areaUl.appendChild(newLi)
  const reFetchButton = document.createElement("button")
  reFetchButton.textContent = "Re-Check Weather?"
  reFetchButton.classList.add("out-buttons")
  newLi.appendChild(reFetchButton)

  reFetchButton.addEventListener("click", () => {
    weather.fetchWeather(area.name)
  })

}

//added an event handler that triggers the save button to create data on the saved areas div
document.getElementById("save-btn").onclick = () => {
  savedAreas.addArea({
    name: document.getElementById("location").innerHTML,
    temp: document.getElementById("temperature").innerHTML
  })
  addAreaToSavedList(savedAreas.areas[savedAreas.areas.length - 1])
}

//created an object that includes fetching weather api, updates the main card dom, and fetches a giffy depending on the weather description, and a search function that will that will trigger the fetchweather function based on the user's value on the search bar. 
let weather = {
  apikey : "c8596534f5d2eda75a42895657759807",
  fetchWeather: function(city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q="
      + city
      + "&units=imperial&appid="
      + this.apikey
    )
    .then((res) => res.json())
    .then((data) => {
      weather.displayWeather(data)
      document.getElementById("location").innerHTML = data.name
      document.getElementById("temperature").innerHTML = data.main.temp
      weather.getGif(data.weather[0].description)
    })
    .catch((err) => console.error(err))
  },
  displayWeather: function(data) {
    const { name } = data
    const { icon, description } = data.weather[0]
    const { temp, humidity } = data.main
    const { speed } = data.wind

    document.querySelector(".city").innerText = "Weather in " + name
    document.querySelector(".icon").src = "http://openweathermap.org/img/w/" + icon + ".png"
    document.querySelector(".description").innerText = description
    document.querySelector(".temp").innerText = Math.floor(temp) + "° F"
    document.querySelector(".humidity").innerText = "Humidity: " + humidity
    document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h"
    document.querySelector(".weather").classList.remove("loading")
    
  },

  getGif: function(description) {
    fetch(
      `https://api.giphy.com/v1/gifs/translate?api_key=Uqe6q2p7Gxk0rgD1FY7Hu7hRxfj8bQBo&s=${description}`
      )
      .then((res) => res.json())
  
      .then((parsed) => {
        const imgGif = document.querySelector("#gif")
        imgGif.src = parsed.data.images.original.url
      })
  
      .catch((err) => console.error(err))
  },

  search: function() {
    this.fetchWeather(document.querySelector(".search-bar").value)
  }
}
  
//event listeners that trigger the search button and by using the enter key

document.querySelector(".search button").addEventListener("click", function() {
  weather.search()
}) 

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
  if (event.key == "Enter") {
    weather.search()
  }
})

//calling the fetch weather function and using los angeles as a start up default.
weather.fetchWeather("Los Angeles")




