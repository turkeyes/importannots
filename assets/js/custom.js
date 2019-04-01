num_imgs_to_label= 0;
failed_sentinels=0;
no_stroke_counter=0;
var custom = {

    num_imgs_to_label: 0,
    imgs_to_label: null,

    loadTasks: function(numSubtasks) {
        /*
         * This function is called on page load and should implement the promise interface
         *
         * numSubtasks - int indicating what length array to return (how many subtasks this task should have)
         *
         * returns: if config.meta.aggregate is set to false, an array of objects with length config.meta.numTasks,
         * one object for each task; else, an object that will be made available to all subtasks
         */

         // var fold = gup("fold")
         //  if (fold == ''){
         //    fold =1
         //  }
         //  console.log('fold:',fold)
         //
         //  return $.getJSON("folds_to_imgs.json").done(function(folds_to_imgs) {
         //
         //    var imgs_to_load = folds_to_imgs[fold]
         //    console.log('imgs_to_load:',imgs_to_load)
         //
         //    this.images_to_label = new Array()
         //
         //    for (i=0; i<imgs_to_load.length; i++) {
         //          this.images_to_label[i] = new Image();
         //          this.images_to_label[i].src = imgs_to_load[i];
         //    }
         //
         //    this.num_images_to_label = this.images_to_label.length
         //
         //
         //    console.log('End of loadTasks. Returning [this.images_to_label, this.num_images_to_label]:',[this.images_to_label, this.num_images_to_label])
         //
         //    return this.images_to_label;
         //
         //  }.bind(this));

         paper.setup();

         return $.get("").then(function() {


           // GETTING NUMBER OF IMAGES IN THIS FOLD

          var rawFile = new XMLHttpRequest();
          rawFile.onreadystatechange = function ()
          {
              if(rawFile.readyState === 4)
              {
                  if(rawFile.status === 200 || rawFile.status == 0)
                  {
                      var text = rawFile.responseText;
                      var allLines = text.split(/\r\n|\n/);
                      console.log(allLines)
                      num_imgs_to_label = allLines.length
                      if (num_imgs_to_label > 24) {
                        throw "NUM IMGS TO LABEL IS TOO HIGH! REDUCE TO LESS THAN 24";
                      }
                      console.log('num_imgs_to_label',num_imgs_to_label)
                  }
              }
          }
          rawFile.open("GET", 'files/'+gup('url'));
          rawFile.send();

            return [];
        });

    },
    showTask: function(taskInput, taskIndex, taskOutput) {
        /*
         * This function is called when the experiment view is unhidden
         * or when the task index is changed
         *
         * taskInput - if config.meta.aggregate is false, the object in the array from loadTasks
         *   corresponding to subtask taskIndex; else, the input object from loadTasks
         * taskIndex - the number of the current subtask
         * taskOutput - a partially filled out task corresponding to the subtask taskIndex
         *   If config.meta.aggregate is set to false, this is the results object for the current
         *   subtask. If config.meta.aggregate is set to true, this is the results object for the
         *   entire task.
         *
         * returns: None
         */

        // $(".exp-data").text("Input for task " + taskInput.toString());
        // $("#exp-input").val(taskOutput);
        // $("#exp-input").focus();
        // if (taskIndex == 1) {
        //     hideIfNotAccepted();
        // }

        return;
    },
    collectData: function(taskInput, taskIndex, taskOutput) {
        /*
         * This function should return the experiment data for the current task
         * as an object.
         *
         * taskInput - if config.meta.aggregate is false, the object in the array from loadTasks
         *   corresponding to subtask taskIndex; else, the input object from loadTasks
         * taskIndex - the number of the current subtask
         * taskOutput - outputs collected for the subtask taskIndex
         *   If config.meta.aggregate is set to false, this is the results object for the current
         *   subtask. If config.meta.aggregate is set to true, this is the results object for the
         *   entire task.
         *
         * returns: if config.meta.aggregate is false, any object that will be stored as the new
         *   taskOutput for this subtask in the overall array of taskOutputs. If
         *   config.meta.aggregate is true, an object with key-value pairs to be merged with the
         *   taskOutput object.
         */

         // Add strokes saved in the strokes html element to array, then return global variable.


       const NUM_STROKES = 24
       strokes=new Array;

        for (i=0; i<NUM_STROKES; i++) {
          stroke_value = document.getElementById('strokes'+i).value

          console.log('stroke i at CollectData time:', i, stroke_value)
          if (stroke_value != '') {
              // console.log('stroke pushed')
              strokes.push(stroke_value)
          }

        }

         return strokes;
    },

    validateTask: function(taskInput, taskIndex, taskOutput) {
        /*
         * This function should return a falsey value if data stored in taskOutput is valid
         * (e.g. fully filled out), and otherwise an object {errorMessage: "string"}
         * containing an error message to display.
         *
         * If the errorMessage string has length 0, the data will still be marked as invalid and
         * the task will not be allowed to proceed, but no error message will be displayed (for
         * instance, if you want to implement your own error announcement).
         *
         * taskInput - if config.meta.aggregate is false, the object in the array from loadTasks
         *   corresponding to subtask taskIndex; else, the input object from loadTasks
         * taskIndex - the number of the current subtask
         * taskOutput - outputs collected for the subtask taskIndex
         *   If config.meta.aggregate is set to false, this is the results object for the current
         *   subtask. If config.meta.aggregate is set to true, this is the results object for the
         *   entire task
         *
         * returns: falsey value if the data is valid; otherwise an object with a field "errorMessage"
         *    containing a string error message to display.
         */

         console.log('Entering ValidateTask. taskOutput length is:', taskOutput.length)
         console.log('num_imgs_to_label in ValidateTask',num_imgs_to_label)

        // Checking validity: Task valid only if ALL IMAGES are annotated
        valid = false


        if (taskOutput.length >= num_imgs_to_label) {
          for (i=0; i<taskOutput.length; i++){
            if (taskOutput[i].split(':')[1].length > 0) {
              valid = true
            }
          }
        }

        // console.log('valid:',valid)

        // Return null if task is valid
         if (valid) {
           return null;
         } else {
           console.log('HIT invalid, returning error message')
           var msg = "Can't submit yet!  You have not completed the HIT as you have not annotated all images. Click Next to go to the next image. You will be able to Submit when the 'Next' button becomes unclickable and the message 'Hit Complete. Please Submit' appears in the interface.";
           // console.log(msg)
           return msg;
         }
    }
};

