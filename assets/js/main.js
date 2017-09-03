//Initialize Firebase
var config = {
    apiKey: "AIzaSyCE2tC970vBPaywoi9AKGU0dEAtIW6ZxzA",
    authDomain: "project-2-eb88a.firebaseapp.com",
    databaseURL: "https://project-2-eb88a.firebaseio.com",
    projectId: "project-2-eb88a",
    storageBucket: "project-2-eb88a.appspot.com",
    messagingSenderId: "330773569037"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // User input
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrain = moment($("#first-train-input").val().trim(), "hh:mm").format("hh:mm");
  var frequency = $("#frequency-input").val().trim();
  $("#new-train-message").html(`New train for ${destination} added`);

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrain);
  console.log(newTrain.frequency);

  // Alert
  //alert("New Train Added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
  window.location.href = "#top";
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry

function loadData() {
  var count = 0;
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  //console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var firstTrain = childSnapshot.val().firstTrain;
  var frequency = childSnapshot.val().frequency;

// Train Info
// console.log(trainName);
// console.log(destination);
// console.log(firstTrain);
// console.log(frequency);

//First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  //console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = currentTime.diff(moment(firstTimeConverted), "minutes");
  //console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % frequency;
  //console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = frequency - tRemainder;
  //console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = currentTime.add(tMinutesTillTrain, "minutes");
  //console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  var nextTrainFormatted = moment(nextTrain).format("hh:mm");

  // Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
    frequency + "</td><td>" + nextTrainFormatted + "</td><td>" + tMinutesTillTrain + "</td></tr>");
  });
}
loadData();
setTimeout(() => {
  $("#train-table > tbody").html("");
  loadData();
}, 60000); 