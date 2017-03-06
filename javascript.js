// Function to generate completed report
function genReport() {
	var report = ""

	// Loop over levels
	$("#template-container").children().each(function(){
		// Findings
		var findings = []

		report += $(this).attr("id") + ": ";

		var diskStr = ""
		if(checkActive(getNode("Disk", this))){
			if(checkActive(getNode("Bulge", this))){
				var bulgeNodes = getNode("Bulge", this).siblings().children().children("a.active")
				bulgeNodes.each(function() {
					var lat = checkLat($(this))
					diskStr += $(this).text() + lat + " "
				})
				diskStr += "disk bulge"
			}
			if(checkActive(getNode("Herniation", this))){
				var hernNode = getNode("Herniation", this).siblings().children().children("a.active")
				var hernType = hernNode.text()
				hernNode = hernNode.siblings().children().children("a.active")
				var lat = checkLat(hernNode)
				diskStr += hernNode.text().toLowerCase() + lat + " disk " + hernType.toLowerCase()
			}
			findings.push(diskStr)
		}
		if(checkActive(getNode("LFH", this))){
			findings.push(sevWrap(getNode("LFH", this)))
		}
		if(checkActive(getNode("FA", this))){
			findings.push(sevWrap(getNode("FA", this)))
		}

		// Findings formatting
		if(findings.length > 0) {
			findings[0] = findings[0].charAt(0).toUpperCase() + findings[0].slice(1)
		}
		if(findings.length > 1) {
			findings[findings.length-1] = "and " + findings[findings.length-1]
		}
		report += findings.join(", ")

		// Results
		if(findings.length > 0) {
			var results = []
			var resultNodes = $("#results", this).children().children().children("a")
			resultNodes.each(function() {
				if(checkActive($(this))) {
					results.push(sevWrap($(this)) + " narrowing")
				}
			})

			// Results formatting
			if(results.length > 1) {
				results[results.length-1] = "and " + results[results.length-1]
			}
			if(results.length > 0) {
				report += ", resulting in "
				report += results.join(", ")
			} else {
				report += ", without significant canal or foraminal narrowing"
			}

			report += "."
		} else {
			report += "No significant canal or foraminal narrowing."
		}

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

function sevWrap(node) {
	var left 
	var right
	var sevs = []

	// Loop over severity levels
	var sevNodes = node.siblings(".sev").children().children("a")
	sevNodes.each(function() {
		if(checkActive($(this))) {
			lat = checkLat($(this))
			sevs.push({severity: $(this).attr("data-title"), laterality: lat})
		}
	})

	// Wrap findings in severity and laterality info
	var tmp = ''
	for(var i = 0; i < sevs.length; i++) {
		if(i > 0) { tmp += " and " }
		tmp += sevs[i].severity + sevs[i].laterality
		if(i == sevs.length - 1) { tmp += " " }
	}
	
	return tmp + node.attr("data-title")
}

function checkLat(node) {
	var lat
	var lats = node.siblings(".lat").find("a.active")
	if(lats.length == 0 || lats == undefined) {
		lat = ""
	} else if(lats.length > 1) {
		lat = " bilateral"
	} else {
		lat = " " + lats.attr("data-title")
	}
	return lat
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

	//Dropdown menu config
    $("ul.dropdown li").hover(function(){
        $(this).addClass("hover");
        $('ul:first',this).css('visibility', 'visible');
    }, function(){
        $(this).removeClass("hover");
        $('ul:first',this).css('visibility', 'hidden');
    });
    //$("ul.dropdown li ul li:has(ul)").find("a:first").append(" &raquo; ");

	// Generate blank report
	genReport()

	// Event for button clicks
	$("ul a.toggle").click(function() {
		$(this).toggleClass("active");
		genReport()
	});
});