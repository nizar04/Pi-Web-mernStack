const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Project = require('../../model/Project');
const {check, validationResult} = require('express-validator');

// @route  GET api/project/all
// @desc  get all projects
// @access Private
router.get('/all',async(req , res) => {
    try {
        const projects = await Project.find();
    
    res.json(projects);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
});

// @route  GET api/project/details
// @desc  get all projects
// @access Private
router.get('/details/:id',auth,async(req , res) => {
    try {
        const project = await Project.findById(req.params.id).populate('documentation', ['label']);
        if(!project)
        {
            return res.status(400).json({msg:'There is no project'});
        }
    res.json(project);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
});

// @route  POST api/project
// @desc  create  a project
// @access Private
router.post('/',[auth,[
    check('name','name is required').not().isEmpty(),
    check('description','description is required').not().isEmpty(),
    check('startDate','startDate is required').not().isEmpty(),
    check('endDate','endDate is required').not().isEmpty()
]],async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});   
     }
     const {
         name,
         description,
         startDate,
         endDate,
         group,
         documentation
     }= req.body;
     const projectFileds = {};
     projectFileds.projectOwner= req.user.id;
     if(name) projectFileds.name=name;
     if(description) projectFileds.description=description;
     if(startDate) projectFileds.startDate=startDate;
     if(endDate) projectFileds.endDate=endDate;
     if(group) projectFileds.group=group;
     if(documentation) projectFileds.documentation=documentation._id;
     
     
try {
  

   project = new Project(projectFileds);
   await project.save();
   res.json(project)
} catch (error) {
    console.error(error.message);
    res.status(500).send('server error');
    
}
});

// @route  PUT api/project
// @desc   update a project
// @access Private
router.put('/:id',[auth,[
    check('name','name is required').not().isEmpty(),
    check('description','description is required').not().isEmpty(),
    check('startDate','startDate is required').not().isEmpty(),
    check('endDate','endDate is required').not().isEmpty()
]],async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});   
     }
     const {
         name,
         description,
         startDate,
         endDate,
         group,
         documentation
     }= req.body;
     const projectFileds = {};
     projectFileds.projectOwner= req.user.id;
     if(name) projectFileds.name=name;
     if(description) projectFileds.description=description;
     if(startDate) projectFileds.startDate=startDate;
     if(endDate) projectFileds.endDate=endDate;
     if(group) projectFileds.group=group;
     if(documentation) projectFileds.documentation=documentation;
     
     
try {
   let project = await Project.findOne({_id: req.params.id});
   if(project) {
    project = await Project.findOneAndUpdate({_id: req.params.id},{$set: projectFileds}, {new: true});
    return res.json(project);
   }

} catch (error) {
    console.error(error.message);
    res.status(500).send('server error');
    
}
});

// @route  DELETE api/project
// @desc  delete a project
// @access Private
router.delete('/:id', auth,async(req , res) => {
    try {
        const project = await Project.findOne({_id: req.params.id});
        if(!project)
        {
            return res.status(400).json({msg:'There is no project'});
        }
    await Project.remove(project);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
});
module.exports = router;