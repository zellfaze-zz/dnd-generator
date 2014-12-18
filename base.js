$(document).ready( function() {
  window.options = [];
  window.options.showAdvanced = false;
  $(function () { $("[data-toggle='tooltip']").tooltip(); });
  
  $('#generate-character').on('click', function() {
    window.options.type = 'generate';
    fadeBetween('#page1', '#page2');
  });
  
  $('#progress-character').on('click', function() {
    window.options.type = 'progress';
    fadeBetween('#page1', '#page2');
  });
  
  $('#advanced-off').on('click', function() {
    window.options.showAdvanced = false;
    $('#advanced-off').removeClass('btn-default').addClass('btn-primary');
    $('#advanced-on').removeClass('btn-primary').addClass('btn-default');
    $('.advanced-options').css('display', 'none');
    return false;
  });
  
  $('#advanced-on').on('click', function() {
    window.options.showAdvanced = true;
    $('#advanced-on').removeClass('btn-default').addClass('btn-primary');
    $('#advanced-off').removeClass('btn-primary').addClass('btn-default');
    $('.advanced-options').css('display', 'initial');
    return false;
  });
  
  $('#logo, #current-page').on('click', function() {
    window.location.reload();
  });
  
  $('#gender-random').on('click', function() {
    var gender = ['Male', 'Female']
    var selected = unweightedRandom(gender);
    
    switch (selected) {
      case 'Male':
        $('#gender-input1').prop('checked',true);
        break;
      case 'Female':
        $('#gender-input2').prop('checked',true);
        break;
    }
  });
  
  $('#name-random').on('click', function() {
    var pronoun = $("input[type='radio'][name=gender-input]:checked").val();
    var gender;
    switch (pronoun) {
      case 'he':
        gender = 'male';
        break;
      case 'she':
        gender = 'female';
        break;
      default:
        gender = 'random';
    }
    
    if ($('#adv-basic-lastname').prop('checked')) {
      window.dataStores.names.getFirstName(gender).done(function (firstname) {
        window.dataStores.names.getLastName().done(function (lastname) {
          $('#name-input').val(firstname + " " + lastname);
        });
      });
    } else {
      window.dataStores.names.getFirstName(gender).done(function (firstname) {
        $('#name-input').val(firstname);
      });
    }
    
    
  });
  
  
  //Reset advanced log
  $('#advancedOutput').val('');
  
  logToAdvanced('==Application Initialization==');
  determineAppLocation();
  logToAdvanced('Looking for data files...');
  window.definitions = [];
  //We can make these asynchronous, but we can't continue until they are all
  //  done.
  
  packageList = new packageFileList();
  packageList.getLoadedPackages().done(function (packages) {
    var names = new namesDataStore();
    packages.forEach(function(packageObj) {
      names.addDataFilesFromPackage(packageObj);
    });
    window.dataStores = new Object();
    window.dataStores.names = names;
  });
});

//Logs information to the advanced section at the bottom of the page
function logToAdvanced(textToLog) {
  var oldText = $('#advancedOutput').val();
  var newText = oldText + textToLog + "\n";
  $('#advancedOutput').val(newText);
  //$('#advancedOutput').scrollTop($('#advancedOutput').get(0).scrollHeight);
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
  if (document.location.protocol == 'file:') {
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
    var promiseArray = [];
    self.loadedPackages = [];
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
  };
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
      if (self.resourcesList !== null) {
        return self.resourcesList;
      }
      
      var dataFiles = [];
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
    
    if (self.data !== null) {
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
  };
}

/*******************************************************************************
**                                                                            **
**                            Datastore Classes                               **
**                                                                            **
*******************************************************************************/

//Datastores
//  classes			*needs work*
//  feats			
//  languages		
//  magic_items		*needs work*
//  mundane_items	*needs work*
//  races			
//  skills			
//  spell_lists		*may need rework*
//  spells			*needs work*
//  names			
//  dieties			*needs work*


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
    if (self.dataFiles === null) {
      self.dataFiles = [];
    }
    self.dataFiles.push(data);
    return true;
  } else {
    return false;
  }
};

//Adds all valid datafiles from a package to the data store
dataStore.prototype.addDataFilesFromPackage = function(packageObj) {
  var self = this;
  packageObj.resources.forEach(function(item) {
    self.addDataFile(item);
  });
};

