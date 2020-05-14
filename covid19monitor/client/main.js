import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import '../lib/main.js';
import './main.html';
import './container.html';

var chart;

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

Template.maincard.events({
  'click .js-click-country'() {
    // increment the counter when button is clicked
    slug = this.Slug
    var settings = {
      "url": "https://api.covid19api.com/total/country/"+slug,
      "method": "GET",
      "async": false,
      "timeout": 0,
    };
    
    var data = $.parseJSON($.ajax(settings).responseText);
    console.log(data);

  },
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


// Chart template
Template.acTemplate.rendered = function() {
  /*
    Get container for chart.
    It is not actually necessary here, `chart.container('container').draw();` can be used
    for current scope, but container is found in template to avoid container ID duplication.
   */
  var container = this.find("#containera");
    slug = "united-states"
    var settings = {
      "url": "https://api.covid19api.com/total/country/"+slug,
      "method": "GET",
      "async": false,
      "timeout": 0,
    };
    
    var dataall = $.parseJSON($.ajax(settings).responseText);
    console.log("second");
    console.log(dataall);

    var data = dataall.map(a=> ([a.Date, a.Confirmed]));
    console.log(data);

  // Turn Meteor Collection to simple array of objects.
//   var data = [{x: 'Department Stores', value: 6371664}
// ,{x: 'Discount Stores', value: 7216301}
//   ,{x: 'Men\'s/Women\'s Stores', value: 1486621}
//   ,{x: 'Juvenile Specialty Stores', value: 786622}
//   ,{x: 'All other outlets', value: 900000}]

//   //  ----- Standard Anychart API in use -----
  chart = anychart.line();
  var series = chart.line(data);
  chart.container("containera");
  chart.draw();

};