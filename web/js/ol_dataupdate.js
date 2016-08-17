var boroname;
var pureCoverage = false;
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
}));
// if this is just a coverage or a group of them, disable a few items,
// and default to jpeg format
var format = 'image/png';
var bounds = [-74.31564, 40.48599,
    -73.66882, 40.92407];
if (pureCoverage) {
    document.getElementById('filterType').disabled = true;
    document.getElementById('filter').disabled = true;
    document.getElementById('antialiasSelector').disabled = true;
    document.getElementById('updateFilterButton').disabled = true;
    document.getElementById('resetFilterButton').disabled = true;
    document.getElementById('jpeg').selected = true;
    format = "image/jpeg";
}

var mousePositionControl = new ol.control.MousePosition({
    className: 'custom-mouse-position',
    target: document.getElementById('location'),
    coordinateFormat: ol.coordinate.createStringXY(5),
    undefinedHTML: '&nbsp;'
});
var untiled = new ol.layer.Image({
    OPACITY: 0.1,
    source: new ol.source.ImageWMS({
        ratio: 1,
        url: 'http://localhost:5000/geoserver/cite/wms',
        params: {'FORMAT': format,
            'VERSION': '1.1.1',
            STYLES: '',
            LAYERS: 'cite:nyc_census_blocks',
        }
    })
});
var tiled = new ol.layer.Tile({
    visible: false, OPACITY: 0.1,
    source: new ol.source.TileWMS({
        url: 'http://localhost:5000/geoserver/cite/wms',
        params: {'FORMAT': format,
            'VERSION': '1.1.1',
            tiled: true,
            STYLES: '',
            LAYERS: 'cite:nyc_census_blocks',
        }
    })
});

var projection = new ol.proj.Projection({
    code: 'EPSG:4326',
    units: 'degrees',
    axisOrientation: 'neu'
});
var map = new ol.Map({
    controls: ol.control.defaults({
        attribution: false
    }).extend([mousePositionControl]),
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.TileJSON({
                url: 'http://api.tiles.mapbox.com/v3/' +
                        'mapbox.natural-earth-hypso-bathy.json',
                crossOrigin: 'anonymous'
            })
        })
                ,
        untiled,
        tiled],
    view: new ol.View({
        projection: projection
    })
});

map.getView().on('change:resolution', function (evt) {
    var resolution = evt.target.get('resolution');
    var units = map.getView().getProjection().getUnits();
    var dpi = 25.4 / 0.28;
    var mpu = ol.proj.METERS_PER_UNIT[units];
    var scale = resolution * mpu * 39.37 * dpi;
    if (scale >= 9500 && scale <= 950000) {
        scale = Math.round(scale / 1000) + "K";
    } else if (scale >= 950000) {
        scale = Math.round(scale / 1000000) + "M";
    } else {
        scale = Math.round(scale);
    }
    document.getElementById('scale').innerHTML = "Scale = 1 : " + scale;
});

map.getView().fit(bounds, map.getSize());
//map.setCenter(new OpenLayers.LonLat(40.69, -74.0), 5);
map.on('singleclick', function (evt) {
    
    document.getElementById('nodelist').innerHTML = "Loading... please wait...";
    var view = map.getView();
    var viewResolution = view.getResolution();
    var source = untiled.get('visible') ? untiled.getSource() : tiled.getSource();
    var url = source.getGetFeatureInfoUrl(
            evt.coordinate, viewResolution, view.getProjection(),
            {'INFO_FORMAT': 'text/html', 'FEATURE_COUNT': 1});

    var htmlResponse = httpGet(url);
    //  alert(htmlResponse);
    var blkid = $(htmlResponse).find(".blkid").text();
    boroname = $(htmlResponse).find(".boroname").text();
    var total = $(htmlResponse).find(".total").text();
    var c_name = $(htmlResponse).find(".c_name").text();
    var c_present = $(htmlResponse).find(".c_present").text();

    
        
    //alert(blkid+" "+boroname+" "+total+" "+"crop"+c_name+"  "+ c_present);

    if (url) {
        document.getElementById('nodelist').innerHTML ="<form><table>" +
                "<tr><td>Parcel Id</td> <td><input type='text' id='blk_id'name='blk_id' value =" + blkid.toString() + " /> </td> </tr>" +
                "<tr><td>State Name:</td> <td><input type='text' id='boroname' name='boroname' value =" + boroname.toString() + " /></td> </tr>" +
                "<tr><td>Population:</td> <td><input type='text'id='population' name='population'  value =" + total.toString() + " /></td> </tr>" +
                "<tr><td>Crop Type:</td> <td><input type='text'id='c_name' name='c_name'  onchange='myFunc(this.value)' value =" + c_name.toString() + " /></td> </tr>" +
                 "<tr><td>Present?:</td> <td><select id='present'>" +
                                "<option onclick='doSomething(this);' value='Present' >Present</option>" +
                                "<option onclick='doSomething(this);' value='Not Present'>Not Present</option>" +
                                "</select> </td></tr>" +
               
                "<tr><td></td><td><input type='button' value='Save & Close' onclick='saveData()'/></td></tr></form>";
        if(c_name.toString() === "Not_Available")
        document.getElementById("present").value="Not Present";
    }           
});

