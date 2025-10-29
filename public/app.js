window.addEventListener('load', () => {

    console.log('page is loaded');

    //Load the json data file
    fetch('quiz.json')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            questions = data.questions;
            options = data.options;
            results = data.results;
            //Do something with 'data'

            showQuestions();

        })
        .catch(error => {
            console.log("Error!!! : " + error);
        })
})



// Data arrays
let questions;
let options;
let results;

// Counters
let totalScore = 0;
let currentQ = 0;

//get the element
const questionsDiv = document.getElementById("questions");
const optionsDiv = document.getElementById("answers");
const resultsDiv = document.getElementById("resultsDiv");



//show the questions
function showQuestions() {
    console.log("questions: " + questions);
    if (currentQ >= questions.length) {
        showresult();
        hide();
        return

    }

    // Send Questions and Options to HTML
    questionsDiv.innerHTML =
        questions[currentQ];


    optionsDiv.innerHTML = `
  <button id="option1">${options[0].text}</button>
  <button id="option2">${options[1].text}</button>
  <button id="option3">${options[2].text}</button>
  <button id="option4">${options[3].text}</button>
`;
    let button1 = document.getElementById("option1");
    let button2 = document.getElementById("option2");
    let button3 = document.getElementById("option3");
    let button4 = document.getElementById("option4");


    button1.addEventListener("click", function () {
        totalScore += 0;
        console.log(totalScore);

        currentQ++;
        showQuestions();
    });
    button2.addEventListener("click", function () {
        totalScore += 50;
        console.log(totalScore);

        currentQ++;
        showQuestions();
    });
    button3.addEventListener("click", function () {
        totalScore += 100;
        console.log(totalScore);

        currentQ++;
        showQuestions();
    });
    button4.addEventListener("click", function () {
        totalScore += 150;
        console.log(totalScore);

        currentQ++;
        showQuestions();
    });
};

function setup() {
    createCanvas(windowWidth, windowHeight);
    clear();  // make it fully transparent
}


function draw() {
    clear();  // make it fully transparent

    // Balloon body
    noStroke();
    fill(255, 100, 100); // main balloon color
    let balloonX = windowWidth / 2 + 10;
    let balloonY = windowHeight / 2 - 20;
    let balloonW = totalScore + 50;
    let balloonH = totalScore + 70;
    ellipse(balloonX, balloonY, balloonW, balloonH);

    // Tie/knot
    fill(255, 100, 100);
    let triWidth = 10;  // 三角形底宽
    let triHeight = 10; // 三角形高
    let topX = balloonX;
    let topY = balloonY + balloonH / 2 + triHeight; // 原尖端现在在椭圆底部下方
    let leftX = topX - triWidth / 2;
    let leftY = topY - triHeight;
    let rightX = topX + triWidth / 2;
    let rightY = topY - triHeight;

    triangle(topX, topY, leftX, leftY, rightX, rightY);
}

function showresult() {
    console.log("results");

    // 找到符合 totalScore 的结果
    let result = results.find(r => totalScore >= r["min-score"] && totalScore <= r["max-score"]);

    if (result) {
        resultsDiv.innerHTML = `
            <h2>${result["prank-type"]}</h2>
            <p>${result.description}</p>
        `;

        //Create an event listener to collect and POST data
        let prankButton = document.getElementById('submit');
        prankButton.addEventListener('click', () => {
            console.log("Button was clicked!");

            let nameInput = document.getElementById('name-input');
            let currentName = nameInput.value;

            let prankInput = document.getElementById('prank-input');
            // let currentPrank = prankInput.value;

            //make a javascript object that has the data I want to save 
            let prankObj = {
                name: currentName,
                pranktype: result["prank-type"]
            };
            console.log(prankObj);

            //stringify the object
            let prankObjJSON = JSON.stringify(prankObj);
            console.log(prankObjJSON);

            //send object to server--collect the data
            fetch('/pranktype', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: prankObjJSON
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Did this work?");
                    console.log(data);
                })
            document.getElementById('archive').addEventListener('click', () => {
               
                    //show the users' infor
                    fetch('/get')
                        .then(res => res.json())
                        .then(data => {
                            console.log(data.data);
                            for (let i = 0; i < data.data.length; i++) {
                                // let string = data.data[i].date + ":" + data.data.infor;
                                let string = data.data[i].currentDate + ": " + data.data[i].name + " - " + data.data[i].pranktype;
                                // let string = data.data[i].Archive;
                                let ele = document.createElement('p');
                                ele.innerHTML = string;
                                document.getElementById('information').appendChild(ele);
                            }
                     });
            });
        });

    } else {
        resultsDiv.innerHTML = `<p>No result found for your score.</p>`;

    }
    function showFeed(data) {
        let feed = document.getElementById('feed');
        feed.innerHTML = ""; // 清空旧内容
        for (let i = 0; i < data.length; i++) {
            let currentName = data[i].name;
            let currentMessage = data[i].message;

            let currentEl = document.createElement('p');
            currentEl.innerHTML = currentName + " - " + currentMessage;
            feed.appendChild(currentEl);
        }
    }
}

function hide() {
    // 使用 currentQ 和 questions.length 判断，不使用未定义的变量
    if (questions && currentQ >= questions.length) {
        console.log("hide questions and answers");
        if (questionsDiv) questionsDiv.style.display = "none";
        if (optionsDiv) optionsDiv.style.display = "none";
    }
}




