$(function() {

  var osm = new L.TileLayer('http://a.tiles.mapbox.com/v3/borzechowski.gcj2gonc/{z}/{x}/{y}.png');

    // Initiating the Leaflet map
    var theZoom = 11;
    41.7974395,-72.6692748
    var theCenter = new L.LatLng(41.7574395,-72.6392748);
    if (jQuery(".interactiveContainer").width() < 400) {
      theZoom = 10;
    }
    var map = new L.Map('map', {
      center: theCenter, 
      zoom: theZoom,
      scrollWheelZoom: false,
      layers: [osm]
    });
    var sColor = ["#1F8BFF", "#FA00F2" ,"#FF0000"];

    var grouped = {
      "y1990": L.layerGroup([]),
      "y1995": L.layerGroup([]),
      "y2000": L.layerGroup([]),
      "y2005": L.layerGroup([]),
      "y2010": L.layerGroup([]),
      "y2013": L.layerGroup([])
    }

    function makeCircle(latitude, longitude, name, totalAmount,rating,cat,minority) {
      name = name.split("'").join("");
      var theOp = (100-rating)/50;
      var theColor = getColor(minority);
      var theSize = totalAmount/30;
      if (theSize < 5) {
        theSize = 5;
      } 
      var circle = L.circleMarker([latitude, longitude], { 
        fillColor: theColor,
        fillOpacity: 0.7,
        stroke: true,
        color: "#000",
        weight: 2
      }).bindPopup(name).setRadius(theSize);
      grouped[cat].addLayer(circle);
    }

    var y90 = _.chain(theJson)
    .filter(function(value) {
      return value.Year == 1990;
    })
    .value();

    var y95 = _.chain(theJson)
    .filter(function(value) {
      return value.Year == 1995;
    })
    .value();

    var y00 = _.chain(theJson)
    .filter(function(value) {
      return value.Year == 2000;
    })
    .value();

    var y05 = _.chain(theJson)
    .filter(function(value) {
      return value.Year == 2005;
    })
    .value();

    var y10 = _.chain(theJson)
    .filter(function(value) {
      return value.Year == 2010;
    })
    .value();

    var y13 = _.chain(theJson)
    .filter(function(value) {
      return value.Year == 2013;
    })
    .value();

    makeLayer(y90,"y1990");
    makeLayer(y95,"y1995");
    makeLayer(y00,"y2000");
    makeLayer(y05,"y2005");
    makeLayer(y10,"y2010");
    makeLayer(y13,"y2013");

    function makeLayer(data,cat) {
      for (i = 0; i < data.length; i++) {
        makeCircle(data[i].lat, data[i].lng, "<div class='desc'>" + data[i]["School name/Year"]  + "</div><div class='carrying'>Total enrollment: " + checkNullNum(data[i].Total) + "</div><div class='carrying'>White Pct: " + checkNull(data[i]["% White"]) + "</div><div class='carrying'>Minority: " + checkNull(data[i]["% Minority"]) + "</div><div class='carrying'>Multi-racial: " + checkNull(data[i]["% Multi-Racial"]) + "</div>", data[i].Total, data[i].Year,cat,Number(data[i]["% Minority"]) );
      }
    }



    grouped["y1990"].addTo(map);
    grouped["y1995"].addTo(map);
    grouped["y2000"].addTo(map);
    grouped["y2005"].addTo(map);
    grouped["y2010"].addTo(map);
    grouped["y2013"].addTo(map);

    var shown = {
      "y1990": true,
      "y1995": false,
      "y2000": false,
      "y2005": false,
      "y2010": false,
      "y2013": false
    }
    $(".toolItem").click(function() {
      var clicked = "y" + $(this).html();
      map.removeLayer(grouped["y1990"]);
      map.removeLayer(grouped["y1995"]);
      map.removeLayer(grouped["y2000"]);
      map.removeLayer(grouped["y2005"]);
      map.removeLayer(grouped["y2010"]);
      map.removeLayer(grouped["y2013"]);
      $(".toolItem").removeClass("selected");
      map.addLayer(grouped[clicked]);
      $(this).addClass("selected");
    });

    map.removeLayer(grouped["y1995"]);
    map.removeLayer(grouped["y2000"]);
    map.removeLayer(grouped["y2005"]);
    map.removeLayer(grouped["y2010"]);
    map.removeLayer(grouped["y1990"]);

    function checkNull(val) {
      if (val > 0) {
        return Math.round(Number(val)*10)/10 + "%";
      } else {
        return "--";
      }
    }

    function checkNullNum(val) {
      if (val > 0) {
        return val;
      } else {
        return "--";
      }
    }

    function getColor(val) {
      var colors = ['rgb(255,255,255)','rgb(255,255,217)','rgb(237,248,177)','rgb(199,233,180)','rgb(127,205,187)','rgb(65,182,196)','rgb(29,145,192)','rgb(34,94,168)','rgb(37,52,148)','rgb(8,29,88)'];
      val = Math.floor(val/10);
      return colors[val];
    }
    function makeLegend() {
      var colors = ['rgb(255,255,255)','rgb(255,255,217)','rgb(237,248,177)','rgb(199,233,180)','rgb(127,205,187)','rgb(65,182,196)','rgb(29,145,192)','rgb(34,94,168)','rgb(37,52,148)','rgb(8,29,88)'];
      for ( i in colors ) {
        var box = $("<div class='legendColor'></div>").css("background",colors[i]);
        $(".legendColorBox").append(box);
      }
    }
    makeLegend();
  });