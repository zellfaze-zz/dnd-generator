$(document).ready( function() {
  //Reset advanced log
  $('#advancedOutput').val('');
  
  logToAdvanced('==Application Initialization==');
  determineAppLocation();
  logToAdvanced('Looking for data files...');
  window.definitions = new Array();
  //We can make these asynchronous, but we can't continue until they are all
  //  done.
  
  packageList = new packageFileList();
  packageList.getLoadedPackages().done(function (packages) {
    var names = new namesDataStore();
    packages.forEach(function(packageObj) {
      names.addDataFilesFromPackage(packageObj);
    });
  });
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

function unweightedRandom(arrayOfData) {
  return arrayOfData[Math.floor(Math.random() * arrayOfData.length)];
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
  
  if (window.appLocation == 'local') {
    window.path = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/";
  } else {
    window.path = '';
  }
}

/*function buildSkillsTable(selector) {
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
}*/

/*******************************************************************************
**                                                                            **
**                            Packaging Classes                               **
**                                                                            **
*******************************************************************************/

function packageFileList(location) {
  var self = this;
  self.loadedPackages = null;
  self.deferredObject = new $.Deferred();
  self.listLoaded     = self.deferredObject.promise();
  
  if (typeof location != "string") {
    location = "data/load.json";
  }
  
  $.getJSON(window.path + location, function( data ) {
    logToAdvanced('Found list of packages');
    
    //We'll load all of the package file definitions asyncronously and
    //  store them in packageFile objects.  self.loadedPackages will end up
    //  populated with all of our package definitions
    var promiseArray = new Array();
    self.loadedPackages = new Array();
    data.forEach(function(item) {
      var currentPackage = new packageFile(item);
      promiseArray.push(currentPackage.loaded.done(function(thisPackage) {
        //Package loaded, add it to the list
        self.loadedPackages.push(thisPackage);
      }));
    });
    
    $.when.apply($, promiseArray).always(function() {
      //All packages have now loaded lets output some data and fulfill our
      //  promise.
      logToAdvanced('Loaded all available packages');
      logToAdvanced('Loaded packages:');
      self.loadedPackages.forEach(function(item) {
        logToAdvanced(' '  + item.title);
        logToAdvanced('  ' + item.description);
        logToAdvanced('  ' + item.creditline);
      });
      
      self.deferredObject.resolve(self.loadedPackages);
    });
    
  //This only executes if the load.json file wasn't present  
  }).fail( function() {
    logToAdvanced('Could not find list of packages');
    self.deferredObject.reject();
  });
  
  //Returns a promise object that resolves once package list is loaded
  this.getLoadedPackages = function() {
    return self.listLoaded;
  }
}

function packageFile(file) {
  var self            = this;
  this.file           = file;
  this.data           = null;
  this.resourcesList  = null;
  this.deferredObj    = new $.Deferred();
  this.loaded         = this.deferredObj.promise();
  
  $.getJSON(window.path + "data/" + file + "/datapackage.json", function( data ) {
    logToAdvanced('  Loaded ' + file + ' data package file');
    self.data = data;
    self.deferredObj.resolve(self);
  }).fail( function() {
    logToAdvanced('  Could not load ' + file + ' data package file');
    self.deferredObj.reject();
  });
  
  //Block off access to these methods until the package file is loaded
  this.loaded.done(function() {
    self.__defineGetter__("creditline", function(){
      return self.data.creditline;
    });
    
    self.__defineGetter__("name", function(){
      return self.data.name;
    });
    
    self.__defineGetter__("title", function(){
      return self.data.title;
    });
    
    self.__defineGetter__("description", function(){
      return self.data.description;
    });
    
    self.__defineGetter__("homepage", function(){
      return self.data.homepage;
    });
    
    self.__defineGetter__("version", function(){
      return self.data.version;
    });
    
    self.__defineGetter__("license", function(){
      return self.data.license;
    });
    
    self.__defineGetter__("maintainers", function(){
      return self.data.maintainers;
    });
    
    self.__defineGetter__("licenses", function(){
      return self.data.licenses;
    });
    
    //This function is lazy initialized, but does not return a promise
    //  it should execute fast enough to not need one unless the package is huge
    self.__defineGetter__("resources", function(){
      if (self.resourcesList != null) {
        return self.resourcesList;
      }
      
      var dataFiles = new Array();
      self.data.resources.forEach(function (item) {
        dataFiles.push(new dataFile(item.name, self.file + "/" + item.path, item.format, item.type));
      });
      
      self.resourcesList = dataFiles;
      return self.resourcesList;
    });
  });
}

function dataFile(name, path, format, type) {
  var self = this;
  this.name   = name;
  this.path   = window.path + "data/" + path;
  this.format = format;
  this.type   = type;
  this.data   = null;
  
  if (self.format != 'json') {
    throw "Data files can only be JSON formatted at this time!";
  }
  
  //This returns a promise which is resolved once the data is loaded
  this.getData = function() {
    var deferredObject = new $.Deferred();
    
    if (self.data != null) {
      deferredObject.resolve(self.data);
      return deferredObject.promise();
    }
    
    $.getJSON(self.path, function( data ) {
      self.data = data;
      deferredObject.resolve(self.data);
    }).fail( function() {
      deferredObject.reject();
    });
    
    return deferredObject.promise();
  }
}

/*******************************************************************************
**                                                                            **
**                            Datastore Classes                               **
**                                                                            **
*******************************************************************************/

//Datastores
//  classes
//  feats
//  languages
//  magic_items
//  mundane_items
//  races
//  skills
//  spell_lists
//  spells
//  names
//  dieties


//Defining the shell of the dataStore object
function dataStore() {
}

dataStore.prototype.dataFiles = null;

//Adds a datafile to the datastore. Some checking is done to ensure the data
//  file is of the correct type.  Passing true as arg2 will skip those checks;
//  do so at your own risk.
dataStore.prototype.addDataFile = function(data, force) {
  var self = this;
  if (typeof force != "boolean") {
    force = false;
  }
  
  if ((data.type == self.dataType) || (force === true)) {
    if (self.dataFiles == null) {
      self.dataFiles = new Array();
    }
    self.dataFiles.push(data);
    return true;
  } else {
    return false;
  }
}

//Adds all valid datafiles from a package to the data store
dataStore.prototype.addDataFilesFromPackage = function(packageObj) {
  var self = this;
  packageObj.resources.forEach(function(item) {
    self.addDataFile(item);
  });
}

//Returns arrays of the data from all data files.  Returns a promise.
dataStore.prototype.getAllData = function() {
  var self = this;
  var promiseArray = new Array();
  var dataArray = new Array();
  var deferredObj = new $.Deferred();
  
  self.dataFiles.forEach(function(item) {
    promiseArray.push(item.getData().done(function(data) {
      dataArray.push(data);
    }));
  });
  
  $.when.apply($, promiseArray).always(function() {
    deferredObj.resolve(dataArray);
  });
  
  return deferredObj.promise();
}

//Possible TODO: Remove datafiles from data store if they fail to load.
//Inherites from dataStore
namesDataStore.prototype = new dataStore();
function namesDataStore() {
  var self = this;
  this.dataType = 'names';
  
  //Gets a random first name, returns a promise
  this.getFirstName = function(gender) {
    var deferredObj = new $.Deferred();
    
    if (typeof gender != "string") {
      gender = 'random';
    }
    
    if ((gender != 'male') && (gender != 'female')) {
      gender = 'random';
    }
    
    if (gender == 'random') {
      switch (Math.floor(Math.random() * 2) + 1) {
        case 1:
          gender = 'male';
          break;
        case 2:
          gender = 'female';
          break;
      }
    }
    
    self.getAllData().done(function(data) {
      var maleNames = new Array();
      data.forEach(function(item) {
        maleNames = maleNames.concat(item.Firstnames.Male);
      });
      
      deferredObj.resolve(unweightedRandom(maleNames));
    });
    
    return deferredObj.promise();
  }
}
