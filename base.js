$(document).ready( function() {
  //Reset advanced log
  $('#advancedOutput').val('');
  
  logToAdvanced('==Application Initialization==');
  logToAdvanced('Determining if application is local or remote...');
  var appLocation;
  if (document.location['protocol'] == 'file:') {
    appLocation = 'local';
  } else {
    appLocation = 'remote';
  }
  logToAdvanced('Application is ' + appLocation);
  
  logToAdvanced('Looking for extra definitions...');
  window.definitions = new Array();
  //We can make these asynchronous, but we can't continue until they are all
  //  done.
  var outstandingRequests = 3;
  if (appLocation == 'local') {
    var path = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
    $.getJSON(path + "/extras/dieties.json", function( data ) {
      logToAdvanced('Found diety definitions');
      window.definitions['diety'] = data;
    }).fail( function() {
      logToAdvanced('No diety definitions found');
      window.definitions['diety'] = null;
    }).always( function() {
      outstandingRequests--;
      completedRequests();
    });
    $.getJSON(path + "/extras/languages.json", function( data ) {
      logToAdvanced('Found language definitions');
      window.definitions['language'] = data;
    }).fail( function() {
      logToAdvanced('No language definitions found');
      window.definitions['language'] = null;
    }).always( function() {
      outstandingRequests--;
      completedRequests();
    });
    $.getJSON(path + "/extras/skills.json", function( data ) {
      logToAdvanced('Found skill definitions');
      window.definitions['skills'] = data;
    }).fail( function() {
      logToAdvanced('No skill definitions found');
      window.definitions['skills'] = null;
    }).always( function() {
      outstandingRequests--;
      completedRequests();
    });
  } else {
    $.getJSON( "extras/dieties.json", function( data ) {
      logToAdvanced('Found diety definitions');
      window.definitions['diety'] = data;
    }).fail( function() {
      logToAdvanced('No diety definitions found');
      window.definitions['diety'] = null;
    }).always( function() {
      outstandingRequests--;
      completedRequests();
    });
    $.getJSON( "extras/languages.json", function( data ) {
      logToAdvanced('Found language definitions');
      window.definitions['language'] = data;
    }).fail( function() {
      logToAdvanced('No language definitions found');
      window.definitions['language'] = null;
    }).always( function() {
      outstandingRequests--;
      completedRequests();
    });
    $.getJSON( "extras/skills.json", function( data ) {
      logToAdvanced('Found skill definitions');
      window.definitions['skills'] = data;
    }).fail( function() {
      logToAdvanced('No skill definitions found');
      window.definitions['skills'] = null;
    }).always( function() {
      outstandingRequests--;
      completedRequests();
    });
  }
  
  //This will run once all the requests are done
  function completedRequests() {
      if (outstandingRequests == 0) {
        logToAdvanced('All extra definitions loaded');
        
        //Build skills table
        for (var skillNum = 0; skillNum < window.definitions['skills'].length; skillNum++) {
          var skillKey = window.definitions['skills'][skillNum]['key'];
          skillKey = skillKey.charAt(0).toUpperCase() + skillKey.slice(1);
          var skillName = window.definitions['skills'][skillNum]['name'];
          if (window.definitions['skills'][skillNum]['trained']) {
            skillName = skillName+"<sup>1</sup>";
          }
          
          var html = '<tr>';
          html = html + '<td>' + skillName + '</td>';
          html = html + '<td><input type="number" /></td>';
          html = html + '<td>' + skillKey + '</td>';
          html = html + '<td><input type="number" /></td>';
          html = html + '<td><input type="number" /></td>';
          html = html + '<td><input type="number" /></td>';
          html = html + '</tr>';
          $('#skillsTable').append(html);
        }
        logToAdvanced('Skills table built');
        
        //Application is all set up, we can display the generate button now!
        logToAdvanced('Application initialized!');
        $("#generate").show();
      }
  }
});

//Logs information to the advanced section at the bottom of the page
function logToAdvanced(textToLog) {
  var oldText = $('#advancedOutput').val();
  var newText = oldText + textToLog + "\n";
  $('#advancedOutput').val(newText);
}

//Given an array of items and their weights, selects a random item
function weightedRandom(arrayOfWeightedData) {
  
}