//Returns arrays of the data from all data files.  Returns a promise.
dataStore.prototype.getAllData = function() {
  var self = this;
  var promiseArray = [];
  var dataArray = [];
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
};

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
      var maleNames = [];
      data.forEach(function(item) {
        maleNames = maleNames.concat(item.Firstnames.Male);
      });
      
      var femaleNames = [];
      data.forEach(function(item) {
        femaleNames = femaleNames.concat(item.Firstnames.Female);
      });
      
      switch (gender) {
        case 'male':
          deferredObj.resolve(unweightedRandom(maleNames));
          break;
        case 'female':
          deferredObj.resolve(unweightedRandom(femaleNames));
          break;
      }
    });
    
    return deferredObj.promise();
  };
  
  //Gets a random last name, returns a promise
  this.getLastName = function(gender) {
    var deferredObj = new $.Deferred();
    
    self.getAllData().done(function(data) {
      var firstNames = [];
      data.forEach(function(item) {
        firstNames = firstNames.concat(item.Lastnames.First);
      });
      
      var secondNames = [];
      data.forEach(function(item) {
        secondNames = secondNames.concat(item.Lastnames.Second);
      });
      
      var selectedFirst  = unweightedRandom(firstNames);
      var selectedSecond = unweightedRandom(secondNames);
      
      deferredObj.resolve(selectedFirst + selectedSecond);
    });
    
    return deferredObj.promise();
  };
  
}


//Inherites from dataStore
featsDataStore.prototype = new dataStore();
function featsDataStore() {
  var self = this;
  this.dataType = 'feats';
  
  this.getFeat = function(featname) {
    var deferredObj = new $.Deferred();
    
    self.getAllData().done(function(data) {
      var wantedFeat = data.forEach(function(item) {
        if (featname == item.Name) {
          return item;
        }
      });
      
      deferredObj.resolve(wantedFeat);
    });
    
    return deferredObj.promise();
  }
  
  this.getListOfFeats = function() {
    var deferredObj = new $.Deferred();
    
    self.getAllData().done(function(data) {
      var list = [];
      data.forEach(function(item) {
        list.push(item.Name);
      });
      
      deferredObj.resolve(list);
    });
    
    return deferredObj.promise();
  }
  
  this.getFeatsWithType = function(type) {
    var deferredObj = new $.Deferred();
    
    self.getAllData().done(function(data) {
      var list = [];
      data.forEach(function(item) {
        if (item.Type == type) {
          list.push(item.Name);
        }
      });
      
      deferredObj.resolve(list);
    });
    
    return deferredObj.promise();
  }
  
  this.getFeatsWithNoPrereqs = function() {
    var deferredObj = new $.Deferred();
    
    self.getAllData().done(function(data) {
      var list = [];
      data.forEach(function(item) {
        if (item.Prerequisites == "None") {
          list.push(item.Name);
        }
      });
      
      deferredObj.resolve(list);
    });
    
    return deferredObj.promise();
  }
  
  this.getFeatsWithNoPrereqs = function() {
    var deferredObj = new $.Deferred();
    
    self.getAllData().done(function(data) {
      var list = [];
      data.forEach(function(item) {
        if (item.Prerequisites == "None") {
          list.push(item.Name);
        }
      });
      
      deferredObj.resolve(list);
    });
    
    return deferredObj.promise();
  }
  
  //TODO: Make this detect bonuses of 0 and exclude them
  this.getFeatsWithSkillBonus = function(skill) {
    var deferredObj = new $.Deferred();
    
    self.getAllData().done(function(data) {
      var list = [];
      data.forEach(function(item) {
        if (item.Benefits.Numeric.Skills.hasOwnProperty(skill)) {
          list.push(item.Name);
        }
      });
      
      deferredObj.resolve(list);
    });
    
    return deferredObj.promise();
  }
}

//Languages data store, pulls all languages into the file
//prototype off dataStore

/****************************************************************
 Functions:
sharedAlphabet : returns all languages that share an alphabet
getLanguage    : returns a specific language (name and alphabet)
****************************************************************/