function setStrokeInfo(imgNum, info) {


    console.log('Stroke info:', imgNum, info)
    // IOU check for stroke info
    checkStroke(info)

    document.getElementById('strokes' + imgNum).value = info;

}


function getFlashMovie(movieName) {
    var isIE = navigator.appName.indexOf("Microsoft") != -1;
    return (isIE) ? window[movieName] : document[movieName];
}


function modFlashMovie() {

    alert('here')
        //getFlashMovie('impdraw').sendTextToFlash('test1');
    document.getElementById('impdraw').loadImageList(gup('url'));
    document.getElementById('impdraw').startDrawing();

}


function getImageTime() {
    return '60';
}

function checkStroke(info) {

  // console.log('CHECKSTROKE CALLED WITH INFO:', info)

  $.getJSON("jsons/sentinel_pts.json", function(sentinel_json) {

    IOU_THRESH = 0.55
    MAX_FAILURES_ALLOWED = 1
    MAX_NOSTROKE_ALLOWED = 2

    data = info.split(':')[2].split(';')[0].split(',')
    url_split = info.split(':')[1].split('/')
    name_of_img = url_split[url_split.length-1].split('?')[0]
    img_w = parseInt(info.split(',')[0])
    img_h = parseInt(info.split(',')[1])
    // console.log('name_of_img, img_w, img_h',name_of_img, img_w, img_h)

    // If no selection on an image, increase counter
    // console.log('Checking nostroke with data:', data, data.length)
    if (data === undefined || data.length == 1) {
      no_stroke_counter+=1
      // console.log('No stroke found for this image. Counter is now:', no_stroke_counter)
      if (no_stroke_counter > MAX_NOSTROKE_ALLOWED) {
        blockUser()
        return;
      }
    }

    // Get points from user
    pts = data.slice(3).map(d=>parseFloat(d));

	   // If img is sentinel, get sentinel points and calculate IoU
  	if (sentinel_json[name_of_img]){
        // console.log('IMAGE IS SENTINEL')
    		let sentinel_pts = sentinel_json[name_of_img];

        sentinel_pts = sentinel_pts.map(e => {return e+10})

        let iou = get_iou(pts, sentinel_pts, weighted=true, img_w=img_w, img_h=img_h)

        // console.log('Visualizing paths')
        // visualize_paths(pts, sentinel_pts)
        // console.log('IoU:', iou)
    		if (iou < IOU_THRESH) {
          failed_sentinels+=1
          // console.log('Sentinel check failed. counter is now:', failed_sentinels)
          if (failed_sentinels > MAX_FAILURES_ALLOWED) {
      			blockUser()
            return;
          }
    		}

	   }



  });

}


