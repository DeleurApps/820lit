var database = firebase.database();
var settings;


$("#test").click(function() {
	firebase.database().ref("/").once('value').then(function(snapshot) {
		settings = snapshot.val();
	});
	console.log("fuck");
});
var r = $('#redSlider').slider()
	.on("slide", function(num) {
		var value = num.value;
		firebase.database().ref("/").update({
			R: value
		});
	});

var g = $('#greenSlider').slider()
	.on("slide", function(num) {
		var value = num.value;
		firebase.database().ref("/").update({
			G: value
		});
	});
var b = $('#blueSlider').slider()
	.on("slide", function(num) {
		var value = num.value;
		firebase.database().ref("/").update({
			B: value
		});
	});
  var w = $('#whiteSlider').slider()
  	.on("slide", function(num) {
  		var value = num.value;
  		firebase.database().ref("/").update({
  			W: value
  		});
  	});


var bright = $('#brightSlider').slider()
	.on("slide", function(num) {
		var value = num.value;
		firebase.database().ref("/").update({
			brightness: value
		});
	});
