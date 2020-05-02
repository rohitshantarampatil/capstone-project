import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
      function getdata(){  
        return $.getJSON( "https://api.apify.com/v2/key-value-stores/tVaYRsPHLjNdNBu7S/records/LATEST?disableRedirect=true", function( data ) {
          var items = [];
          $.each( data, function( key, val ) {
            items.push( [key,val] );
          });
          return items
        });
    }

    data = getdata();
    // console.log(data);

});

Template.maincard.onCreated(function(){
  console.log("maincard");
});

Template.maincard.helpers({
  country:function(){
    function getdata(){  
      return $.getJSON( "https://api.apify.com/v2/key-value-stores/tVaYRsPHLjNdNBu7S/records/LATEST?disableRedirect=true"
      // , function( data ) {
      //   // var items = [];
      //   // $.each( data, function( val ) {
      //   //   items.push( [val] );
      //   // });
      //   // return items
      //   return data
      // }
      );
  };

  data = getdata();
  // console.log(typeof(data));
  console.log(data);
  a = data.responseJSON
  console.log(a)
  // console.log(data.responseJSON);
  return [{id:5},{id:4}];

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
