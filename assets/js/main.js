var database = firebase.database();
var settings;


$("#test").click(function() {
	firebase.database().ref("/").once('value').then(function(snapshot) {
		settings = snapshot.val();
	});
	console.log("fuck");
});
$('#redSlider').slider()
	.on("slide", function(num) {
		var value = num.value;
		firebase.database().ref("/").update({
			R: value
		});
	});

$('#brightSlider').slider()
	.on("slide", function(num) {
		var value = num.value;
		firebase.database().ref("/").update({
			brightness: value
		});
	});
