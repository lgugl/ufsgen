// Under Falling Skies Scenario Ramdomiser
// By Ric Berridge
// 3 Jun 2021
// Result of https://www.boardgamegeek.com/thread/2667105/mission-randomizer-ufs-exists
// (c) 2021 Ric Berridge

var e = document.getElementById("difficulty");
var difficulty = e.options[e.selectedIndex].value; // I think the max is 9. The html has been set to max 5, so we'll work with that.
if (difficulty > 5){
  difficulty = 5;
}

var sky = [0, 0, 0, 0]; //Sky pieces top to bottom.

var city = 0; //Must be present. There are 17 options, so this represents which city we're playing
var cityNames = ["Cairo", "Johannesburg", "London", "Rio de Janeiro", "Havanna", "Moscow", "Montreal", "New York", "Paris", "Washington, DC", "Roswell", "Mexico City", "Sydney", "Beijing", "Seoul", "Tokyo", "Singapore"];
var maxCity = cityNames.length;

var characters = 0; //Number of characters present. Max 12
var charactersNames = ["Wang Lin", "Iz'ox", "Jang Chanwook", "Archie Bell", "Pieter Bernstein", "Jaroslav Ruzicka", "Jackson Moss", "Lucia Ortego", "Clinton Harper", "Samantha Legrand", "Shanti Aumann", "Karima Almasi"];
var maxCharacters = charactersNames.length;

var scenario = 0; //Which scenario we're playing. 0 is no scenario, Max 13
var scenarioNames = ["No Scenario", "Kamikaze Ships", "Saboteur", "Contamination", "Storm", "The Final Battle", "Command Ship", "Repairing the Base", "Battle for the Sky", "Satellites", "Dangerous Research", "Evacuation", "Reinforcements", "Reactor Leak"]
var maxScenario = scenarioNames.length;

e = document.getElementById("threat");
var threat = e.options[e.selectedIndex].value; //Max 4
if (threat > 4){
  threat = 4;
}

e = document.getElementById("advancedSkies");
var advancedSkies = e.checked;

function load() {
  randomiseDifficulty();
}

function randomiseDifficulty(){
  e = document.getElementById("difficulty");
  difficulty = e.options[e.selectedIndex].value; //Extract the difficulty from the html drop down box.
  if (difficulty > 5){
    difficulty = 5;
  }
  e = document.getElementById("advancedSkies"); //Is the tick box for advanced skies checked?
  advancedSkies = e.checked;

  remainingDifficulty = +difficulty;
  //Picking a scenario
  //If difficulty == 1, 50% chance of scenario, if greater, 100% chance
  switch (remainingDifficulty) {
    case 0:
      scenario = 0; //No scenario
      break;
    case 1:
      var chance = Math.floor(Math.random() * 2); //50/50
      if(chance){
        scenario = Math.floor(Math.random() * (maxScenario -1) +1);
        remainingDifficulty --;
      }
      else {
        scenario = 0;
      }
      break;
    default: // All other cases give me scenario
      scenario = Math.floor(Math.random() * (maxScenario -1) +1);
      remainingDifficulty --;
  }
  var scenarioName = scenarioNames[scenario];
  document.getElementById("scenarioName").innerHTML = scenarioName;

  //Lets pick a city!
  city = Math.floor(Math.random() * maxCity);
  var cityName = cityNames[city];
  document.getElementById("cityName").innerHTML = cityName;

  //Lets pick some characters
  //First, reset the existing boxes
  document.getElementById("characterName1").innerHTML = "None";
  document.getElementById("characterName2").innerHTML = "None";
  document.getElementById("characterName3").innerHTML = "None";
  var e = document.getElementById("characterCount");
  var characterCount = e.options[e.selectedIndex].value;
  var remainingCharacters = parseInt(characterCount, 10);
  var chosenCharacters = [0, 0, 0];
  while (remainingCharacters) {
    var character = Math.floor(Math.random() * maxCharacters);
    var duplicateCharacter = false;
    for (i=0; i<3; i++) {
      if (chosenCharacters[i] == character) {
        duplicateCharacter = true;
      }
    }
    chosenCharacters[remainingCharacters-1] = character; //-1 because array indexing
    // 1 in 5 chance of being advanced version
    var advanced = Math.floor(Math.random() * 5); //0-4
    if (advanced == 4) {
      advanced = 1;
    } else {
      advanced = 0;
    }
    character = charactersNames[character];
    if (advanced && remainingDifficulty < 8) { //Here is an odd check. If we can't assign the difficulty later, fail to assign the advanced roll here.
      character = character + " (advanced)";
      remainingDifficulty ++;
    } else {
      character = character + " (basic)";
    }
    var position = "characterName" + remainingCharacters.toString();
    document.getElementById(position).innerHTML = character;
    if (!duplicateCharacter) {
      remainingCharacters --;
    }
  }

  //Finally the skies
  //We're going to ensure some randomness here by taking each point of remaining difficulty and assigning them singly to sky pieces until they've all gone. Then we'll randomise whether 1 is basic in hard mode or advanced in easy mode for each sky piece.
  sky = [0, 0, 0, 0]; //Reset
  while (remainingDifficulty) {
    var piece = Math.floor(Math.random() * 4); //0-3 because we're indexing from 0 here.
    var maxSky = 1; // 0-1 if not advanced, 0-2 if advanced is ticked
    if (advancedSkies) { maxSky ++; };
    if (sky[piece] !== maxSky){ //Check if piece is maxed out
      sky[piece] ++;
      remainingDifficulty --;
    }
  }
  for (i=0; i<4; i++){
    switch (sky[i]) {
      case 0:
        sky[i] = "Basic sky (easy side)";
        break;
      case 1: //need to pick basic hard or advanced easy
        chance = Math.floor(Math.random() * 2);
        if (chance && advancedSkies){ //Can only be hard if advanced is ticked
          sky[i] = "Basic sky (hard side)";
        } else {
          sky[i] = "Advanced sky (easy side)";
        }
        break;
      case 2:
        sky[i] = "Advanced sky (hard side)";
        break;
      default:
        sky[i] = "Code broken, consult dev";
    }
  }
  //Then print to screen. Yes, these are all out by one because the array indexes from 0 and the html from 1
  document.getElementById("sky1Text").innerHTML = sky[0];
  document.getElementById("sky2Text").innerHTML = sky[1];
  document.getElementById("sky3Text").innerHTML = sky[2];
  document.getElementById("sky4Text").innerHTML = sky[3];
};

