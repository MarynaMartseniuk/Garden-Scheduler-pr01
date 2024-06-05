$(document).foundation();

const apiUrl = 'https://perenual.com/api/species-list?key=sk-nV5Y664fa6394ed345548&page=1';

$(document).ready(function () {
    // Event listener for modal button
    $('button[data-open="plant-modal"]').on('click', function () {
        fetchPlantData();
    });

    // Event listener for plant selection
    $('#plant-select').on('change', function () {
        const plantId = $(this).val();
        if (plantId) {
            fetchPlantDetails(plantId);
        }
    });

    // Event listener for dismiss button using event delegation
    $(document).on('click', '.dismiss-button', function () {
        const plantId = $(this).closest('.plant-info').data('plant-id');
        removePlantData(plantId);
        $(this).closest('.plant-info').remove(); // Remove the closest parent with class 'plant-info'
    });

    // Load plant data from localStorage when the page is loaded
    loadSavedPlantData();
});

// Function to fetch plant data
function fetchPlantData() {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const plants = data.data;
            populatePlantSelect(plants);
        })
        .catch(error => console.error('Error fetching plant data:', error));
};

// Function to populate the plant select dropdown
function populatePlantSelect(plants) {
    const select = $('#plant-select');
    select.empty(); // Clear existing options
    select.append('<option value="">Select a plant</option>');
    plants.forEach(plant => {
        select.append(`<option value="${plant.id}">${plant.common_name}</option>`);
    });
};

// Function to fetch and display plant details
function fetchPlantDetails(plantId) {
    fetch(`https://perenual.com/api/species/details/${plantId}?key=sk-nV5Y664fa6394ed345548`)
        .then(response => response.json())
        .then(data => {
            if (data && data.id) {
                displayPlantInfo(data);
                // Store plant data in local storage
                savePlantData(data);
            } else {
                console.error('Unexpected plant details data structure:', data);
            }
        })
        .catch(error => console.error('Error fetching plant details:', error));
};

// Function to save plant data in localStorage
function savePlantData(plant) {
    let savedPlantData = localStorage.getItem('plantData');

    // Ensure savedPlantData is a valid array
    try {
        savedPlantData = JSON.parse(savedPlantData);
        if (!Array.isArray(savedPlantData)) {
            savedPlantData = [];
        }
    } catch (e) {
        savedPlantData = [];
    }

    // Add the new plant data
    savedPlantData.push(plant);

    // Save back to localStorage
    localStorage.setItem('plantData', JSON.stringify(savedPlantData));
}

// Function to remove plant data from localStorage
function removePlantData(plantId) {
    let savedPlantData = localStorage.getItem('plantData');

    // Ensure savedPlantData is a valid array
    try {
        savedPlantData = JSON.parse(savedPlantData);
        if (!Array.isArray(savedPlantData)) {
            savedPlantData = [];
        }
    } catch (e) {
        savedPlantData = [];
    }

    // Filter out the plant to remove
    const updatedPlantData = savedPlantData.filter(plant => plant.id !== plantId);

    // Save back to localStorage
    localStorage.setItem('plantData', JSON.stringify(updatedPlantData));
}

// Function to load plant data from localStorage
function loadSavedPlantData() {
    let savedPlantData = localStorage.getItem('plantData');

    // Ensure savedPlantData is a valid array
    try {
        savedPlantData = JSON.parse(savedPlantData);
        if (Array.isArray(savedPlantData)) {
            savedPlantData.forEach(plant => {
                displayPlantInfo(plant);
            });
        }
    } catch (e) {
        console.error('Error loading saved plant data:', e);
    }
}

// Function to display plant information
function displayPlantInfo(plant) {
    const infoDiv = $('#plant-info-main');
    const plantInfo = `
        <div class="plant-info" data-plant-id="${plant.id}">
            <h3>${plant.common_name || 'N/A'}</h3>
            <p><strong>Scientific Name:</strong> ${plant.scientific_name ? plant.scientific_name.join(', ') : 'N/A'}</p>
            <p><strong>Other Names:</strong> ${plant.other_name ? plant.other_name.join(', ') : 'N/A'}</p>
            <p><strong>Cycle:</strong> ${plant.cycle || 'N/A'}</p>
            <p><strong>Sunlight:</strong> ${plant.sunlight ? plant.sunlight.join(', ') : 'N/A'}</p>
            <p><strong>Watering:</strong> ${plant.watering || 'N/A'}</p>
            <img src="${plant.default_image ? plant.default_image.original_url : ''}" alt="${plant.common_name || 'N/A'}">
            <button class="dismiss-button">Dismiss</button>
        </div>
    `;
    infoDiv.append(plantInfo);
}

// Weather API

const APIKey = "6d91ac03912ea4111a6d0d3486084c05";
const inputCity = document.querySelector('#cname');
const submitBtn = document.querySelector('#cnsubmit');
const wRes = document.querySelector('#weatherRes');

let city;

// get location for the Weather request

submitBtn.addEventListener('click', function () {
    city = inputCity.value;
    console.log(city);
});

// get info for API request URL

const urlParams = new URLSearchParams(window.location.search);
city = urlParams.get('cname');

// If city has a value then do request to API

if (city !== null) {
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            const resCity = document.createElement('p');
            const resTemp = document.createElement('p');
            const resWeather = document.createElement('p');

            const kelvinTemp = data.main.temp;
            const celsiusTemp = kelvinTemp - 273.15;
            const fahrenheitTemp = (kelvinTemp - 273.15) * 9 / 5 + 32;

            resCity.textContent = `${data.name}, ${data.sys.country}`;
            resTemp.textContent = `Temperature: ${celsiusTemp.toFixed(2)} °C / ${fahrenheitTemp.toFixed(2)} °F`;
            resWeather.textContent = `Weather: ${data.weather[0].main}`;

            wRes.appendChild(resCity);
            wRes.appendChild(resTemp);
            wRes.appendChild(resWeather);
        });
}


//My Gardening Notes with Local Storage

const saveButton = document.querySelector('#saveBtn');
const userNoteInput = document.querySelector('#new-comment');
const userNotesOutput = document.querySelector('#outputNotes');
const viewNotesButton = document.querySelector('#viewNotes');
var note;

// save user notes to Local Storage
// needs to be fixed because it saves only the tast user note

// saveButton.addEventListener('click', function (event) {
//     event.preventDefault();

//         if (userNoteInput.value) {

//             localStorage.setItem('userGardenNote', userNoteInput.value);
//             note = document.createElement('li');
//             note.textContent = localStorage.getItem('userGardenNote');
//             console.log(note.textContent);
//             userNotesOutput.appendChild(note);
//             userNoteInput.value = "";
//         };
// });

// display list of user notes by user reqeust if user click on View My Notes button
//  needs to be fixed because it dispalies only the tast user note because Local Storage has only last note

// viewNotesButton.addEventListener('click', function (event) {
//     event.preventDefault();
//     note = document.createElement('li');
//     note.textContent = localStorage.getItem('userGardenNote');
//     console.log(note.textContent);
//     userNotesOutput.appendChild(note);
// });
