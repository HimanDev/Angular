angular.module('app', ['ionic']);

 $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15,// Creates a dropdown of 15 years to control year
    format: 'd mmmm, yyyy',
    close: 'Done'


  });
  
  
  
  