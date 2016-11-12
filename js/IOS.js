var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
var DefaultRawData = {
    Projects: {
        Values: [5000, 6000, 6000, 2000, 6000],
        Returns: [18, 14, 13, 10, 9]
    },
    vCompany: 12000,
    rCompany: [10, 13.25]
};
var DefaultData = MakeDataArray(DefaultRawData);
function FormatBox(type, id) {
    var CurrentValue = $('#' + id).val();
    var NewValue = parseFloat(CurrentValue.replace(/\s/g, ''));
    if (CurrentValue.length > 0 && isNaN(NewValue) === true) {
        $('#' + id).val('');
        $('#modal-label').text('Format');
        $('#modal-body').text('Ayoye, commence par écrire des chiffres...');
        $('#modal-button').text("J'ai compris!");
        $('#modalwindow').modal('show');
        return;
    }
    var ValueStr = String(NewValue);
    var SplitValue = ValueStr.split('.');
    var IntLength = SplitValue[0].length;
    var Decimals = parseFloat('0.' + SplitValue[1]);
    var Spaces = parseInt(IntLength / 3);
    var NumParts = [];
    for (var i = Spaces + 1; i > 0; i--) {
        StartLoc = IntLength - 3;
        NumParts[i] = SplitValue[0].substring(StartLoc, IntLength);
        IntLength = StartLoc;
    }
    var IntPart = NumParts.join(' ');
    var DecString = String(Decimals.toFixed(2));
    var DecPart = DecString.substring(2, 4);
    if (Decimals > 0) {
        var DispValue = IntPart + '.' + DecPart;
    } else {
        var DispValue = IntPart;
    }
    if (type === "d" && CurrentValue.length > 0) {
        $('#' + id).val(DispValue + " $");
    } else if (type === "p" && CurrentValue.length > 0) {
        if (parseInt(CurrentValue) >= 100) {
            $('#' + id).val('');
            $('#modal-label').text('Coût en capital');
            $('#modal-body').text('C\'est trop rentable bro!');
            $('#modal-button').text("J'ai compris!");
            $('#modalwindow').modal('show');

        } else {
            $('#' + id).val(DispValue + " %");
        }
    }
}
function AddLine() {
    var lastid = parseInt($('#ProjectsTable tr:last').data("projectid"));
    var newid = lastid + 1;
    if (newid >= 12) {
        $('#modal-label').text('Limite');
        $('#modal-body').text('Le nombre de projets est limité à 12. Sorry!');
        $('#modal-button').text("J'ai compris!");
        $('#modalwindow').modal('show');
    } else {
        $('#ProjectsTable tr:last').after('<tr data-projectid="' + newid + '"><td><span class="label label-default largetext">' + alphabet[newid] + '</span><td><div class="form-group chart-form"><input type="text" class="form-control investment textfield" id="I' + newid + '" onblur="FormatBox(\'d\',\'I' + newid + '\')" autocomplete="off"></div></td><td><div class="form-group chart-form"><input type="text" class="form-control return textfield" id="R' + newid + '" onblur="FormatBox(\'p\',\'R' + newid + '\')" autocomplete="off"></td></div><td><button class="btn btn-danger" onclick="RemoveLine()" id="remove' + newid + '"><span class="glyphicon glyphicon-trash" aria-hidden="true"></button></td></tr>');
        $('#remove' + lastid).hide();
    }
}
function RemoveLine() {
    var lastid = parseInt($('#ProjectsTable tr:last').data("projectid"));
    var newid = lastid - 1;
    $('#ProjectsTable tr:last').remove();
    $('#remove' + newid).show();
}
function DataForm() {
    var ProjectValue = document.getElementsByClassName("investment");
    var ProjectReturn = document.getElementsByClassName("return");
    var ProjectValues = [];
    var ProjectReturns = [];
    for (i = 0; i < ProjectValue.length; i++) {
        ProjectValues[i] = parseFloat(ProjectValue[i].value.replace(/\s/g, '')) / 1000;
        ProjectReturns[i] = parseFloat(ProjectReturn[i].value);
    }
    var CompanyMaxInvestment = parseFloat(document.getElementById("MI").value.replace(/\s/g, '')) / 1000;
    var CompanyCCArray = [parseFloat(document.getElementById("CC1").value), parseFloat(document.getElementById("CC2").value)];
    var NewData = {
        Projects: {
            Values: ProjectValues,
            Returns: ProjectReturns
        },
        vCompany: CompanyMaxInvestment,
        rCompany: CompanyCCArray
    };
    return NewData
}
function MakeDataArray(dataArray) {
    var projectdata = [];
    var nbProjects = dataArray["Projects"]["Values"].length;
    var cost = 0;
    for (var i = 0; i <= nbProjects - 1; i++) {
        projectdata.push({
            "datagroup": "Project" + i,
            "financing": cost,
            "kcost": dataArray["Projects"]["Returns"][i],
            "type": "project",
            "label": alphabet[i]
        });
        cost = cost + dataArray["Projects"]["Values"][i];
        projectdata.push({
            "datagroup": "Project" + i,
            "financing": cost,
            "kcost": dataArray["Projects"]["Returns"][i],
            "type": "interp",
            "label": alphabet[i]
        });
        if (i > 0) {
            projectdata.push({
                "datagroup": "Interval" + i,
                "financing": cost - dataArray["Projects"]["Values"][i],
                "kcost": dataArray["Projects"]["Returns"][i - 1],
                "type": "interp"
            }, {
                "datagroup": "Interval" + i,
                "financing": cost - dataArray["Projects"]["Values"][i],
                "kcost": dataArray["Projects"]["Returns"][i],
                "type": "interp"
            });
        }
    }
    projectdata.push({
        "datagroup": "WACC1",
        "financing": 0,
        "kcost": dataArray["rCompany"][0],
        "type": "wacc",
        "label": "\u03C1 = " + dataArray["rCompany"][0] + "%"
    }, {
        "datagroup": "WACC1",
        "financing": dataArray["vCompany"],
        "kcost": dataArray["rCompany"][0],
        "type": "wacc"
    }, {
        "datagroup": "WACC2",
        "financing": dataArray["vCompany"],
        "kcost": dataArray["rCompany"][1],
        "type": "wacc",
        "label": "\u03C1 = " + dataArray["rCompany"][1] + "%"
    }, {
        "datagroup": "WACC2",
        "financing": cost,
        "kcost": dataArray["rCompany"][1],
        "type": "wacc"
    }, {
        "datagroup": "IntervalW",
        "financing": dataArray["vCompany"],
        "kcost": dataArray["rCompany"][0],
        "type": "interw",
    }, {
        "datagroup": "IntervalW",
        "financing": dataArray["vCompany"],
        "kcost": dataArray["rCompany"][1],
        "type": "interw",
    });
    var PercentValues = dataArray["Projects"]["Returns"].concat(dataArray["rCompany"]);
    var ScaleValues = {
        xMaxValue: cost + 10,
        yMaxValue: Math.max.apply(Math, PercentValues) + 1,
        yMinValue: Math.min.apply(Math, PercentValues) - 1
    };
    DataArrayConcat = {
        ProjectData: projectdata,
        ScaleValues: ScaleValues
    };
    return DataArrayConcat
}
function MakeGraph(data) {
    var viswidth = document.getElementById("visualisationspace").offsetWidth;
    var visheight = 500;
    var dataGroup = d3.nest().key(function (d) {
        return d.datagroup;
    }).entries(data["ProjectData"]);
    var vis = d3.select("#visualisation")
        , WIDTH = viswidth
        , HEIGHT = visheight
        , MARGINS = {
        top: 50,
        right: 20,
        bottom: 50,
        left: 50
    }
        , xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([0, data["ScaleValues"]["xMaxValue"]])
        , yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([data["ScaleValues"]["yMinValue"], data["ScaleValues"]["yMaxValue"]])
        , xAxis = d3.svg.axis().scale(xScale).tickSize(2).tickFormat(d3.format("d"))
        , yAxis = d3.svg.axis().scale(yScale).tickSize(2).orient("left");
    vis.append("svg:g").attr("class", "x axis").attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")").call(xAxis);
    vis.append("svg:g").attr("class", "y axis").attr("transform", "translate(" + (MARGINS.left) + ",0)").call(yAxis);
    var lineGen = d3.svg.line().x(function (d) {
        return xScale(d.financing);
    }).y(function (d) {
        return yScale(d.kcost);
    }).interpolate("basis");
    dataGroup.forEach(function (d, i) {
        if (d.values["0"]["type"] === "project" || d.values["0"]["type"] === "wacc") {
            if (d.values["0"]["type"] === "wacc") {
                vis.append('svg:path').attr('d', lineGen(d.values)).attr('stroke', '#ff0039').attr('stroke-width', 2).attr('fill', 'none');
            } else {
                vis.append('svg:path').attr('d', lineGen(d.values)).attr('stroke', '#2780e3').attr('stroke-width', 2).attr('fill', 'none');
            }
            var firstposition = parseInt(lineGen(d.values).split(",")["0"].substring(1));
            var position = lineGen(d.values).split(",")["1"].split("L");
            position.forEach(function () {
                var vertical = parseInt(position["0"]);
                var horizontal = parseInt(position["1"]);
                vis.append('text').attr("x", ((horizontal + firstposition) / 2)).attr("y", vertical - 5).text(d.values["0"]["label"]);
            });
        } else if (d.values["0"]["type"] === "interp") {
            vis.append('svg:path').attr('d', lineGen(d.values)).attr('stroke', '#3fb618').style("stroke-dasharray", ("3, 3")).attr('stroke-width', 2).attr('fill', 'none');
        } else if (d.values["0"]["type"] === "interw") {
            vis.append('svg:path').attr('d', lineGen(d.values)).attr('stroke', '#ff0039').style("stroke-dasharray", ("7, 7")).attr('stroke-width', 2).attr('fill', 'none');
        }
     });
    vis.append('text').attr('x', viswidth / 2).attr('y', visheight - 5).style("font-weight", "bold").text('Coût (Milliers $)');
    vis.append('text').attr("transform", "rotate(-90)").attr('x', -visheight / 2).attr('y', 15).style("text-anchor", "middle").style("font-weight", "bold").text('Rendement espéré (%)');
}
function CheckForm() {
    var CheckedForm = true;
    for (var i = document.getElementsByClassName('textfield').length - 1; i >= 0; i--) {
        var id = document.getElementsByClassName('textfield')[i].id;
        $('#' + id).parent('div').removeClass('has-warning has-feedback');
        $('#' + id).parent('div').find('span[class="glyphicon glyphicon-warning-sign form-control-feedback"]').remove();
    }
    for (var i = document.getElementsByClassName('textfield').length - 1; i >= 0; i--) {
        if (document.getElementsByClassName('textfield')[i].value.length === 0) {
            var id = document.getElementsByClassName('textfield')[i].id;
            $('#' + id).parent('div').addClass('has-warning has-feedback');
            $('#' + id).parent('div').append('<span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true"></span>');
            var CheckedForm = false;
        }
    }
    return CheckedForm;
}
function UpdateGraph() {
    if (CheckForm() === true) {
        var NewData = MakeDataArray(DataForm());
        d3.select("svg").remove();
        $('#visualisationspace').append('<svg id="visualisation" width="100%" height="500"></svg>');
        MakeGraph(NewData);
    } else {
        $('#modal-label').text('Données');
        $('#modal-body').text('Check tes affaires! Il manque des infos!');
        $('#modal-button').text("J'ai compris!");
        $('#modalwindow').modal('show');
    }
}
function SaveGraph() {
    if (CheckForm() === true) {

        saveSvgAsPng(document.getElementById("visualisation"), "IOSChart.png");
    } else {
        $('#modal-label').text('Données');
        $('#modal-body').text('Check tes affaires! Il manque des infos!');
        $('#modal-button').text("J'ai compris!");
        $('#modalwindow').modal('show');
    }
}