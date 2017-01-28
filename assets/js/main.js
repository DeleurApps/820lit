var database = firebase.database();
var settings;


$("#test").click(function() {
	firebase.database().ref("/").once('value').then(function(snapshot) {
		settings = snapshot.val();
	});
  console.log("fuck");
});