languagesDataStore.prototype = new dataStore();
function languagesDataStore() {
	var self = this;
	this.dataType = 'langauges';
	
	//get all languages that share an alphabet
	this.sharedAlphabet = new function(shared)
	{
		var deferredObj = new $.Deferred();
		
		//read the data
        self.getAllData().done(function(languages) 
		{
            var sharedLanguages = [];
            
            //add the data with matching alphabets to array
			languages.forEach(function(item)
			{
                if (item.alphabet === shared)
                {
                    sharedLangauges.push(item);
                }   				
			});
            //return array
            deferredObj.resolve(sharedLanguages);			
        });  
        return deferredObj.promise();
		
    };
	
	//get a specific language
	this.specificLanguage = new function(target)
	{
		var deferredObj = new $.Deferred();
		
		//read the data
        self.getAllData().done(function(languages) 
		{
            var returnable = null;
            
            //loop through all languages
			languages.forEach(function(item)
			{
				//if the item is the same
                if (item.name === target)
                {
                    returnable = item;
                }   				
			});
			
			//if the language isn't found, reject it
			if(typeof returnable === "null")
			{
				deferredObj.reject("Language not found");
			}
			
            //return the item
            deferredObj.resolve(returnable);	
        });  
        return deferredObj.promise();
		
    };
	
}

//Races data store, pulls all Races into the file
//prototype off dataStore

/*********************************************************************************
 Functions:
specificRace       : searches the array of races for specified race
sharedLanguage     : searches for all races that have the shared language
sharedAlignment    : searches for all races that have the shared alignment
sharedFavoredClass : searches for all races that have the shared favored class
sharedTrait        : searches for all races that have the specified trait
hasTrait	       : searches for all races that have entries in a specific trait
*********************************************************************************/

racesDataStore.prototype = new dataStore();
function racesDataStore() 
{
	var self = this;
	this.dataType = 'races';
	
	//loads a specific race
	this.specificRace = new function(target)
	{
		var deferredObj = new $.Deferred();
		
		//read the data
        self.getAllData().done(function(race) 
		{
            var returnable = null;
            
            //loop through all races
			race.forEach(function(item)
			{
				//if the item is the same, set the item to that 
                if (item.name === target)
                {
                    returnable = item;
                }   				
			});
			
			//if the race isn't found, reject it
			if(typeof returnable === "null")
			{
				deferredObj.reject("Race not found");
			}
			
            //return the item
            deferredObj.resolve(returnable);	
        });  
        return deferredObj.promise();	
    };
	
	//returns all races that share a common language
	this.sharedLanguage = new function(shared)
	{
		var deferredObj = new $.Deferred();
		
		//read the data
        self.getAllData().done(function(races) 
		{
            var sharedLanguages = [];
            
			//read through the array of languages in the race
			races.forEach(function(race)
			{
				race.Languages.forEach(function(language)
				{
				//add the race to the shared array if the language is there
					if(language === shared)
					{
						sharedLanguage.push(race);
					}
				});
			});
            //return array
            deferredObj.resolve(sharedLanguages);			
        });  
        return deferredObj.promise();	
    };
	
	//returns all races that share a common alignment
	this.sharedAlignment = new function(shared)
	{
		var deferredObj = new $.Deferred();
		
		//read the data
        self.getAllData().done(function(races) 
		{
            var sharedAlignment = [];
            
			//read through each race
			races.forEach(function(race)
			{
				//add the race to the shared array if their alignment is the same (or is any)
				if((race.Alignment === shared) || (race.Alignment === "Any"))
				{
					sharedAlignment.push(race);
				}
			});
            //return array
            deferredObj.resolve(sharedAlignment);			
        });  
        return deferredObj.promise();	
    };
	
	//returns all races that share a common favored class
	this.sharedFavoredClass = new function(shared)
	{
		var deferredObj = new $.Deferred();
		
		//read the data
        self.getAllData().done(function(races) 
		{
            var sharedFavoredClass = [];
            
			//read through each race
			races.forEach(function(race)
			{
				//add the race to the shared array if their alignment is the same
				if((race["Favored Class"] === shared) || (race["Favored Class"] === "Any"))
				{
					sharedFavoredClass.push(race);
				}
			});
            //return array
            deferredObj.resolve(sharedFavoredClass);			
        });  
        return deferredObj.promise();
    };
	
	//returns all races with a specific trait
	this.sharedTrait = new function(shared, trait)
	{
		var deferredObj = new $.Deferred();
		
		//read the data
        self.getAllData().done(function(races) 
		{
            var sharedTrait = [];
            
			//read through the switch statement
			switch (trait) 
			{
				//case for Stats, Skills, and Misc that searches the select
				//trait for the shared trait in question then adds that race
				//to the shared trait array
				case 'Stats':
				case 'Skills':
				case 'Misc':
					races.forEach(function(race)
					{
						if(race[trait].hasOwnProperty(shared))
						{
							sharedTrait.push(race);
						}
					});
					break;
				
				//case for spells and abilities that searches the select
				//trait for the shared trait in question then adds that race
				//to the shared trait array				
				case 'Spells':
				case 'Abilities':
					races.forEach(function(race)
					{
						races[trait].forEach(function(item)
						{
							if(item === shared)
							{
								sharedTraits.push(race);
							}
						});	
					});
					break;
				
				//default case for trait types that do not exist
				default:
					deferredObj.reject("Invalid trait type");
					break;
					
			}
            //return array
            deferredObj.resolve(sharedFavoredClass);			
        });  
        return deferredObj.promise();
    };
	
	//returns all classes that have any items in a specific trait
	this.hasTrait = new function(trait)
	{
		var deferredObj = new $.Deferred();
		
		//read the data
        self.getAllData().done(function(races) 
		{
            var sharedTrait = [];
            
			//read through the switch statement
			switch (trait) 
			{
				//case for Stats, Skills, and Misc that searches the select
				//trait for races that have any traits in that trait.
				case 'Stats':
				case 'Skills':
				case 'Misc':
					races.forEach(function(race)
					{
						if(!($.isEmptyObject(race[trait])))
						{
							sharedTrait.push(race);
						}
					});
					break;
				
				//case for spells and abilities that searches the select
				//trait for races that have any traits in that trait.				
				case 'Spells':
				case 'Abilities':
					races.forEach(function(race)
					{
						races[trait].forEach(function(item)
						{
							if(race[trait].length > 0)
							{
								sharedTraits.push(race);
							}
						});	
					});
					break;
				
				//default case for trait types that do not exist
				default:
					deferredObj.reject("Invalid trait type");
					break;
					
			}
            //return array
            deferredObj.resolve(sharedFavoredClass);			
        });  
        return deferredObj.promise();
    };
}

