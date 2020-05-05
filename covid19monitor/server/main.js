import { Meteor } from 'meteor/meteor';
import '../lib/main.js';
Meteor.startup(() => {
  // code to run on server at startup
  Meteor.startup(function() {
    // Meteor.publish("circles", function () {
    //   if (Circles.find().count() === 0) {
    //     Circles.insert({ data: [5, 8, 11, 14, 17, 20] });
    //   };
    //   return Circles.find();
    // });
   
  });

});