function myFunc(y){
        document.getElementById("present").value="Not Present";
    //}
    //else{
        //document.getElementById("present").value="Present";
    //}
}

function doSomething(x)
{
   // alert("Call hua");
    var isPresent = document.getElementById('present').value;
    if(isPresent === "Not Present"){
       document.getElementById('c_name').value = 'Not_Available';
        
    }
}

function saveData()
{
    //var v = document.vinform.t1.value;
    var blk_id = document.getElementById('blk_id').value;
    var boroname = document.getElementById('boroname').value;
    var population = document.getElementById('population').value;
    var c_name = document.getElementById('c_name').value;
    var c_present = document.getElementById('present').value;
    //alert(blk_id + "%" + boroname + "%" + population);
    alert("Database Updated:");
    var url = "http://localhost:5000/web_Project/JspDemo.jsp?blk_id=" + blk_id + "&boroname=" + boroname + "&population=" + population+"&c_name="+c_name+"&c_present="+c_present;
    //var url = "JspDemo.jsp?new_val=" + new_name+"&old_val="+boroname;
    // alert(document.getElementById('address').value);
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }

    try {
        // request.onreadystatechange = getInfo;
        request.open("GET", url, true);
        request.send();
    } catch (e) {
        alert("name:" + e.name + "\nmessage:" + e.message);
    }
    //alert('Database Updated:');
}

function httpGet(theUrl)
{
    var xmlhttp = null;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    var s = null;
    xmlhttp.onreadystatechange = function ()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            s = xmlhttp.responseText;
            //alert(s);

        }
    }
    xmlhttp.open("GET", theUrl, false);
    xmlhttp.send();
    if (s != null)
        return s;
}

// sets the chosen WMS version
function setWMSVersion(wmsVersion) {
    map.getLayers().forEach(function (lyr) {
        lyr.getSource().updateParams({'VERSION': wmsVersion});
    });
}

// Tiling mode, can be 'tiled' or 'untiled'
function setTileMode(tilingMode) {
    if (tilingMode == 'tiled') {
        untiled.set('visible', false);
        tiled.set('visible', true);
    } else {
        tiled.set('visible', false);
        untiled.set('visible', true);
    }
}

function setAntialiasMode(mode) {
    map.getLayers().forEach(function (lyr) {
        lyr.getSource().updateParams({'FORMAT_OPTIONS': 'antialias:' + mode});
    });
}

// changes the current tile format
function setImageFormat(mime) {
    map.getLayers().forEach(function (lyr) {
        lyr.getSource().updateParams({'FORMAT': mime});
    });
}

function setStyle(style) {
    map.getLayers().forEach(function (lyr) {
        lyr.getSource().updateParams({'STYLES': style});
    });
}

function setWidth(size) {
    var mapDiv = document.getElementById('map');
    var wrapper = document.getElementById('wrapper');

    if (size == "auto") {
        // reset back to the default value
        mapDiv.style.width = null;
        wrapper.style.width = null;
    }
    else {
        mapDiv.style.width = size + "px";
        wrapper.style.width = size + "px";
    }
    // notify OL that we changed the size of the map div
    map.updateSize();
}

function setHeight(size) {
    var mapDiv = document.getElementById('map');
    if (size == "auto") {
        // reset back to the default value
        mapDiv.style.height = null;
    }
    else {
        mapDiv.style.height = size + "px";
    }
    // notify OL that we changed the size of the map div
    map.updateSize();
}

function updateFilter() {
    if (pureCoverage) {
        return;
    }
    var filterType = document.getElementById('filterType').value;
    var filter = document.getElementById('filter').value;
    // by default, reset all filters
    var filterParams = {
        'FILTER': null,
        'CQL_FILTER': null,
        'FEATUREID': null
    };
    if (filter.replace(/^\s\s*/, '').replace(/\s\s*$/, '') != "") {
        if (filterType == "cql") {
            filterParams["CQL_FILTER"] = filter;
        }
        if (filterType == "ogc") {
            filterParams["FILTER"] = filter;
        }
        if (filterType == "fid")
            filterParams["FEATUREID"] = filter;
    }
    // merge the new filter definitions
    map.getLayers().forEach(function (lyr) {
        lyr.getSource().updateParams(filterParams);
    });
}

function resetFilter() {
    if (pureCoverage) {
        return;
    }
    document.getElementById('filter').value = "";
    updateFilter();
}

// shows/hide the control panel
function toggleControlPanel() {
    var toolbar = document.getElementById("toolbar");
    if (toolbar.style.display == "none") {
        toolbar.style.display = "block";
    }
    else {
        toolbar.style.display = "none";
    }
    map.updateSize()
}
