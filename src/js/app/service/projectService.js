define([
	'app/model/canvasElement',
	'app/model/resource'
], function(CanvasElement, Resource) {

	function ProjectService($rootScope) {

		var data = {};

		var path = '';

		function resetData() {
			data = {
				name : "",
				settings : {},
				resources : [],
				canvasElements : []
			}
		}

		function create(name, dirpath, cb) {
			resetData();

			data.name = name;

			path = dirpath + "/" + name + ".rpgbossib";

			fs.writeFile(dirpath + "/" + name + ".rpgbossib", JSON.stringify(data), function(err) {
			    if(err) {
			        return cb(false,err);
			    }

			    cb(true);
			}); 
		}

		function save(filepath, cb) {

			fs.writeFile(filepath, JSON.stringify(data), function(err) {
			    if(err) {
			        return cb(false,err);
			    }

			    cb(true);
			}); 
		}

		function load(filepath, cb) {
			fs.readFile(filepath, 'utf8', function (err,filedata) {
			  if (err) {
			    return cb(false, err);
			  }
			  path = filepath;
			  data = JSON.parse(filedata);

			  cb(true);
			});
		}

		function addResource(name, filedata) {
				var index = data.resources.length;
				var res = new Resource();
				res.init(index, name, filedata);
				data.resources.push(res);
		}

		function addCanvasElement(resourceindex, x, y, scale, layer) {
				var index = data.canvasElements.length;
				var element = new CanvasElement(this);
				element.init(0, resourceindex, index, x, y,scale,layer);
				data.canvasElements.push(element);

				return element;
		}

		function reInitiateClasses() {
			var oldResources = data.resources;
			data.resources = [];
			angular.forEach(oldResources, function(resourceData, key) {
				addResource(resourceData.name, resourceData.data);
			});

			var oldCanvasElements = data.canvasElements;
			data.canvasElements = [];
			angular.forEach(oldCanvasElements, function(element, key) {
				addCanvasElement(element.resourceindex, element.x, element.y, element.scale, element.layer)
			});

			console.log(data);
		}

		return {
			create : function(name, dirpath,cb) {
				create(name, dirpath, cb);
			},
			load : function(filepath,cb) {
				resetData();
				load(filepath, function(result,err) {
					reInitiateClasses();
					cb(result,err);
				});
			},
			save : function(cb) {
				save(path, cb);
			},
			close : function() {
				resetData();
			},
			current : function() {
				return data;
			},
			addResource : function(name, filedata) {
				addResource(name, filedata);
			},
			addCanvasElement : function(resourceindex, x, y, scale, layer) {
				return addCanvasElement(resourceindex, x, y, scale, layer);
			},
			loaded : function() {
				return path != '';
			},
			setData : function(changes) {
				angular.extend(data, changes);
			},
			reset : function() {
				resetData();
			}
		}
	}

	ProjectService.$inject = ['$rootScope'];

	return ProjectService;

});