//Skills data store, pulls all skills into the file
//prototype off dataStore

/***********************************************************************************************
 Functions:
specificSkill     : searches for a specific skill and returns it's stats
getSkillSynergies : searches for a specific skill and returns it's synergies
checkSkill        : searches for all skills that contain a specific entry with a specific value
***********************************************************************************************/

skillsDataStore.prototype = new dataStore();
function skillsDataStore() 
{
	var self = this;
	this.dataType = 'skills';
	
	//gets a specific skill
	this.specificSkill = new function(target)
	{
		var deferredObj = new $.Deferred();
		
		//read the data
        self.getAllData().done(function(skills) 
		{
            var returnable = null;
            
            //loop through all races
			skills.forEach(function(item)
			{
				//if the item is the same, set the item to that 
                if (item.name === target)
                {
                    returnable = item;
                }   				
			});
			
			//if the race isn't found, reject it
			if(typeof returnable === "null")
			{
				deferredObj.reject("Skill not found");
			}
			
            //return the item
            deferredObj.resolve(returnable);	
        });  
        return deferredObj.promise();	
    };
	
	//returns a specific skill's synergies
	this.getSkillSynergies = new function(target)
	{
		var deferredObj = new $.Deferred();
		
		//read the data
        self.getAllData().done(function(skills) 
		{
            var skillName = null;
			var returnable = [];
            
            //loop through all races
			skills.forEach(function(item)
			{
				//if the item is the same, set the item to that 
                if (item.name === target)
                {
                    skillName = item;
                }   				
			});
			
			//if the race isn't found, reject it
			if(typeof skillName === "null")
			{
				deferredObj.reject("Skill not found");
			}
			
			//get all of the skills synergies and put them into returnable
			returnable = skillName.synergy;
			
            //return the item
            deferredObj.resolve(returnable);	
        });  
        return deferredObj.promise();	
    };
	
	//gets all skills that have desired entry set to the desired boolean
	this.checkSkill = new function(entry, bool)
	{
		var deferredObj = new $.Deferred();
		
		//read the data
        self.getAllData().done(function(skills) 
		{
            var returnable = [];
			
			//check each skill for the desired setting
			skills.forEach(function(item)
			{
				//add them to the array if they are equal
				if(item[entry] === bool)
				{
					returnable.push(item);	
				}
			});
            //return array
            deferredObj.resolve(returnable);			
        });  
        return deferredObj.promise();
    };
	
}
//Spell list data store, pulls all spell lists into the file
//prototype off dataStore
//This can probably be used for powers too

