import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import '../lib/main.js';
import './main.html';
import './container.html';
import Chart from '../node_modules/chart.js/dist/Chart.js';


// var slug_temp;
Session.setDefault("slug_temp",false);
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
    if (data){
          arr =  data.Countries;
          arr.sort(function(a,b){return  b.TotalConfirmed - a.TotalConfirmed });
          
          arr.forEach(function (element) {
            element.TotalActive = element.TotalConfirmed-element.TotalRecovered;
          });
          
          // console.log(arr)
          return arr;
    }
    
  },

  showpopup:function(){
    if (Session.get("slug_temp")==false){
      return false
    }
    else{
      return true
    }
  }


})

Template.maincard.events({
  'click .js-click-country'() {
    // increment the counter when button is clicked
    Session.set("slug_temp",this.Slug);
    console.log(this.Slug);
    Session.set("chart_main",true);
    var settings = {
      "url": "https://api.covid19api.com/total/country/"+this.Slug,
      "method": "GET",
      "async": false,
      "timeout": 0,
    };
    
    var data = $.parseJSON($.ajax(settings).responseText);
    Session.set("country_data",data);
    // console.log(data);




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

Template.chart.onCreated(function() {
  chart1 = this.subscribe('chart1');
});



// Chart template
// Template.acTemplate.onRendered(function render() {
//   /*
//     Get container for chart.
//     It is not actually necessary here, `chart.container('container').draw();` can be used
//     for current scope, but container is found in template to avoid container ID duplication.
//    */
//   console.log("here");
//   if (Session.get("chart_rendered")){
//   slug = Session.get("slug_temp");
//   var container = this.find("#containera");
//   var settings = {
//       "url": "https://api.covid19api.com/total/country/"+slug,
//       "method": "GET",
//       "async": false,
//       "timeout": 0,
//   };

//       var dataall = $.parseJSON($.ajax(settings).responseText);
    
    
//     var data_temp = dataall.map(a=> ([a.Date, a.Confirmed]));

//     // data = data[]
//       data = data_temp.filter(function(value, index, Arr) {
//       return index % 5 == 0;
//         });
//       console.log(data);
      
//       Session.set("chart_rendered",false);
      
//   // Turn Meteor Collection to simple array of objects.
// //   var data = [{x: 'Department Stores', value: 6371664}
// //   , {x: 'Discount Stores', value: 7216301}
// //   ,{x: 'Men\'s/Women\'s Stores', value: 1486621}
// //   ,{x: 'Juvenile Specialty Stores', value: 786622}
// //   ,{x: 'All other outlets', value: 900000}]

// // //   //  ----- Standard Anychart API in use -----
//   chart = anychart.line();
//   var series = chart.line(data);
//   chart.container("containera");
//   chart.draw();
// }

// });


// drawchart = function(datavalues,datalabels){

// var data = {
//  labels: datalabels,
//  datasets: [
//      {
//          label: "My First dataset",
//          fillColor: "rgba(220,220,0,0.2)",
//          strokeColor: "rgba(220,220,220,1)",
//          pointColor: "rgba(220,220,220,1)",
//          pointStrokeColor: "#fff",
//          pointHighlightFill: "#fff",
//          pointHighlightStroke: "rgba(220,220,220,1)",
//          data: datavalues,
         
//      },
    
//  ]
// }; 
// var ctx = $("#myChart").get(0).getContext("2d");
// //  new Chart(ctx).Line(data);
//  var myNewChart = new Chart(ctx , {
//   type: "line",
//   data: data, 
// });
// };




Template.chart.rendered = function(){

  console.log("chart rendered");
  Tracker.autorun(function () {

    // slug = Session.get("slug_temp");
    // console.log(slug);
    
    if(Session.get("chart_main")){
        if (chart1.ready()) {
              

              
              // var budgetdata = Budget.find();
              // var datavalues=[5,10,15,112,545,884];
              // var datalabels=[11,2,25,55,56,55];
              // budgetdata.forEach(function(option) {
                
              //     datavalues.push(option.value);
              //     datalabels.push(option.itemname)
              // });

              var dataall = Session.get("country_data");
              // console.log("dataall"+dataall);
              if (dataall){

              
                    var data_temp = dataall.map(a=> ([a.Date, a.Confirmed]));
                
                    data_reduced = [];
                      data_reduced = data_temp.filter(function(value, index, Arr) {
                      return index % 5 == 0;
                        });
                      var datavalues = data_reduced.map(a=>(a[1]));
                      var datalabels = data_reduced.map(a=>(a[0]));
                      // console.log(datavalues);
                      console.log("data refreshed for slug: "+ Session.get("slug_temp"));      
                      
                      console.log(datavalues);
                      var data = {
                        labels: datalabels,
                        datasets: [
                            {
                                label: "My First dataset",
                                fillColor: "rgba(220,220,0,0.2)",
                                strokeColor: "rgba(220,220,220,1)",
                                pointColor: "rgba(220,220,220,1)",
                                pointStrokeColor: "#fff",
                                pointHighlightFill: "#fff",
                                pointHighlightStroke: "rgba(220,220,220,1)",
                                data: datavalues,
                                
                            },
                           
                        ]
                       }; 
                       
                      //  $("#myChart").remove();
                      //  $('#container_chart').append('<canvas id="myChart" width="100px" height="100px"></canvas>');

                       var ctx = $("#myChart").get(0).getContext("2d");
                        myNewChart = new Chart(ctx , {
                         type: "line",
                         data: data, 
                       });                      
                      console.log("chart redrawn");
                }
      }   
    }
  });

};