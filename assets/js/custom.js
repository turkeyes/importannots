num_imgs_to_label= 0;
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
          rawFile.open("GET", 'files/'+config.hitCreation.fold);
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
    // checkStroke(info)

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

  // var rawFile = new XMLHttpRequest();
  // rawFile.onreadystatechange = function ()
  // {
  //     if(rawFile.readyState === 4)
  //     {
  //         if(rawFile.status === 200 || rawFile.status == 0)
  //         {
  //             var text = rawFile.responseText;
  //             // var allLines = text.split(/\r\n|\n/);
  //             console.log('text of sentinel file in checkstroke:',text)
  //             var sentinel_paths = JSON.parse(text)
  //             console.log('sentinel paths:', sentinel_paths)
  //
  //         }
  //     }
  // }
  // rawFile.open("GET", 'files/sentinel_paths.json');
  // rawFile.send();

  $.getJSON("jsons/sentinel_pts.json", function(json) {
    console.log(json); // this will show the info it in firebug console
  });

  IOU_THRESH = 0.55

  data = info.split(':')[1].split(',')
  name_of_img = info.split(':')[0]

  // Get points from user
  pts = data.slice(3)
  console.log('points from checkStroke:',pts)

  // If img is sentinel, get sentinel points
  if (name_of_img in list_of_sentinels) {

  }

  // Calculate IoU
  iou = get_iou(pts, sentinel_pts)

  // If no selection on an image, increase counter
  // TODO

  if (iou < IOU_THRESH) {
    // blockUser()
  }


}

function block_user() {
  // if (notQualified == true) { //failed to pass the consent form
  //    $("<input type='hidden' name='consentForm' value='notQualified'>");
  //    $(formSelector).submit();
  //    return;
  // }

}

function get_iou(pts1, pts2) {
  let path1 = paper. Path(pts1);
  let path2 = paper. Path(pts2);
  let intersection = path1.intersect(path2);
  let union = path1.union(path2);
  let ret = intersection.area/union.area;
}
