function genTemplate(levels) {
    // Import basic template
    var template = $("#level-template").html()

    // Attach templates to DOM
    var tmp = []
    for (var i = 0; i < levels.length; i++) {
        tmp.push($("<div>", {id: levels[i], class: "clearFloat level"}).html(template))
    }
    $("#template-container").html(tmp)

    // Attach submenus for severity and left/right
    $(".sev-parent").parent().append($("#sev-template").html())
    $(".lat-parent").parent().append($("#lat-template").html())

    // Generate blank report
    genReport()
}

// Function to generate completed report
function genReport() {
    var report = ""

    // Loop over levels
    $("#template-container").children().each(function(){
        // Findings
        var findings = []

        report += $(this).attr("id") + ": ";

        var diskStr = ""
        if(checkActive(getNode("Disk", this))) {
            if(checkActive(getNode("Bulge", this))) {
                var bulgeNodes = getNode("Bulge", this).siblings().children().children("a.active")
                bulgeNodes.each(function() {
                    var lat = checkLat($(this))
                    if(lat.length > 1) {lat = " " + lat}
                    diskStr += $(this).text() + lat + " "
                })
                diskStr += "disk bulge"
            }
            if(checkActive(getNode("DOC", this))) {
                var lat = checkLat(getNode("DOC", this))
                if(lat.length > 0) {lat = lat + "ward "}
                    diskStr += lat + "disk osteophyte complex"
            }
            if(checkActive(getNode("Herniation", this))) {
                var hernNode = getNode("Herniation", this).siblings().children().children("a.active")
                var hernType = hernNode.text()
                hernNode = hernNode.siblings().children().children("a.active")
                var lat = checkLat(hernNode)
                if(lat.length > 0) {lat = lat + " "}
                if(diskStr.length > 1) { diskStr += " with superimposed " }
                diskStr += lat + hernNode.text().toLowerCase() + " disk " + hernType.toLowerCase()
            }
            if(checkActive(getNode("Fissure", this))) {
                if(diskStr.length > 1) { diskStr += " and " }
                diskStr += getNode("Fissure", this).attr("data-title")
            }
            findings.push(diskStr)
        }
        if(checkActive(getNode("UVH", this))){
            findings.push(sevWrap(getNode("UVH", this)))
        }
        if(checkActive(getNode("LFH", this))){
            findings.push(sevWrap(getNode("LFH", this)))
        }
        var facetStr = ""
        if(checkActive(getNode("Facet", this))){
            if(checkActive(getNode("Arthrosis", this))){
                facetStr += sevWrap(getNode("Arthrosis", this))
            }
            if(checkActive(getNode("Synovitis", this))){
                var lat = ""
                var synStr = ""
                lat = checkLat(getNode("Synovitis", this))
                if(lat.length > 1) { lat = lat + " "}

                if(facetStr.length > 1) { facetStr += " with " }
                synStr += lat
                if(facetStr.length == 0) { synStr += "facet " }
                facetStr += synStr + "synovitis"
            }
            findings.push(facetStr)
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
            
            // Canal, lateral recess, foraminal narrowing
            resultNodes.slice(0, 3).each(function() {
                if(checkActive($(this))) {
                    results.push(sevWrap($(this)) + " narrowing")
                }
            })

            // Extras
            resultNodes.slice(3).siblings().children().children("a").each(function() {
                if(checkActive($(this))) {
                    results.push(sevWrap($(this)))
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
    var tmp = ''

    // Loop over severity levels
    var sevNodes = node.siblings(".sev").children().children("a")
    if(sevNodes.length > 0) {
        sevNodes.each(function() {
            if(checkActive($(this))) {
                lat = checkLat($(this))
                if(lat.length > 1) { lat = " " + lat}
                sevs.push({severity: $(this).attr("data-title"), laterality: lat})
            }
        })

        sevs.sort(sortLat)

        // Wrap findings in severity and laterality info
        for(var i = 0; i < sevs.length; i++) {
            if(i > 0) { tmp += " and " }
            tmp += sevs[i].severity + sevs[i].laterality
            if(i == sevs.length - 1) { tmp += " " }
        }
    } else {
        tmp += checkLat(node)
        if(tmp.length > 0) { tmp = tmp + " "}
    }
    
    return tmp + node.attr("data-title")
}

function checkLat(node) {
    var lat
    var lats = node.siblings(".lat").find("a.active")
    if(lats.length == 0 || lats == undefined) {
        lat = ""
    } else if(lats.length > 1) {
        lat = "bilateral"
    } else {
        lat = lats.attr("data-title")
    }
    return lat
}

function sortLat(a,b) {
  if (a.laterality < b.laterality)
    return -1;
  if (a.laterality > b.laterality)
    return 1;
  return 0;
}

function attachEvents() {
    //Events for dropdown menu
    $("ul.dropdown li").hover(function(){
        $(this).addClass("hover")
        $('ul:first',this).css('visibility', 'visible')
    }, function(){
        $(this).removeClass("hover")
        $('ul:first',this).css('visibility', 'hidden')
    });

    // Event for button clicks
    $("ul a.toggle").click(function() {
        $(this).toggleClass("active")
        if(checkActive($(this))) {
            $(this).parentsUntil(".dropdown").siblings("a").addClass("active")
        }
        genReport()
    });
}

////////////////////////////////////////////////////////////////////////////////

$(document).ready(function(){
    // Event for choosing C or L spine
    $(".report-type").click(function() {
        if($(this).text() == "C-Spine") {
            levels = ["C2-3", "C3-4", "C4-5", "C5-6", "C6-7", "C7-T1"]
            genTemplate(levels)
            $("a.toggle.cspine").show()
            $("a.toggle.lspine").hide()
        } else if($(this).text() == "L-Spine") {
            levels = ["L1-2", "L2-3", "L3-4", "L4-5", "L5-S1"]
            genTemplate(levels)
            $("a.toggle.cspine").hide()
            $("a.toggle.lspine").show()
        }
        genReport()
        attachEvents()
    })

    $(".report-type:contains(L-Spine)").trigger('click')
});