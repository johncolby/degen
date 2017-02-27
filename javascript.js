// Function to generate completed report
function genReport() {
	var report = ""

	// Loop over levels
	$("#template-container").children().each(function(){
		report += $(this).attr("id") + ": ";

		if($("a:contains(FA)", this).attr("class").search('active')>=0){
			report +="Facet arthrosis"
		}
		if($("a:contains(LFH)", this).attr("class").search('active')>=0){
			report +="Ligamentum flavum hypertrophy"
		}
		report +="\n\n"
	});

	$("#output").val(report)
}
////////////////////////////////////////////////////////////////////////////////

$(document).ready(function(){
	var levels = ["L1-2", "L2-3", "L3-4", "L4-5", "L5-S1"]

	// Generate template
	for (var i = 0; i < levels.length; i++) {
		var template = $("#level-template").html()
		$("#template-container").append($("<div>", {id: levels[i], class: "clearFloat level"}).html(template));
	}

	// Event for button clicks
	$("ul a.toggle").click(function() {
		$(this).siblings("ul").toggle();
		$(this).toggleClass("active");
		genReport()
	});
});