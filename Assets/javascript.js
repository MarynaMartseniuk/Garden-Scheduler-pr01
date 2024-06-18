// 1. Plant Details: Plant Modal, plant API and Local Storage / created by Joe Sandoval

$(document).foundation();

const apiUrl = 'https://perenual.com/api/species-list?key=sk-nV5Y664fa6394ed345548&page=1';

    //Function to choose the plant display plant info on the page
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



// 2. Weather Forecast: Plant Modal, plant API and Local Storage / created by Maryna Martseniuk

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
        .then(function (data) { // improved by Joe Sandoval
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


//3. My Gardening Notes with Local Storage / created by Maryna Martseniuk

//input const-var declaretion
const gardenNoteForm = document.querySelector('#gardenNotesForm');
const saveNoteButton = document.querySelector('#saveNotesBtn');
const userNoteTitleInput = document.querySelector('#new-comment-title');
const userNoteInput = document.querySelector('#new-comment');

var MyGardenNotesList = JSON.parse(localStorage.getItem("myGardenNotes")) || [];
var addNewNote = {};
var tip ="";

//output const-var declaretion
const userNotesOutput = document.querySelector('#outputNotes');
const viewNotesButton = document.querySelector('#viewNotesBtn');

var noteCard;
var noteTitle;
var note;
var noteList = [];

// console.log(MyGardenNotesList);
// console.log(addNewNote);

    //3.1. save user Gardening Notes to the Local Storage
saveNoteButton.addEventListener('click', function (event) {
    event.preventDefault();

    // console.log(addNewNote);
    // console.log(MyGardenNotesList);

        if (userNoteInput.value && userNoteTitleInput.value) {

            addNewNote =  {
                title: userNoteTitleInput.value,
                note: userNoteInput.value
            };
            console.log(MyGardenNotesList);
            MyGardenNotesList.push(addNewNote);
            // console.log(addNewNote);
            // console.log(MyGardenNotesList);
            
            localStorage.setItem("myGardenNotes", JSON.stringify(MyGardenNotesList));
            userNoteInput.value = "";
            userNoteTitleInput.value = "";
            tip.textContent = "";
            } else {
            tip = document.createElement('p');
            tip.textContent = "!!! Please, fill Tilte and Note Content sections in !!!"
            gardenNoteForm.appendChild(tip);
        };
});

    //3.2. display list of user notes by user reqeust if user click on View My Notes button
viewNotesButton.addEventListener('click', function (event) {
    event.preventDefault();

    noteList = JSON.parse(localStorage.getItem("myGardenNotes"));

    for (let i = 0; i < noteList.length; i++) {

        noteCard = document.createElement('div');
        noteTitle = document.createElement('h4');
        note = document.createElement('p');

        noteTitle.textContent = "your note: " + noteList[i].title;
        note.textContent = noteList[i].note;

        noteCard.append(noteTitle, note);
        userNotesOutput.appendChild(noteCard);

    };
});

//4. Schedule a Plant-Stuff Using / created by Maryna Martseniuk

    // function for "Choose the first day of application" section, a Foundation daypicker
    //let firstDay;

    //input const-var declaretion
    const plantName = document.querySelector('#label1');
    const stuffName = document.querySelector('#label2');
    const firstDayUse = document.querySelector('#dp1');
    const daysBeforeNextUse = document.querySelector('#label3');
    const getNextDayButton = document.querySelector('#getNextDayBtn');
    const scheduleForm = document.querySelector('#getPlantStuffInfo');

    var scheduleList = [];
    var addNewPlantStuff = {};
    var tip2 ="";
    var tip3 ="";

    //output const-var declaretion
    const displayForm = document.querySelector('#label4');
    var scheduleList = JSON.parse(localStorage.getItem("schedule")) || [];
    var scheduleNote;

    console.log(plantName.value);
    console.log(stuffName.value);
    console.log(firstDayUse.value);
    console.log(daysBeforeNextUse.value);

    getNextDayButton.addEventListener('click', function (event) {
        event.preventDefault();

            //4.1. save Plant-Stuff Using info to the Local Storage
    
        if (plantName.value 
                && stuffName.value
                && firstDayUse.value
                && daysBeforeNextUse.value) {

                    // code for Next Day, use dayjs is going here
                    // nextDay = firstday + daysBeforeNextuse;


    
            addNewPlantStuff =  {
                    plant: plantName.value,
                    stuff: stuffName.value,
                    nextDay: "2024-01-01", //get this value from above code
                };
    
            scheduleList.push(addNewPlantStuff);
                
            localStorage.setItem("schedule", JSON.stringify(scheduleList));
            plantName.value = "";
            stuffName.value = "";
            firstDayUse.value = "2024-01-01";
            daysBeforeNextUse.value = "";

            tip2.textContent = "";
            tip3.textContent = "";

            } else {

            tip2 = document.createElement('p');
            tip3 = document.createElement('p');
            tip2.textContent = "========================"
            tip3.textContent = "!!! Please, fill all sections in !!!";
            scheduleForm.append(tip2, tip3);

        };

            //4.2. display Schedule-List of Plant-Stuff Using 

        scheduleList = JSON.parse(localStorage.getItem("schedule"));

        console.log(scheduleList);

        for (let i = 0; i < scheduleList.length; i++) {

            scheduleNote = document.createElement('p');
        
            scheduleNote.textContent = "scheduleList[i].nextDay" + " is your next day to applay " + scheduleList[i].stuff + " for " + scheduleList[i].plant;
        
            displayForm.appendChild(scheduleNote);
        };

    });

  



// save info to Local Storage source: 
// https://www.youtube.com/watch?v=-ZRDZyUjEEI
// https://www.youtube.com/watch?v=U693xrQKFy4&list=LL&index=1&t=1389s

