import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import '../lib/main.js';
import './main.html';
Meteor.subscribe("circles");
Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.maincard.onCreated(function(){
  console.log("maincard");
});

Template.maincard.helpers({
  country:function(){
  
    var settings = {
      "url": "https://api.covid19api.com/summary",
      "method": "GET",
      "async": false,
      "timeout": 0,
    };
    
    var data = $.parseJSON($.ajax(settings).responseText);
    console.log(data.Countries);
    arr =  data.Countries;
    arr.sort(function(a,b){return  b.TotalConfirmed - a.TotalConfirmed });
    
    arr.forEach(function (element) {
      element.TotalActive = element.TotalConfirmed-element.TotalRecovered;
    });
    
    console.log(arr)
    

    return arr;
  

  }

})
Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});

// Template.vis.rendered = function() {
//   var svg,
//     width = 500,
//     height = 75,
//     x;

//   svg = d3
//     .select("#circles")
//     .append("svg")
//     .attr("width", width)
//     .attr("height", height);

//   var drawCircles = function(update) {
//     var data = Circles.findOne().data;
//     var circles = svg.selectAll("circle").data(data);
//     if (!update) {
//       circles = circles
//         .enter()
//         .append("circle")
//         .attr("cx", function(d, i) {
//           return x(i);
//         })
//         .attr("cy", height / 2);
//     } else {
//       circles = circles.transition().duration(1000);
//     }
//     circles.attr("r", function(d) {
//       return d;
//     });
//   };

//   Circles.find().observe({
//     added: function() {
//       x = d3.scale
//         .ordinal()
//         .domain(d3.range(Circles.findOne().data.length))
//         .rangePoints([0, width], 1);
//       drawCircles(false);
//     },
//     changed: _.partial(drawCircles, true)
//   });
// };
