// Function to generate completed report
function genReport() {
	var report = ""

	// Loop over levels
	$("#template-container").children().each(function(){
		var findings = []

		report += $(this).attr("id") + ": ";

		if(checkActive(getNode("FA", this))){
			findings.push(sevWrap("facet arthrosis", "FA", this))
		}
		if(checkActive(getNode("LFH", this))){
			findings.push(sevWrap("ligamentum flavum hypertrophy", "LFH", this))
		}
		if(checkActive(getNode("Disk", this))){
			findings.push("disk buldge")
		}
		report += findings.join(", ")
		report += "\n\n"
	});

	$("#output").val(report)
}

function getNode(st, node) {
	return $("a:contains(%s)".replace(/%s/g, st), node)
}

function checkActive(node) {
	return node.attr("class").search("active")>=0
}

function sevWrap(string, st, node) {
	var left 
	var right
	var sevs = []

	var sevNodes = getNode(st, node).siblings(".sev").children().children("a")
	sevNodes.each(function() {
		if(checkActive($(this))) {
			var lat
			var lats = $(this).siblings(".lat").find("a.active")
			if(lats.length == 0 || lats == undefined) {
				lat = ""
			} else if(lats.length > 1) {
				lat = " bilateral"
			} else {
				lat = " " + lats.attr("data-title")
			}
			sevs.push({severity: $(this).attr("data-title"), laterality: lat})
		}
	})

	var tmp = ''
	for(var i = 0; i < sevs.length; i++) {
		if(i>0) {tmp += " and "}
		tmp += sevs[i].severity + sevs[i].laterality
		if(i==sevs.length-1) {tmp += " "}
	}
	string = tmp + string

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
	$(".sev-parent").parent().append($("#sev-template").html());
	$(".lat-parent").parent().append($("#lat-template").html());

	// Event for button clicks
	$("ul a.toggle").click(function() {
		$(this).siblings("ul").toggle();
		$(this).toggleClass("active");
		genReport()
	});
});