/***********************************************************************************************
 Functions:
getSpellsBySource : returns spell list by source
getSpellsByType   : returns spell list by type
getSpellsByLevel  : returns spell list by level
***********************************************************************************************/

spellListDataStore.prototype = new dataStore();
function spellListDataStore() 
{
	var self = this;
	this.dataType = 'spell_lists';
	
	//returns spell list by source
	this.getSpellsBySource = new function(target)
	{
		var deferredObj = new $.Deferred();
		
		//read the data
        self.getAllData().done(function(spell_list) 
		{
			var returnable = [];
			
            //loop through all spell lists
			spell_list.forEach(function(item)
			{
				//if the item is the same, add the item to returnables
                if (item.Source === target)
                {
                    returnable.push[item];
                }   				
			});
			
			//if the target isn't found, reject it
			if(returnable.length === 0)
			{
				deferredObj.reject("Spell list by source not found");
			}
			
            //return the items
            deferredObj.resolve(returnable);
			
		});
		return deferredObj.promise();
	};
	
	//returns spell list by type
	this.getSpellsByType = new function(target)
	{
		var deferredObj = new $.Deferred();
		
		//read the data
        self.getAllData().done(function(spell_list) 
		{
			var returnable = [];
			
            //loop through all spell lists
			spell_list.forEach(function(item)
			{
				//if the item is the same, add the item to returnables
                if (item.Type === target)
				{
                    returnable.push[item];
                }   				
			});
			
			//if the target isn't found, reject it
			if(returnable.length === 0)
			{
				deferredObj.reject("Spell list by type not found");
			}
            //return the items
            deferredObj.resolve(returnable);
			
		});
		return deferredObj.promise();
	};
	
	//returns spell list by level
	this.getSpellsByLevel = new function(source, target)
	{
		var deferredObj = new $.Deferred();
		
		//read the data
        self.getAllData().done(function(spell_list) 
		{
			var returnable = [];
			var stringTarget = "Level " + target.toString();
			
            //loop through all spell lists
			spell_list.forEach(function(item)
			{
				//if the item is the same, add the item to the returnables
                if (item.stringTarget === stringTarget)
                {
                    returnable.push[item];
                }   				
			});
			
			//if the target isn't found, reject it
			if(returnable.length === 0)
			{
				deferredObj.reject("Spell list by level not found");
			}
			
            //return the item
            deferredObj.resolve(returnable);
			
		});
		return deferredObj.promise();
	};
}

//Spells data store, pulls all spell into the file
//prototype off dataStore

/***********************************************************************************************
 Functions:
getSpellByAttribute : get a spell by an specified attribute
getMultipleSpells   : get a group of spells by same attribute
getSpellsByRanges   : get spells by numeric ranges (use greater than, less than or equal to)
***********************************************************************************************/

