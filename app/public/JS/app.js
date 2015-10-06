var app = angular.module('workshop', []);

//directive for google map
app.directive('googleplace', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                scope.$apply(function() {
                    model.$setViewValue(element.val());                
                });
            });
        }
    };
});

app.controller('WorkshopCtrl', function($scope, filterFilter, $http, $location){

	//an workshop exemple
	/*$scope.workshops = [
		{"title": "Atelier", 
		 "theme": "Physique",
		 "type": "Atelier Scientifique",
		 "opening_hours" : { "monday" : "8 am to 10 am" , "tuesday" : "9am to 11am"},
		 "remarks" : "remarque à propos de l'atelier" ,
		 "laboratory": "CNRS",
		 "location" : "15 rue de rivoli, Paris France",
		 "duration": "30 min",
		 "capacity": "12",
		 "inscription_type": "Sans réservation",
		 "summary" : "Résumé",
		 "animators" : [ "Jean", "Roger"],
		 "partners" : ["Partenair 1","Partenaire 2"],
		 "target_public" : "Etudiants",
		 "target_content" : "Contenu pédagogique visé" }
	];*/

	var url = "http://37.187.102.237:8080/workshop/";
	$scope.workshops = new Array();
	
    $.ajax({
    	headers :{
    		'Access-Control-Allow-Headers' : '*',
    		'Access-Control-Allow-Origin' : '*',
    		'Access-Control-Allow-Credentials' : true,
    		'Accept' : 'application/json',
    		'content-Type' : 'application/json'
    	} ,
		url : url,
		type : 'GET',
		dataType : 'json',
		success : function(json){
			json.forEach(function(elem){
				$scope.workshops.push(elem);
				$scope.$apply();
			});
		},
       	error : function(resultat, statut, erreur){
       		alert('erreur');
		}
    });
	
	//put method
	$scope.put_data = function(json){
		json = JSON.stringify(json);
	    $.ajax({
	    	headers :{
	    		'Content-Type' : 'application/json'
	    	} ,
			url : url,
			type : 'POST',
			data : json,
			success : function(data){
				return data;
			},
	       	error : function(resultat, statut, erreur){
	       		alert('erreur');
			}
	    });
	}
	
	//delete method
	$scope.delete_data = function(id){	
	    $.ajax({
	    	headers :{
	    		'Accept' : 'application/json',
	    		'content-Type' : 'application/json'
	    	} ,
			url : url + id,
			type : 'DELETE',
	       	error : function(resultat, statut, erreur){
	       		alert('erreur');
			}
	    });
	}
	
	//update method
	$scope.update_data = function(id,json){	
		json = JSON.stringify(json);
	    $.ajax({
	    	headers :{
	    		'Content-Type': 'application/json'
	    	} ,
			url : url + id,
			data : json,
			type : 'PUT',
	       	error : function(resultat, statut, erreur){
	       		alert('erreur');
			}
	    });
	}

	$scope.workshop_edit = -1;

	//raz of the form
	$scope.initForm = function(){
			$scope.new_workshop_title = '';
			$scope.new_workshop_theme = '';
			$scope.new_workshop_type = '';
			$scope.new_workshop_remarks = '';
			$scope.new_workshop_location = '';
			$scope.new_workshop_laboratory = '';
			$scope.new_workshop_duration = '';
			$scope.new_workshop_capacity = '';
			$scope.new_workshop_inscription_type = '';	
			$scope.new_workshop_summary = '';
			$scope.new_workshop_target_public = '';	
			$scope.new_workshop_target_content = '';		
	}

	$scope.initForm();

	$scope.gPlace;

	$scope.AddButtonValue = "+";
	
	//toggle form method
    $scope.showHideForm = function () {
        $scope.form_visible = !$scope.form_visible;
        if($scope.AddButtonValue == "+")
        	$scope.AddButtonValue = "-";
        else
        	$scope.AddButtonValue = "+";
    };

	$scope.showForm = function(){
        $scope.form_visible = true;
        $scope.AddButtonValue = "-";	
	}

	$scope.index_appointment = 0;
	$scope.week = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi"];
	$scope.disponibilities = ["Matin","Après midi","Matin et Après midi"];

	//we watch the length of the workshop
	$scope.$watch('workshops', function(){
		$scope.remaining = filterFilter($scope.workshops).length;
	}, true)

	//remove a workshop
	$scope.removeWorkshop = function(index){
		//remove to the list
		$scope.workshops.splice(index,1);
		//remove to data base
		$scope.delete_data($scope.workshops[index]._id);
	}
	
	//add a workshop
	$scope.addWorkshop = function(){
		if($scope.new_workshop_title == "" ||  
			$scope.new_workshop_theme == "" ||
			$scope.new_workshop_type == "" ||
			$scope.new_workshop_remarks == "" ||
			$scope.new_workshop_location == "" ||
			$scope.new_workshop_laboratory == "" ||
			$scope.new_workshop_duration == "" ||
			$scope.new_workshop_summary == "" ||
			$scope.new_workshop_target_public == "" ||
			$scope.new_workshop_target_content == "" ||
			$scope.new_workshop_capacity == "")
			alert('Formulaire incomplet !');
		else{
			var workshop_id = 0;
			if($scope.workshop_edit != -1) // if we are in the edit mode
				workshop_id = $scope.workshops[$scope.workshop_edit]._id;
				
			var workshop_json = {
				_id : workshop_id,
				title : $scope.new_workshop_title,
				theme : $scope.new_workshop_theme,
				type : $scope.new_workshop_type,
				remarks : $scope.new_workshop_remarks,
				location : $scope.new_workshop_location,
				laboratory : $scope.new_workshop_laboratory,
				duration : $scope.new_workshop_duration,
				capacity : $scope.new_workshop_capacity,
				inscription_type : $scope.new_workshop_inscription_type,
				summary : $scope.new_workshop_summary,
				target_public : $scope.new_workshop_target_public,
				target_content : $scope.new_workshop_target_content } ;
		
			if($scope.workshop_edit == -1){
				//add to data base
				var new_workshop = $scope.put_data(workshop_json);
				//add to the list
				$scope.workshops.push(new_workshop);
			}
			else{
				//edit to the list
				$scope.workshops[$scope.workshop_edit] = workshop_json;
				//edit the workshop to the data base
				var json_copy = JSON.parse(JSON.stringify(workshop_json));
				delete json_copy._id;
				$scope.update_data($scope.workshops[$scope.workshop_edit]._id, json_copy);
				
				//we go back to the edition mode			
				$scope.workshop_edit = -1;
			}
			
			$scope.initForm();
		}	
	}
	
	//Edit a workshop
	$scope.edit = function(index){
		$scope.workshop_edit = index;
		window.scrollTo(0,0);
		$scope.showForm();
		
		$('#new_workshop_title').val($scope.workshops[index].title); // update input
		$scope.new_workshop_title = $scope.workshops[index].title; // update scope value
		
		$('#new_workshop_theme').val($scope.workshops[index].theme);
		$scope.new_workshop_theme = $scope.workshops[index].theme;
		
		$('#new_workshop_type').val($scope.workshops[index].type);
		$scope.new_workshop_type = $scope.workshops[index].type;
		
		$('#new_workshop_remarks').val($scope.workshops[index].remarks);
		$scope.new_workshop_remarks = $scope.workshops[index].remarks;

		$('#new_workshop_location').val($scope.workshops[index].location);
		$scope.new_workshop_location = $scope.workshops[index].location;

		$('#new_workshop_laboratory').val($scope.workshops[index].laboratory);
		$scope.new_workshop_laboratory = $scope.workshops[index].laboratory;

		$('#new_workshop_duration').val($scope.workshops[index].duration);
		$scope.new_workshop_duration = $scope.workshops[index].duration;

		$('#new_workshop_capacity').val($scope.workshops[index].capacity);
		$scope.new_workshop_capacity = $scope.workshops[index].capacity;

		$('#new_workshop_inscription_type').val($scope.workshops[index].inscription_type);
		$scope.new_workshop_inscription_type = $scope.workshops[index].inscription_type;

		$('#new_workshop_summary').val($scope.workshops[index].summary);
		$scope.new_workshop_summary = $scope.workshops[index].summary;

		$('#new_workshop_target_public').val($scope.workshops[index].target_public);
		$scope.new_workshop_target_public = $scope.workshops[index].target_public;

		$('#new_workshop_target_content').val($scope.workshops[index].target_content);
		$scope.new_workshop_target_content = $scope.workshops[index].target_content;

	}
	
});
