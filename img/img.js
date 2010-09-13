$(function(){
	$("#source").hide();
	$("#imgs > div").live("click", function(){
		$("#source").show().text($(this).html());
	});
});

function add(fn){
	fn($("<div>").appendTo("#imgs")[0]);
}

add(function(cont){
	var paper = Raphael(cont, 100, 100);
	paper
		.rect(0, 0, 100, 100, 20)
		.attr({
			fill : "90-#333-#666",
			stroke : null
		});
	paper
		.path([
			"M50,15",
			"L40,40 L15,45 L35,60 L25,85",
			"L50,70",
			"L75,85 L65,60 L85,45 L60 40",
			"z"
		].join(""))
		.attr({
			fill : "#fff",
			stroke : null
		})
		.scale(0.9, 0.9);
});