spellsDataStore.prototype = new dataStore();
function spellsDataStore() 
{
	var self = this;
	this.dataType = 'spells';

	//get a spell by an attribute
		/*mostly usefully for finding by name*/
	this.getSpellByAttribute = new function(attribute, target)
	{
		var deferredObj = new $.Deferred();
		
		//read the data
        self.getAllData().done(function(spells) 
		{
			var returnable = null;
			
            //loop through all spells
			spells.forEach(function(spell)
			{
				//if the spell attribute is the same its the returnable
                if (spell[attribute] === target)
                {
                    returnable = spell;
                }   				
			});
			
			//if the language isn't found, reject it
			if(typeof returnable === "null")
			{
				deferredObj.reject("No spell found with given parameters");
			}
			
            //return the spell
            deferredObj.resolve(returnable);
			
		});
		return deferredObj.promise();
	};
	
	//get a group of spells by same attribute
	this.getMultipleSpells = new function(attribute, target)
	{
		var deferredObj = new $.Deferred();
		
		//read the data
        self.getAllData().done(function(spells) 
		{
			var returnable = [];
			
            //loop through all spell lists
			spells.forEach(function(spell)
			{
				switch(attribute)
				{	
					//these require no special processing
					case 'School':
					case 'Cast Time':
					case 'Saving throw':
					case 'Spell resistance':
					case 'Target':
						//process the above
						if (spell[attribute] === target)
						{
							returnable.push(spell);
						}  					
						break;
						
					//these are arrays (some processing requires)
					case 'Components':
					case 'Type':
						//process the above
						spell[attribute].forEach(item)
						{
							if(spell[attribute] === target)
							{
								returnable.push(spell);
							}
						}
						break;
	
					default:
						deferredObj.reject("Spells not found with that attribute");
						break;
				}				
			});
			
			//if the target isn't found, reject it
			if(returnable.length === 0)
			{
				deferredObj.reject("No spells found with given parameters");
			}
			
            //return the item
            deferredObj.resolve(returnable);
			
		});
		return deferredObj.promise();
	};	
	
	//get spells by numeric ranges (use greater than, less than or equal to)
	this.getSpellsByRanges = new function(attribute, range, numeric)
	{
		var deferredObj = new $.Deferred();
		
		//read the data
        self.getAllData().done(function(spells) 
		{
			var returnable = [];

			//process all spells
			
			spells.forEach(function(spell)
			{
				switch(attribute)
				{
					//*********************************************************
					//by Range, uses base range
					case 'Range':
						switch(range)
						{
							case 'greater than':
							case '>':
								//process the above
								if(numeric > spell.Range)
								{
									returnable.push(spell);
								}
								break;

							case 'less than':
							case '<':
								//process the above
								if(numeric < spell.Range)
								{
									returnable.push(spell);
								}
								break;
							
							case 'equal to':
							case '=':
								//process the above
								if(numeric === spell.Range)
								{
									returnable.push(spell);
								}
								break;
							
							default:
								deferredObj.reject("Spells not found with that range");
								break;
						}
						break;
					//*********************************************************
					//by Duration, always evaluated in rounds
					case 'Duration':
						switch(range)
						{
							case 'greater than':
							case '>':
								//process the above
								//will return true if the base duration is not a number
								if( isNaN(spell["Base Duration"]) )
								{
									//then evaluate duration by additional duration
									var spellDuration = computeDurationArray(parseDuration(spell["Additional Duration"]));
									if(numeric > spellDuration)			//The actual testing of values
									{
										returnable.push(spell);
									}
									else
									{
										deferredObj.reject("reject at spellDuration");
									}
								}
								else if( (!isNaN(spell["Base Duration"])) )
								{
									if(numeric > spell["Base Duration"])//The actual testing of values
									{
										returnable.push(spell);
									}
									else
									{
										deferredObj.reject("reject at spellDuration");
									}
								}
								else
								{
									//well shit just happened
									deferredObj.reject("too complex of a method");
								}
								break;

							case 'less than':
							case '<':
								//process the above
								//will return true if the base duration is not a number
								if(isNaN(spell["Base Duration"]))
								{
									//then evaluate duration by additional duration
									var spellDuration = computeDurationArray(parseDuration(spell["Additional Duration"]));
									if(numeric < spellDuration)			//The actual testing of values
									{
										returnable.push(spell);
									}
									else
									{
										deferredObj.reject("reject at spellDuration");
									}
								}
								else if( (!isNaN(spell["Base Duration"])) )
								{
									if(numeric < spell["Base Duration"])//The actual testing of values
									{
										returnable.push(spell);
									}
									else
									{
										deferredObj.reject("reject at spellDuration");
									}
								}
								else
								{
									//well shit just happened
									deferredObj.reject("too complex of a method");
								}
								break;
							
							case 'equal to':
							case '=':
								//process the above
								//will return true if the base duration is not a number
								if(isNaN(spell["Base Duration"]))
								{
									//then evaluate duration by additional duration
									var spellDuration = computeDurationArray(parseDuration(spell["Additional Duration"]));
									if(numeric === spellDuration)		//The actual testing of values
									{
										returnable.push(spell);	//The actual testing of values
									}
									else
									{
										deferredObj.reject("reject at spellDuration");
									}
								}
								else if( (!isNaN(spell["Base Duration"])) )
								{
									if(numeric === spell["Base Duration"])//The actual testing of values
									{
										returnable.push(spell);
									}
									else
									{
										deferredObj.reject("reject at spellDuration");
									}
								}
								else
								{
									//well shit just happened
									deferredObj.reject("too complex of a method");
								}
								break;
							
							default:
								deferredObj.reject("Spells not found with that range");
								break;
						}
						break;
					//*********************************************************
					//by Size, will not process the "Additional sizes" in size
					case 'Size':
						switch(range)
						{
							case 'greater than':
							case '>':
								//process the above
								spell.Size.forEach(function(item)
								{
									if( (!isNaN(item)) || (numeric > item) )
									{
										returnable.push(spell);
									}
								});
								break;

							case 'less than':
							case '<':
								//process the above
								spell.Size.forEach(function(item)
								{
									if( (!isNaN(item)) || (numeric < item) )
									{
										returnable.push(spell);
									}
								});
								break;
							
							case 'equal to':
							case '=':
								//process the above
								spell.Size.forEach(function(item)
								{
									if( (!isNaN(item)) || (numeric === item) )
									{
										returnable.push(spell);
									}
								});
								break;
							
							default:
								deferredObj.reject("Spells not found with that range");
								break;
						}
						break;
					//*********************************************************
					//by Damage (max damage)
					case 'Damage':
						
						var max = 0;
						
						for(var item in spell.Damage)
						{
							max = maxRoll(spell.Damage[item]);
						}
					
						switch(range)
						{
							case 'greater than':
							case '>':
								//process the above
								if(numeric > max)
								{
									returnable.push(spell);
								}
								break;

							case 'less than':
							case '<':
								//process the above
								if(numeric < max)
								{
									returnable.push(spell);
								}
								break;
							
							case 'equal to':
							case '=':
								//process the above
								if(numeric === max)
								{
									returnable.push(spell);
								}
								break;
							
							default:
								deferredObj.reject("Spells not found with that range");
								break;
						}
						break;
					//*********************************************************
					default:
						deferredObj.reject("Spells not found with that attribute");
						break;
				}
			});
			
			//if the target isn't found, reject it
			if(returnable.length === 0)
			{
				deferredObj.reject("No spells found with given parameters");
			}
		});
		return deferredObj.promise();
	}
}

