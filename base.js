$(document).ready( function() {
  window.options = new Array();
  window.options['showAdvanced'] = false;
  $(function () { $("[data-toggle='tooltip']").tooltip(); });
  
  $('#generate-character').on('click', function() {
    window.options['type'] = 'generate';
    fadeBetween('#page1', '#page2');
  });
  
  $('#progress-character').on('click', function() {
    window.options['type'] = 'progress';
    fadeBetween('#page1', '#page2');
  });
  
  $('#advanced-off').on('click', function() {
    window.options['showAdvanced'] = false;
    $('#advanced-off').removeClass('btn-default').addClass('btn-primary');
    $('#advanced-on').removeClass('btn-primary').addClass('btn-default');
    return false;
  });
  
  $('#advanced-on').on('click', function() {
    window.options['showAdvanced'] = true;
    $('#advanced-on').removeClass('btn-default').addClass('btn-primary');
    $('#advanced-off').removeClass('btn-primary').addClass('btn-default');
    return false;
  });
  
  $('#logo, #current-page').on('click', function() {
    window.location.reload();
  });
  
  
  //Reset advanced log
  $('#advancedOutput').val('');
  
  logToAdvanced('==Application Initialization==');
  determineAppLocation();
  logToAdvanced('Looking for extra definitions...');
  window.definitions = new Array();
  //We can make these asynchronous, but we can't continue until they are all
  //  done.
  
  if (window.appLocation == 'local') {
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
        
        buildSkillsTable('#skillsTable');
        
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

function determineAppLocation() {
  logToAdvanced('Determining if application is local or remote...');
  window.appLocation ='';
  if (document.location['protocol'] == 'file:') {
    window.appLocation = 'local';
  } else {
    window.appLocation = 'remote';
  }
  logToAdvanced('Application is ' + window.appLocation);
}

function buildSkillsTable(selector) {
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
    $(selector).append(html);
  }
  logToAdvanced('Skills table built');
}

function fadeBetween(outSelect, inSelect) {
  $(outSelect).fadeOut(400, function() {
    $(inSelect).fadeIn(400);
  });
}