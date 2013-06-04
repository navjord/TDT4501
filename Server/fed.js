if (Meteor.isClient) {
	Tests = new Meteor.Collection("test");
	

	Session.setDefault('article_id', null);
	
	var articlesHandle = Meteor.subscribe("test", function(){
		
	});
	
	Template.tests.tests = function(){
		return Tests.find({}, {sort: {name: 1}});
	};
	
	Template.tests.events({
		'click .articleTitle' : function(evt){
			console.log('clicked title of '+evt);
			console.log(evt);
			console.log(this);
		
		}
	});
	
  Template.hello.greeting = function () {
    return "Welcome to fed.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
	  putStuffIn('test'); 
  
  });
  
  
  
}
//
////TODO: Add some scraping to this 
//

//This is only for norsk avisbank
function putStuffIn(corpusName){
	console.log(corpusName);
	
	console.log('putting in...');
	var name = corpusName+'.txt';
	var fs = __meteor_bootstrap__.require('fs');   
    var path = __meteor_bootstrap__.require('path');   
    if (Meteor.isClient) {
    	Tests = new Meteor.Collection("test");
    	

    	Session.setDefault('article_id', null);
    	
    	var articlesHandle = Meteor.subscribe("test", function(){
    		
    	});
    	
    	Template.tests.tests = function(){
    		return Tests.find({}, {sort: {name: 1}});
    	};
    	
    	Template.tests.events({
    		'click .articleTitle' : function(evt){
    			console.log('clicked title of '+evt);
    			console.log(evt);
    			console.log(this);
    		
    		}
    	});
    	
      Template.hello.greeting = function () {
        return "Welcome to fed.";
      };

      Template.hello.events({
        'click input' : function () {
          // template data, if any, is available in 'this'
          if (typeof console !== 'undefined')
            console.log("You pressed the button");
        }
      });
      
     
      
    }

    if (Meteor.isServer) {
      Meteor.startup(function () {
        // code to run on server at startup
    	  putStuffIn('test');
    	  
      
      });
      
      
      
    }

    var classifiers = new Array();
    function addClassifier(what){
    	if(what.type="svm"){
    		classifiers['svm'] = what.address;
    	}
    	if(what.type="medldac"){
    		classifiers['medldac'] = what.address;
    	}
    	if(what.type="logiclda"){
    		classifiers['logiclda'] = what.address;
    	}
    	if(what.type="lda"){
    		classifiers['lda'] = what.address;
    	}
    }

    //Called manually for now. Needs to be started by Linux-machine later...
    function startSVMPipeline(corporaNo){
    	convertFormats(corporaNo);
    	if(classifiers['svm']){
    		publish(classifiers['svm'], 'localhost:3001');
    	}
    	
    }

    function convertFormats(corporaNo) {
    	var form = new Formatter(Tares, NLTK, getTaggedCorpora(corporaNo));
    	form.format(500);
    }

    function getTaggedCorpora(corporaNo) {
    	DB.get({type: 'taggedArticle', number: corporaNo});
    	
    }


    //
    ////TODO: Add some scraping to this 
    //

    //This is only for norsk avisbank
    function putStuffIn(corpusName){
    	console.log(corpusName);
    	
    	console.log('putting in...');
    	var name = corpusName+'.txt';
    	var fs = __meteor_bootstrap__.require('fs');   
        var path = __meteor_bootstrap__.require('path');   
        var base = path.resolve('.');
        var data = fs.readFileSync(path.join(base, '/', name));
        console.log(name);
//        console.log(data.toString());
        
        Corpus = new Meteor.Collection(corpusName);
    //    
//        //let's put the entire corpus into mongodb
//        //but first test with one doc.
        var cArray = data.toString().split('\n');
    ////    
    ////
        var total = 0;
        var i = 0;
        var currentURI = "";
        var currentYear = 0;
        var currentMonth = 0;
        var currentDay = 0;
        var currentDate = 0;
        var currentAuthor = "";
        var currentSummary = "";
        var currentTitle ="";
        var currentText = "";
        var uriStart = 0;
        var uriEnd = 0;
        var currentSub = "";
        var currentTags;
        var temp = 0;
        var corrective;

        function resetStuff() {
                currentURI = "";
                currentYear = 0;
                currentMonth = 0;
                currentDay = 0;
                currentDate = 0;
                currentAuthor = "";
                currentSummary = "";
                currentTitle ="";
                currentText = "";
                uriStart = 0;
                uriEnd = 0;
                currentSub = "";
                currentTags;
                temp = 0;

        }

        var CSV = ""; //ID, Year, Month, Day, FullDate, Tags, URI, Title, Text\n";
        var unique = 0;
        //Not used for Comma-Separated Values anymore, but rather for saving the collection to DB.
        function writeCSV(){
//        	console.log(currentTags);
//        	console.log("\"energi\"");
//        	console.log(currentTags == "\"energi\"");
        	if(currentTags == "\"energi\"") {
                unique++;
                Corpus.insert({number: unique, year: currentYear, month: currentMonth, day: currentDay, date: currentDate, currentTags: currentTags, 
                	URI: currentURI, title: currentTitle, text: currentText}, function(err, id){
                		console.log(err, id);
                	});
                CSV+=unique+','+currentYear+','+currentMonth+','+currentDay+','+currentDate+','+currentTags+','+currentURI+','+'"'+currentTitle+'"'+','+'"'+currentText+'"\n';
                //console.log(CSV);
                if(i>1000 && i<1200){
                        corrective = CSV;
                        
                }
        	}
        }

        while(i<cArray.length){
                total++;
                if(total == 100 || total == 10000 || total == 100000 || total == 300000 || total == 500000 || total == 700000){
                        console.log(total);
                }
                //TODO: Remove crowray-thingie paragraph thing, and replace with... either '\n' or space.
                
                cArray[i] = cArray[i].replace('¶', ' ').replace(/"/g, '\'');
                
                //URI
                if(cArray[i].indexOf('##U') !== -1){
                        
//                        writeCSV();
                        resetStuff();
                        
                        //console.log(cArray[i]);
                        uriStart = cArray[i].indexOf('##U #')+5;
                        uriEnd = cArray[i].indexOf('>');
                        currentURI = cArray[i].substring(uriStart, uriEnd);
                        //console.log(currentURI);
                        uriStart = currentURI.indexOf('dn.no/')+6;
                        uriEnd = currentURI.indexOf('/article');
                        currentSub = currentURI.substring(uriStart, uriEnd);
                        //console.log(currentSub.split('/').toString());
                        var currentTags = '"'+currentSub.split('/').toString()+'"';
                        //add the tags of the uri..
                        
                }
                else if(cArray[i].indexOf('##B') !== -1){
                
                }
                else if(cArray[i].indexOf('##A') !== -1){
                        currentYear = cArray[i].substring(cArray[i].length-3, cArray[i].length-1);
                        
                }
                else if(cArray[i].indexOf('##M') !== -1){
                        currentMonth = cArray[i].substring(cArray[i].length-3, cArray[i].length-1);
                }
                else if(cArray[i].indexOf('##D') !== -1){
                        currentDay = cArray[i].substring(cArray[i].length-3, cArray[i].length-1);
                        //console.log('20'+currentYear+currentMonth+currentDay);
                }
                else if(temp == 0){
                        currentTitle = cArray[i].replace(/"/g, '\'');
                        temp++;
                        //console.log(currentTitle);
                }
                else if(cArray[i].indexOf('Publisert: ') !== -1){
                        currentDate = cArray[i].substring(cArray[i].indexOf('Publisert: ')+11, cArray[i].indexOf('Publisert: ')+29);
                        //console.log(currentDate); 
                
                }
                else{
                
                        currentText+=cArray[i].replace(/"/g, '\'');
                        //console.log(cArray[i]);
                        //console.log(cArray[i].toString());
                }
                
                //After all that, let's see what the next line is.. Need teh author, teh title, bread, summary, date...
                i++;
                if(corrective) {
                
                //i=100000000;
                }
                
        }
//        writeCSV();
//        console.log(CSV);
    }