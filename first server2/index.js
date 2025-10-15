//import express
let express = require("express");
//create an app instance - calling express() returns an object
let app = express();

let movies = {
  "data": [
     { title: "Amélie", director: "Jean-Pierre Jeunet", year: 2001 },
  { title: "La Haine", director: "Mathieu Kassovitz", year: 1995 },
  { title: "The 400 Blows", director: "François Truffaut", year: 1959 },
  { title: "Blue Is the Warmest Colour", director: "Abdellatif Kechiche", year: 2013 },
  { title: "Portrait of a Lady on Fire", director: "Céline Sciamma", year: 2019 },
  { title: "The Intouchables", director: "Olivier Nakache & Éric Toledano", year: 2011 },
  { title: "Breathless", director: "Jean-Luc Godard", year: 1960 },
  { title: "A Prophet", director: "Jacques Audiard", year: 2009 },
  { title: "La Belle et la Bête", director: "Jean Cocteau", year: 1946 },
  { title: "Cléo from 5 to 7", director: "Agnès Varda", year: 1962 }
  ],
};

app.get('/', (request, response) => {
  console.log(request);
  response.send("Hello");
});

app.get('/about', (request, response) => {
  console.log(request);
  response.send("Hi");
});

app.get("/movies", (request, response) => {
  console.log("A request to the data route");
  console.log(request.path);
  response.json(movies);
});
app.get("/movies/:movie", (request, response) => {
  console.log(request.params.movie);
  let user_movie=request.params.movie;
  let user_obj;
  for(let i=0;i<movies.data.length;i++){
    if(user_movie==movies.data[i].title) {
        user_obj=movies.data[i];

    }
  }
  console.log(user_obj);
  if(user_obj){
    response.json(user_obj);
  } else{
    response.json({status: "info not present"});
  }
});

app.listen(8000, () => {
  console.log("app is listening at localhost:8000");
});