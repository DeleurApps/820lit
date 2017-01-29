var database = firebase.database();

database.ref("/").on('value', function(snapshot){
  var val = snapshot.val();
  console.log(val);
  g.slider('setValue',val.G);
  b.slider('setValue',val.B);
  r.slider('setValue',val.R);
  w.slider('setValue',val.W);
  bright.slider('setValue',val.brightness);
  cutoff.slider('setValue',val.cutoff);
  cycle.slider('setValue',val.cycleSpeed);
  fade.slider('setValue',val.fade);
  dim.bootstrapToggle(val.dimcenter ? 'on' : 'off');
  edge.bootstrapToggle(val.brightedges ? 'on' : 'off');
});

var setData = function(obj) {
	return database.ref("/").update(obj);
};
$("input[name=pattern]").change(function(v){
  console.log(this.value);
  setData({PatternID: parseInt(this.value)});
  console.log("val");
});

$("input[name=display]").change(function(v){
  console.log(this.value);
  setData({DisplayID: parseInt(this.value)});
  console.log("val");
});

var dim = $('#dimCenter').change(function() {
	setData({
		dimcenter: $(this).prop('checked') ? 1 : 0
	});
	console.log($(this).prop('checked'));
});
var edge = $('#brightEdges').change(function() {
	setData({
		brightedges: $(this).prop('checked') ? 1 : 0
	});
	console.log($(this).prop('checked'));
});

var r = $('#redSlider').slider()
	.on("slide", function(num) {
		var value = num.value;
		console.log(value);
		setData({
			R: value
		});
	});

var g = $('#greenSlider').slider()
	.on("slide", function(num) {
		var value = num.value;
		console.log(value);
		setData({
			G: value
		});
	});
var b = $('#blueSlider').slider()
	.on("slide", function(num) {
		var value = num.value;
		console.log(value);
		setData({
			B: value
		});
	});
var w = $('#whiteSlider').slider()
	.on("slide", function(num) {
		var value = num.value;
		console.log(value);
		setData({
			W: value
		});
	});


var bright = $('#brightSlider').slider()
	.on("slide", function(num) {
		var value = num.value;
		console.log(value);
		setData({
			brightness: value
		});
	});

var cutoff = $('#cutoffSlider').slider({
		precision: 2,
		step: 0.1,
		min: 0,
		max: 1
	})
	.on("slide", function(num) {
		var value = num.value;
		setData({
			cutoff: value
		});
	});

var cycle = $('#cycleSlider').slider()
	.on("slide", function(num) {
		var value = num.value;
		setData({
			cycleSpeed: value
		});
	});

var fade = $('#fadeSlider').slider({
		precision: 2,
		step: 0.1,
		min: 0,
		max: 1
	})
	.on("slide", function(num) {
		var value = num.value;
		setData({
			fade: value
		});
	});