function blockUser() {

  // console.log('USER SHOULD BE BLOCKED')


  $('#experiment').hide();
  $("#submit-button").addClass("disabled");
  $("#submit-button").hide();
  $("#feedback-input").hide();
  $('#fail-msg').css("font-size", "1.8em");
  $('#fail-msg').show();


  // Show message that forces them to reload

  // if (notQualified == true) { //failed to pass the consent form
  //    $("<input type='hidden' name='consentForm' value='notQualified'>");
  //    $(formSelector).submit();
  //    return;
  // }

}


function sigmoid(x) {
  return 1 / (1 + Math.exp(-x))
}

function get_iou(pts1, pts2, weighted=true, img_w=null, img_h=null) {
  // console.log('Types of pts1, sentinel_pts:')
  // console.log(typeof pts1)
  // console.log(typeof pts2)
  // console.log('pts1.length',pts1.length)
  // console.log('sentinel_pts.length',pts2.length)
  // console.log('pts1','M'+pts1.join()+'z')
  // console.log('sentinel_pts','M'+pts2.join()+'z')

  str_pts1 = 'M'+pts1.join()+'z'
  str_pts2 = 'M'+pts2.join()+'z'

  var path1 = new paper.Path(str_pts1);
  var path2 = new paper.Path(str_pts2);
  var union = path1.unite(path2);
  var intersection = path1.intersect(path2);
  var iou = intersection.area/union.area;


  // console.log('------ Calculated IoU:', iou)
  if (weighted) {
    gt_area = -path2.area
    // console.log('------ gt area:', gt_area)
    full_area = img_w*img_h
    // console.log('------ full area:', full_area)
    weight = sigmoid(0.35*full_area/(gt_area+1)-7)
    iou = iou + 0.1*weight
  }

  // console.log('------ WEIGHT:', weight)
  // console.log('------ WEIGHTED IoU:', iou)
  return iou
}


function get_iou_pairs(pts1, pts2) {
  // Calculate IoU
  let pair = points =>{
  	let pairs = [];
  	for (let i=1; i<points.length; i+=2){
  		pairs.push([points[i-1], points[i]]);
  	}
  	return pairs;
  }
  pts1 = pair(pts1)
  pts2 = pair(pts2)
	let path1 = new paper.Path(pts1);
	let path2 = new paper.Path(pts2);
	let intersection = path1.intersect(path2);
	let union = path1.unite(path2);
	return intersection.area/union.area;

}

function visualize_paths(pts1, pts2) {
  let pair = points =>{
    let pairs = [];
    for (let i=1; i<points.length; i+=2){
      pairs.push([points[i-1], points[i]]);
    }
    return pairs;
  }
  pts1 = pair(pts1)
  pts2 = pair(pts2)

  // pts1 = 'M'+pts1.join()+'z'
  // pts2 = 'M'+pts2.join()+'z'

	paper.setup(document.getElementById('myCanvas'));

	let path1 = new paper.Path({
		segments:pts1,
		fillColor:'red',
		opacity:0.5,
		closed:true
	});
	let path2 = new paper.Path({
		segments:pts2,
		fillColor:'blue',
		opacity:0.5,
		closed:true

	});

	console.log(path1, path2)

}
