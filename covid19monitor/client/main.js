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



Template.twitterfeed.onCreated(function(){
  var settings = {
    "url": "https://newsapi.org/v2/everything?q=COVID&from=2020-05-16&language=en&sortBy=publishedAt&apiKey=d9907f384ea9466f9efa3f7ecefca48d",
    "method": "GET",
    "timeout": 0,
    "async": false,

  };
  
  // var data = $.parseJSON($.ajax(settings).responseText);
  // console.log(data);
  // var data = NaN;
  var data = $.ajax(settings).done(function (response) {
    // console.log(response);
    return response;
  });
  // return(data.responseJSON.articles);

})
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
                                label: Session.get("slug_temp"),
                                backgroundColor: [
                                  'rgba(255, 99, 132, 0.2)',
                                  
                              ],
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




Template.twitterfeed.helpers({
  mainfeed : function(){

    var settings = {
      "url": "https://newsapi.org/v2/everything?q=COVID&from=2020-05-16&language=en&sortBy=publishedAt&apiKey=d9907f384ea9466f9efa3f7ecefca48d",
      "method": "GET",
      "timeout": 0,
      "async": false,
  
    };
    
    // var data = $.parseJSON($.ajax(settings).responseText);
    // console.log(data);
    // var data = NaN;
    var data = $.ajax(settings).done(function (response) {
      // console.log(response);
      return response;
    });
    console.log(data.responseJSON.articles);
    var mainlist = data.responseJSON.articles.filter(function(a) {if (a.author!=null){return a}}) ;
    return mainlist;
  }

})


Template.twitterfeed.events({
  'click .card'(event, instance) {
    // increment the counter when button is clicked
    console.log(this.url);
    window.open(this.url, "_blank"); 
  },
});