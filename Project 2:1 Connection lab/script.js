// global variable 
let riddles;
window.addEventListener('load', () => {
    console.log('page is loaded');
    //load the json file
    fetch('riddles.json')
        .then(response => response.json())
        .then(data => {
            riddles = data.riddles; // make sure to fetch the riddles in the json
            console.log('Riddles loaded:', riddles);
        })
        .catch(err => console.error(err));
});

//Initialize  the map
mapboxgl.accessToken = 'pk.eyJ1IjoiamluZ3lpMTAxMyIsImEiOiJjbWhpbHJreDAwZTh5MmlvZHZhNm90anc2In0.YO3YGnq8Tl7NGO_XHC6s4w';
const map = new mapboxgl.Map({
    container: 'map',
    center: [-98, 38.88],
    zoom: 1,
    style: 'mapbox://styles/mapbox/standard',
    config: {
        'basemap': {
            'colorPlaceLabelHighlight': 'blue',
            'colorPlaceLabelSelect': 'red'
        }
    }
});

let selectedPlace;
let hoveredPlace;

const card = document.getElementById('properties');

// show the button after clicking the cities
const showCard = (feature) => {
    let cityName;
    if (feature.properties.name) {
        cityName = feature.properties.name;
    } else {
        cityName = 'Unknown City';
    }
    card.innerHTML = `
        <div class="map-overlay-inner">
            <h3>${cityName}</h3>
            <button id="chatBtn">Enter Chatroom</button>
            <button id="infoBtn">Here</button>
        </div>
    `;

    card.style.display = 'block';

    // click the buttons
    document.getElementById('chatBtn').onclick = () => alert(`Entering chatroom for ${cityName}`);
    document.getElementById('infoBtn').onclick = () => openRiddleDialog(cityName);
};
// open the riddle button
function openRiddleDialog(cityName) {
    const dialog = document.getElementById('riddle-dialog');
    const title = document.getElementById('riddle-title');
    const text = document.getElementById('riddle-text');
    const form = document.getElementById('riddle-form');
    const input = document.getElementById('riddle-answer');
    const cancelBtn = document.getElementById('riddle-cancel');

    let riddle;
    if (riddles[cityName]) {
        riddle = riddles[cityName];
    } else {
        riddle = {
            question: "No riddle available for this city yet!",
            answer: "none"
        };
    }


    // show the riddle
    title.textContent = `Riddle for ${cityName}`;
    text.textContent = riddle.question;
    input.value = "";

    // open the dialog
    dialog.showModal();

    // cancle button
    cancelBtn.onclick = () => dialog.close();

    // submit the answer
    form.onsubmit = (e) => {
        e.preventDefault();
        const userAnswer = input.value.trim();

        if (userAnswer.toLowerCase() === riddle.answer.toLowerCase()) {
            alert("Correct! 🎉 Redirecting...");
            dialog.close();
            window.location.href = "private_room.html"; // ✅ 跳转页面
        } else {
            alert("Incorrect! Try again.");
        }
    };
}

// Interaction
//click the button
map.addInteraction('place-click', {
    type: 'click',
    target: { featuresetId: 'place-labels', importId: 'basemap' },
    handler: ({ feature }) => {
        if (selectedPlace) {
            map.setFeatureState(selectedPlace, { select: false });
        }
        selectedPlace = feature;
        map.setFeatureState(feature, { select: true });
        showCard(feature);
    }
});

// hightlight when hovering the mouse
map.addInteraction('place-mouseenter', {
    type: 'mouseenter',
    target: { featuresetId: 'place-labels', importId: 'basemap' },
    handler: ({ feature }) => {
        if (hoveredPlace && hoveredPlace.id === feature.id) return;
        if (hoveredPlace) map.setFeatureState(hoveredPlace, { highlight: false });
        hoveredPlace = feature;
        map.setFeatureState(feature, { highlight: true });
        map.getCanvas().style.cursor = 'pointer';
    }
});

// remove the lightlight
map.addInteraction('place-mouseleave', {
    type: 'mouseleave',
    target: { featuresetId: 'place-labels', importId: 'basemap' },
    handler: () => {
        if (hoveredPlace) {
            map.setFeatureState(hoveredPlace, { highlight: false });
            hoveredPlace = null;
        }
        map.getCanvas().style.cursor = '';
        return false;
    }
});

// card diappear if click other places
map.addInteraction('map-click', {
    type: 'click',
    handler: () => {
        if (selectedPlace) {
            map.setFeatureState(selectedPlace, { select: false });
            selectedPlace = null;
        }
        card.style.display = 'none';
        return false;
    }
});
