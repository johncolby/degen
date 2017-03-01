// Function to generate completed report
function genReport() {
	var report = ""

	// Loop over levels
	$("#template-container").children().each(function(){
		var findings = []

		report += $(this).attr("id") + ": ";

		if(checkActive("FA", this)){
			findings.push(sevWrap("Facet arthrosis", "FA", this))
		}
		if(checkActive("LFH", this)){
			findings.push("Ligamentum flavum hypertrophy")
		}
		if(checkActive("Disk", this)){
			findings.push("Disk buldge")
		}
		report += findings.join(", ")
		report += "\n\n"
	});

	$("#output").val(report)
}

function checkActive(st, node) {
	return $("a:contains(%s)".replace(/%s/g, st), node).attr("class").search("active")>=0
}

function sevWrap(string, st, node) {
	var left 
	var right

	left = $("a:contains(%s)".replace(/%s/g, st), node).siblings().find("a:contains(L)").attr("class").search("active")>=0
	right = $("a:contains(%s)".replace(/%s/g, st), node).siblings().find("a:contains(R)").attr("class").search("active")>=0
	
	if(left && right) {
		string = "bilateral" + string
	} else if (left) {
		string = "left" + string
	} else if (right) {
		string = "right" + string
	}

	return string
}
////////////////////////////////////////////////////////////////////////////////

$(document).ready(function(){
	var levels = ["L1-2", "L2-3", "L3-4", "L4-5", "L5-S1"]

	// Import basic template
	var template = $("#level-template").html()

	// Attach templates to DOM
	for (var i = 0; i < levels.length; i++) {
		$("#template-container").append($("<div>", {id: levels[i], class: "clearFloat level"}).html(template));
	}

	// Attach submenus for severity and left/right
	$(".sev").parent().append($("<ul>", {class: "drop_menu"}).html("<li><a class=\"toggle lat\" href=\"#\">Mild</a></li><li><a class=\"toggle lat\" href=\"#\">Mod</a></li><li><a class=\"toggle lat\" href=\"#\">Sev</a></li>"));
	$(".lat").parent().append($("<ul>", {class: "drop_menu"}).html("<li><a class=\"toggle\" href=\"#\">L</a></li><li><a class=\"toggle\" href=\"#\">R</a></li>"));

	// Event for button clicks
	$("ul a.toggle").click(function() {
		$(this).siblings("ul").toggle();
		$(this).toggleClass("active");
		genReport()
	});
});