function randomiseThreat(){
  e = document.getElementById("threat");
  threat = e.options[e.selectedIndex].value; //Extracting the threat from the html box.
  if (threat > 4){
    threat = 4;
  }
  e = document.getElementById("advancedSkies"); //Is the tick box for advanced skies checked?
  advancedSkies = e.checked;

  remainingThreat = +threat;
//  remainingDifficulty = 0; //This is resetting the variable and possibly redundant

  //Picking a scenario
  //If threat == 0, all scenarios (including None) are likely.
  switch (remainingThreat) {
    case 0:
      scenario = Math.floor(Math.random() * (maxScenario -1));
      break;
    default: // All other cases give me scenario
      scenario = Math.floor(Math.random() * (maxScenario -1) +1);
      remainingDifficulty --;
  }
  var scenarioName = scenarioNames[scenario];
  document.getElementById("scenarioName").innerHTML = scenarioName;

  //Lets pick a city!
  city = Math.floor(Math.random() * maxCity);
  var cityName = cityNames[city];
  document.getElementById("cityName").innerHTML = cityName;

  //Lets pick some characters
  //First, reset the existing boxes
  document.getElementById("characterName1").innerHTML = "None";
  document.getElementById("characterName2").innerHTML = "None";
  document.getElementById("characterName3").innerHTML = "None";
  var e = document.getElementById("characterCount");
  var characterCount = e.options[e.selectedIndex].value;
  var remainingCharacters = characterCount;
  var chosenCharacters = [0, 0, 0];
  while (remainingCharacters) {
    var character = Math.floor(Math.random() * maxCharacters);
    var duplicateCharacter = false;
    for (i=0; i<3; i++) {
      if (chosenCharacters[i] == character) {
        duplicateCharacter = true;
      }
    }
    chosenCharacters[remainingCharacters-1] = character; //-1 because array indexing
    // 1 in 5 chance of being advanced version
    var advanced = Math.floor(Math.random() * 5); //0-4
    if (advanced == 4) {
      advanced = 1;
    } else {
      advanced = 0;
    }
    character = charactersNames[character];
    if (advanced && remainingDifficulty < 8) { //Here is an odd check. If we can't assign the difficulty later, fail to assign the advanced roll here.
      character = character + " (advanced)";
    } else {
      character = character + " (basic)";
    }
    var position = "characterName" + remainingCharacters.toString();
    document.getElementById(position).innerHTML = character;
    if (!duplicateCharacter) {
      remainingCharacters --;
    }
  }

  //Finally the skies
  //This is the bit that works most different from Threat level. Threat is the number of hard side skies. So for each point of threat we're going to assign it to a sky, then 50/50 randomise the sky to advanced if the box is ticked.
  sky = [0, 0, 0, 0]; //Reset
  while (remainingThreat) {
    var piece = Math.floor(Math.random() * 4); //0-3 because we're indexing from 0 here.
    if (!sky[piece]) { //Only do any of this if the piece hasn't been picked already
      sky[piece] = 1;
      remainingThreat --;
    }
  }
  for (i=0; i<4; i++){
    switch (sky[i]) {
      case 0: //Easy sky
        if (advancedSkies) {
          var chance = Math.floor(Math.random() * 4); //25% chance of advanced
          if (chance > 1) { chance = 0; } // Maps 0->0, 1->1, 2->0, 3->0, leaving a 1 in 4 chance of a 1
          if (chance) {
            sky[i] = "Advanced sky (easy side)";
          }
          else {
            sky[i] = "Basic sky (easy side)";
          }
        }
        else {
          sky[i] = "Basic sky (easy side)";
        }
        break;
      case 1: //Hard sky
        if (advancedSkies) {
          var chance = Math.floor(Math.random() * 4); //25% chance of advanced
          if (chance > 1) { chance = 0; } // Maps 0->0, 1->1, 2->0, 3->0, leaving a 1 in 4 chance of a 1
          if (chance) {
            sky[i] = "Advanced sky (hard side)";
          }
          else {
            sky[i] = "Basic sky (hard side)";
          }
        }
        else {
          sky[i] = "Basic sky (hard side)";
        }
        break;
      default: //Should not happen!
        sky[i] = "Issue detected, contact Dev";
    }
  }
  //Then print to screen. Yes, these are all out by one because the array indexes from 0 and the html from 1
  document.getElementById("sky1Text").innerHTML = sky[0];
  document.getElementById("sky2Text").innerHTML = sky[1];
  document.getElementById("sky3Text").innerHTML = sky[2];
  document.getElementById("sky4Text").innerHTML = sky[3];
};