function fadeBetween(outSelect, inSelect) {
  $(outSelect).fadeOut(400, function() {
    $(inSelect).fadeIn(400);
  });
}

//parses durations into an array, separating the numeric and time
//product[0] is numeric value of duration
//product[1] is normalised time unit
//Returns false is the string is invalid
function parseDurationString(parsed) {
    var regularExp = /(\d+) (round|rounds|minute|minutes|hour|hours|day|days|week|weeks)/ig;
    
    //Parse the string
    if (regularExp.test() == false) {
        return false;
    }
    var product = regularExp.exec(parsed);
    
    //Normalise the string
    product[1] = product[1].toLowerCase();
    
    switch (product[1]) {
        case 'weeks':
            product[1] = 'week';
            break;
        case 'day':
            product[1] = 'day';
            break;
        case 'hours':
            product[1] = 'hour';
            break;
        case 'minutes':
            product[1] = 'minute';
            break;
        case 'rounds':
            product[1] = 'round';
            break;
    }
    
    //Return it
    return product;
}

//Accepts a durationArray produced by parseDurationString and converts it to rounds
function computeDurationArray(durationArray) {
    switch (durationArray[1]) {
        case 'week':
            durationArray[0] *= 7;
        case 'day':
            durationArray[0] *= 24;
        case 'hour':
            durationArray[0] *= 60;
        case 'minute':
            durationArray[0] *= 10;
          break;
    }
    
    return durationArray[0];
}

//parses dice rolls
function parseDice(dice) {
    var regularExp = /(\d+)d(\d+)(?: \+ )?(\d+)/;
    
    if (regularExp.text(dice) == false) {
        return false;
    }
    
    return regularExp.exec(dice);
}

function maxRoll(dice) {
    var parsedArrray = parseDice(dice);
    
    if (parsedArray == false) { return false;}
    
    return ((parsedArray[0] * parsedArray[1]) + parsedArray[2]);
}

function minRoll(dice) {
    var parsedArrray = parseDice(dice);
    
    if (parsedArray == false) { return false;}
    
    return (parsedArray[0] + parsedArray[2]);
}

function averageRoll(dice) {
    var parsedArrray = parseDice(dice);
    
    if (parsedArray == false) { return false;}
    
    return (((parsedArray[0] * parsedArray[1])/2) + parsedArray[2]);
}