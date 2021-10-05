const router = require("express").Router();
const db = require("../models");

//get workouts
router.get("/api/workouts", (req, res) => {
    db.Workout.aggregate([{
            "$addFields": {
                "totalDuration": {
                    "$sum": "$exercises.duration"
                }
            }
    }]).then((result) => {
        res.json(result)
    })
});

// add exercise
router.put("/api/workouts/:id", (req, res) => {
    db.Workout.findByIdAndUpdate(req.params.id, {
        "$push": {
            "exercises": req.body
        }
    }, {new: true})
    .then((dbWorkout) => {
        res.json(dbWorkout);
    })

});

//create workout
router.post("/api/workouts", ({ body }, res) => {
    db.Workout.create(body)
    .then((dbWorkout => {
        res.json(dbWorkout);
    })).catch(err => {
        res.json(err);
    });
});

// get workouts in range
router.get("/api/workouts/range", (req, res) => {
    db.Workout.aggregate([{ 
        "$sort" : { day : -1} 
     },
     { 
         "$limit" : 7 
     },
     {
         "$addFields": {
             "totalDuration": {
                 "$sum": "$exercises.duration"
             }
         }
 }]).then((result) => {
         res.json(result)
     })
 });


module.exports = router;