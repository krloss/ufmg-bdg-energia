const Location = require('../models/Location');

module.exports = {
    async index(req,res) {
        const {coordinates} = req.query;
        
        if(!coordinates || 3 > coordinates.length)
            return res.status(400).json({
                hasErrors:true,
                errors:[
                    {code:'AL3PAR', message:'At least 3 points are required.'}
                ]
            });
        
        const points = coordinates.map(it => it.split(/\s+/));
        const geometry = {type:'Polygon', coordinates:[[...points,points[0]]]};
        const locations = await Location.find().where('location').within(geometry);

        return res.json(locations);
    },
    async save(req,res) {
        const {latitude,longitude,address,classification,description} = req.body;

        const location = await Location.create({
            address,classification,description,
            location:{type:'Point', coordinates:[latitude,longitude]}
        });
        
        return res.json({hasErrors:false, result:location});
    }
}
