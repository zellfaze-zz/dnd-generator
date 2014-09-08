$(document).ready( function() {
  //Reset advanced log
  $('#advancedOutput').val('');
  
  logToAdvanced('==Application Initialization==');
  determineAppLocation();
  logToAdvanced('Looking for data files...');
  window.definitions = new Array();
  //We can make these asynchronous, but we can't continue until they are all
  //  done.
  
  if (window.appLocation == 'local') {
    var path = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/";
  } else {
    var path = '';
  }
  
  packageList = new packageFileList(path);
  return;
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

function packageFileList(location) {
  var self = this;
  
  $.getJSON(location + "data/load.json", function( data ) {
    logToAdvanced('Found list of packages');
    
    //We'll load all of the package file definitions asyncronously and
    //  store them in packageFile objects.  self.loadedPackages will end up
    //  populated with all of our package definitions
    self.loadedPackages = new Array();
    loadingPackages = new Array();
    var outstandingRequests = data.length;
    data.forEach(function(item) {
      loadingPackages.push(new packageFile(location, item, function(thisPackage) {
        if (thisPackage.ready) {
          self.loadedPackages.push(thisPackage);
        }
        
        outstandingRequests--;
        if (outstandingRequests == 0) {
          keepLoading();
        }
      }));
    });
    
    //This gets executed once self.loadedPackages is populated
    function keepLoading() {
      logToAdvanced('Loaded all available packages');
      logToAdvanced('Loaded packages:');
      self.loadedPackages.forEach(function(item) {
        logToAdvanced(' '  + item.title);
        logToAdvanced('  ' + item.description);
        logToAdvanced('  ' + item.creditline);
      });
    }
    
  //This only executes if the load.json file wasn't present  
  }).fail( function() {
    logToAdvanced('Could not find list of packages');
    throw 'Could not find list of packages';
  });
}

function packageFile(location, file, callback) {
  var self    = this;
  this.ready  = false; //True if package loaded successfully, false otherwise
  this.file   = file;
  this.data   = null;
  
  $.getJSON(location + "data/" + file + "/datapackage.json", function( data ) {
    logToAdvanced('Loaded ' + file + ' data package file');
    self.ready = true;
    self.data = data;
  }).fail( function() {
    logToAdvanced('Could not load ' + file + ' data package file');
    self.ready = false;
  }).always( function() {
    if (typeof callback === "function") {
      callback(self);
    }
  });
  
  this.__defineGetter__("creditline", function(){
    return self.data.creditline;
  });
  
  this.__defineGetter__("name", function(){
    return self.data.name;
  });
  
  this.__defineGetter__("title", function(){
    return self.data.title;
  });
  
  this.__defineGetter__("description", function(){
    return self.data.description;
  });
  
  this.__defineGetter__("homepage", function(){
    return self.data.homepage;
  });
  
  this.__defineGetter__("version", function(){
    return self.data.version;
  });
  
  this.__defineGetter__("license", function(){
    return self.data.license;
  });
  
  //TODO: Maintainers
  
  //TODO: Resources
  
  //TODO: Licenses
}