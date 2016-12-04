var config = {
    apiKey: "AIzaSyAL8wfTabm_4ZkuzcHEhpQjq0rB6BMqYl0",
    authDomain: "traintime-39f34.firebaseapp.com",
    databaseURL: "https://traintime-39f34.firebaseio.com",
    storageBucket: "traintime-39f34.appspot.com",
    messagingSenderId: "856525256848"
  };
  firebase.initializeApp(config);

var database = firebase.database();

$("#add").on("click", function() {
	var Name = $('#Name').val().trim();
	var Destination = $('#destination').val().trim();
	var First = moment($('#First').val().trim(), "HH:mm").format("X");
	var Frequency = $('#frequency').val().trim();

	console.log(Name);
	console.log(Destination);
	console.log(First);
	console.log(Frequency);
	console.log('button clicked');

	if (Name != "" && Destination != "" && First != "" && Frequency != ""){
		database.ref().push({
			name: Name,
			dest: Destination,
			first: First,
			freq: Frequency,
		});
		alert("Train successfully added!");
	} else { 
		alert("Please complete each missing field.");
	};
	$('#Name').val("");
	$('#destination').val("");
	$('#First').val("");
	$('#frequency').val("");

	return false;
});

database.ref().on("child_added", function(snapshot) {

	var Name = snapshot.val().name;
	var Destination = snapshot.val().dest;
	var trainFirst = snapshot.val().first;
	var trainFrequency = snapshot.val().freq;
	var currentTime = moment();
	var currentTimeConverted = moment(currentTime).format("X");	
	var firstTimePushed = moment(trainFirst,"X").subtract(1, "days");	
	var diffTime = moment(currentTimeConverted, "X").diff(moment(firstTimePushed, "X"), "minutes");	
	var trainRem = diffTime % trainFrequency;	
	var trainWait = trainFrequency - trainRem;
	var nextTrain = moment().add(trainWait, "minutes");	
	if (currentTimeConverted > trainFirst) {
		$("#table > tbody").append("<tr><td>" + Name + "</td><td>" 
			+ Destination + "</td><td>" 
			+ trainFrequency + "</td><td>"
			+ moment(nextTrain).format("hh:mm A") + "</td><td>"
			+ trainWait + "</td></tr>");
	} else {

		$("#table > tbody").append("<tr><td>" + Name + "</td><td>" 
			+ Destination + "</td><td>" 
			+ trainFrequency + "</td><td>"
			+ moment(trainFirst, "X").format("hh:mm A") + "</td><td>"
			+ trainWait + "</td></tr>");
	}
}, function(errorObject){

	console.log("Errors handled: " + errorObject.code)
})