const router = require("express").Router();
const Workout = require("../models/workout.js");

//get workouts
router.get("/api/workouts", (req, res) => {
    Workout.aggregate([{
            $addFields: {
                totalDuration: {
                    $sum: "$exercises.duration"
                }
            }
    }])
    .then((result) => {
        res.json(result)
    })
    .catch((err) => {
        res.status(400).res.json(err);
    });
});

// add exercise
router.put("/api/workouts/:id", (req, res) => {
    Workout.findByIdAndUpdate(req.params.id, {
        $push: {
            exercises: req.body
        }
    }, {new: true, runValidators: true })
    .then((dbWorkout) => {
        res.json(dbWorkout);
    })
    .catch((err) => {
        res.status(400).res.json(err);
      });
});

//create workout
router.post("/api/workouts", ({ body }, res) => {
    Workout.create(body)
    .then((dbWorkout => {
        res.json(dbWorkout);
    }))
    .catch((err) => {
        res.status(400).res.json(err);
    });
});

// get workouts in range
router.get("/api/workouts/range", (req, res) => {
    Workout.aggregate([{ 
        $sort : { day : -1} 
     },
     { 
         $limit : 7 
     },
     {
         $addFields: {
            totalDuration: {
                 $sum: "$exercises.duration"
            },
            totalWeight: { 
                 $sum: '$exercises.weight' 
            },
         }
    }])
    .then((result) => {
        res.json(result)
    })
    .catch((err) => {
        res.status(400).res.json(err);
    }); 
 });


module.exports = router;