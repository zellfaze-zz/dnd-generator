$(document).ready( function() {
  $(function () { $("[data-toggle='tooltip']").tooltip(); });
  
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
  
  if (appLocation == 'local') {
    var path = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/";
  } else {
    var path = '';
  }
  listOfJSON = new Array('dieties', 'languages', 'skills');
  loadJSONFiles(path, listOfJSON, completedRequests);
  
  //This will run once all the requests are done
  function completedRequests(outstandingRequests) {
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
  $('#advancedOutput').scrollTop($('#advancedOutput').get(0).scrollHeight);
}

//Given an array of items and their weights, selects a random item
function weightedRandom(arrayOfWeightedData) {
  
}

function loadJSONFiles(location, listOfFiles, callback) {
  var outstandingRequests = listOfFiles.length;
  
  listOfFiles.forEach(function (item) {
    $.getJSON(location + "extras/" + item + ".json", function( data ) {
      logToAdvanced('Found ' + item + ' definition file');
      window.definitions[item] = data;
    }).fail( function() {
      logToAdvanced('Could not find ' + item + ' definition file');
      window.definitions[item] = null;
    }).always( function() {
      outstandingRequests--;
      if (typeof callback === "function") {
        callback(outstandingRequests);
      }
    });
  });
}

