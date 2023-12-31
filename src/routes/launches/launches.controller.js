const { response } = require('express');
const { getAllLaunches, addNewLaunch, existsLaunchWithId, abortLaunchById} = require('../../models/launches.model');

function httpGetAllLaunches(req, res){
    return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res){
    const launch = req.body;

    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target){

        return res.status(400).json({
            error: 'Missing required launch property',
        });

    }

    launch.launchDate = new Date(launch.launchDate); 
    // if(launch.launchDate.toString() === 'Invalid Date'){ // primera forma de validacion
    if(isNaN(launch.launchDate)){ // segunda forma de validacion
        return res.status(400).json({
            error: 'Invalid launch date',
        }); 
    }


    addNewLaunch(launch);
    res.status(201).json(launch);
}

function httpAbortLaunch(req, res){
    
    try{       
        const launchId = +req.params.id;
        // const launchId = Number(req.params.id);  
        // if launch doesn't exist
        if(!existsLaunchWithId(launchId)){
            return res.status(404).json({
                error: 'Launch not found',
            });
        }
    
        // if launch does exist
        else{
            const aborted = abortLaunchById(launchId);
            return res.status(200).json(aborted);
        }
    }catch(err){
        return res.status(400).json({
            error:"Ocurrio un error al obtener los datos, favor de verificar"
        })
    }


}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}