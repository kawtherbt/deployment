const dayjs = require("dayjs");
const pool = require("../db/dbConnection");
const {z} = require("zod");

const addEvent = async (req,res)=>{
    try{
        const {nom,edition,nbr_invite,type, date_debut, date_fin, address, description,client_id} = req.body;
        if(!nom||!nbr_invite||!type||!date_debut||!date_fin||!address||!client_id){
           return res.status(400).json({success: false, message : "missing data"});
        }
        
        const editionVal = edition||null;
        const descriptionVal = description||null;

        let formatted_date_debut = dayjs(date_debut);

        if(!formatted_date_debut.isValid()){
            return res.status(401).json({success:false,message:"wrong format for the starting date"});
        }

        let formatted_date_fin = dayjs(date_fin/*,"YYYY-MM-DD",true*/);

        if(!formatted_date_fin.isValid()){
            return res.status(401).json({success:false,message:"wrong format for the end date"});
        }

        if (!formatted_date_debut.isBefore(formatted_date_fin)) {
            return res.status(401).json({ success: false, message: "the start date must be before the end date" });
        }

        if(!Number.isInteger(Number(nbr_invite))){
            return res.status(401).json({success:false,message:"number of guests is not an integer"});
        }

        if(!Number.isInteger(Number(client_id))){
            return res.status(401).json({success:false,message:"client id must be an integer"});
        }
        

        const querry = "INSERT INTO evenement (nom,type,edition,nbr_invite,description,date_debut,date_fin,address,client_id) values($1, $2, $3, $4, $5, $6, $7, $8 ,$9) RETURNING *";
        const values = [nom,type,editionVal,nbr_invite, descriptionVal, formatted_date_debut, formatted_date_fin, address,client_id];

        const result = await pool.query(querry,values);
        return res.status(201).json({success: true, message : "event saved with success",data: result.rows[0]});
    }catch(error){
        console.error("error while getting the events",error);
        res.status(500).json({success: false , message:"failed to save",err:error.message});
    }
}

//some values can be "" some cant 
//problem with the date being timestamp
const updateEvent = async(req,res)=>{
    try {
        const {nom,edition,nbr_invite,type, date_debut, date_fin, address, description,client_id,ID} = req.body;
        //checking if the necessary data for the update are available
        if(!ID||([nom,nbr_invite,type,date_debut,date_fin,address,edition,description,client_id,ID].every((value)=>(value===undefined)))){
           return res.status(400).json({success: false, message : "missing data"});
        }

        if(!Number.isInteger(Number(ID))){
            return res.status(401).json({success:false,message:"id must be an integer"});
        }

        if(client_id && !Number.isInteger(Number(client_id))){
            return res.status(401).json({success:false,message:"client id must be an integer"});
        }

        if(nbr_invite&&!Number.isInteger(Number(nbr_invite))){
            return res.status(401).json({success:false,message:"number of guests is not an integer"});
        }

        if(date_debut && (dayjs(date_debut.slice(10),"YYYY-MM-DD",true)).isValid()){
            return res.status(401).json({success:false,message:"wrong format for the start date"});
        }

        if(date_fin && (dayjs(date_fin.slice(10))).isValid()){
            return res.status(401).json({success:false,message:"wrong format for the end date"});
        }

        //!!!!!!!!!!!need to fix this and put it back
        
        /*if (date_debut && date_fin && !((dayjs(date_debut.slice(10))).isBefore((dayjs(date_fin.slice(10)))))) {
            return res.status(401).json({ success: false, message: "the start date must be before the end date" });
        }*/

        const data = {nom,edition,nbr_invite,type, date_debut, date_fin, address, description,client_id}
        //filtering the undefined values
        const FilteredBody = Object.fromEntries(Object.entries(data).filter(([key,value])=>{  if((["date_debut","date_fin"].includes(key))&&value===""){return false};return (value!==undefined)}));//the "" pass through

        //extracting the columns from the filterd data
        const columns = Object.keys(FilteredBody);
        //extracting the values from the filterd data
        const values = Object.values(FilteredBody);
        
        //adding the ID to the values
        values.push(ID);

        //creating the sql query
        const columnsString = (columns.map((column,index)=>`${column}=$${index+1}`)).join(',');
        const query = `UPDATE evenement SET ${columnsString} WHERE "ID"=$${columns.length+1} `;
       
        await pool.query(query,values);
        return res.status(200).json({success:true , message:"success"});

    } catch (error) {
        console.error("error while updating the events",error);
        res.status(500).json({success:false,message:error.message,err:error.err})   
    }
}

const deleteEvent = async(req,res)=>{
    try{
        const {ID} = req.body;
        if(!ID){
            return res.status(400).json({success: false, message : "missing data"});
        }

        const query = 'DELETE FROM evenement WHERE "ID"=$1';
        const values = [ID];

        await pool.query(query,values);
        return res.status(200).json({success:true , message:"success"});
    }catch(error){
        console.error("error while deleting the events",error);
        res.status(500).json({success:false,message:"error while deleting the events",err:error.message});
    }
}

//problem with the time zone resulting in day-1
const getUPcomingEvents = async (req,res)=>{
    try{
        const decoded_token = req.decoded_token;
        if(!decoded_token){
            return res.status(400).json({success:false,message:"missing data"});
        }

        const today = dayjs().toISOString();
        //return res.status(300).json({success:false,message:"fuck dates ",today:today})

        const query = 'SELECT * FROM evenement WHERE date_debut > ($1) AND client_id IN (SELECT "ID" FROM "Clients" WHERE entreprise_id=(SELECT entreprise_id FROM accounts WHERE "ID" = $2)) ORDER BY date_debut';
        const values = [today,decoded_token.id]; 

        const data = await pool.query(query,values);
        if(!data){
            return res.status(400).json({"success":false , message:"failure"});
        }
        res.status(200).json({success:true , message:"success",data:data.rows});
    }catch(error){
        console.error("error while getting the events",error);
        res.status(500).json({success:false,message:"error while getting the events",err:error.message});
    }
}

const getEventsHistory = async(req,res)=>{
    try{
        const decoded_token = req.decoded_token;
        if(!decoded_token){
            return res.status(400).json({success:false,message:"missing data"});
        }

        const today = dayjs().format('YYYY-MM-DDTHH:mm:ss');
        //return res.status(300).json({success:false,message:"fuck dates ",today:today})

        const query = 'SELECT e."ID",e.nom as event_nom,c.nom as client_nom,date_debut as date,e.type,num_tel,email FROM evenement e JOIN "Clients" c ON c."ID"=e.client_id WHERE e.date_fin < ($1) AND c.entreprise_id=(SELECT entreprise_id FROM accounts WHERE "ID" = $2) ORDER BY date_debut';
        const values = [today,decoded_token.id]; 

        const data = await pool.query(query,values);
        if(!data){
            return res.status(400).json({"success":false , message:"failure"});
        }
        res.status(200).json({success:true , message:"success",data:data.rows});
    }catch(error){
        console.error("error while getting the events",error);
        res.status(500).json({success:false,message:"error while getting the events",err:error.message});
    }
}

const getRestOfEventsHistoryData = async(req,res)=>{
    try{
        const equipmentSchema = z.object({
            ID: z.number().int().min(1),
        });

        const result = equipmentSchema.safeParse({ID:Number(req.params.ID)});

        if (!result.success) {
            return res.status(400).json({ errors: result.error.errors });
        }

        const {ID} = result.data;

        const decoded_token = req.decoded_token;
        if(!decoded_token){
            return res.status(400).json({success:false,message:"missing data"});
        }

        const query = `SELECT ev.date_fin AS event_endDate , ev.address AS event_address , ev.description AS event_description , ev.edition AS event_edition , ev.nbr_invite AS event_nbr_invite
                        FROM evenement ev
                        WHERE ev."ID" = $1
                        AND ev.client_id = ANY(SELECT "ID" FROM "Clients" WHERE entreprise_id=(SELECT entreprise_id FROM accounts WHERE "ID" = $2))`;
        const values = [ID,decoded_token.id]; 

        const data = await pool.query(query,values);
        if(!data){
            return res.status(400).json({"success":false , message:"failure"});
        }
        res.status(200).json({success:true , message:"success",data:data.rows});
    }catch(error){
        console.error("error while getting the events",error);
        res.status(500).json({success:false,message:"error while getting the events",err:error.message});
    }
}

const getUPcomingEventsPageData = async (req,res)=>{
    try{
        const decoded_token = req.decoded_token;
        if(!decoded_token){
            return res.status(400).json({success:false,message:"missing data"});
        }

        const today = dayjs().toISOString();
        //return res.status(300).json({success:false,message:"fuck dates ",today:today})

        const query = `SELECT e."ID", e.nom AS name,e.description AS description , COUNT(DISTINCT at."ID") AS workshops, COUNT(DISTINCT ei."invite_id") AS participants , (e.date_debut::date - CURRENT_DATE) AS daysLeft
                        FROM evenement e 
                        LEFT JOIN atelier at ON at.evenement_id = e."ID"
                        LEFT JOIN evenement_invite ei ON ei.evenement_id = e."ID" 
                        WHERE date_debut > ($1) 
                        AND client_id IN (SELECT "ID" FROM "Clients" WHERE entreprise_id=(SELECT entreprise_id FROM accounts WHERE "ID" = $2)) 
                        GROUP BY e."ID"
                        ORDER BY date_debut`;
        const values = [today,decoded_token.id]; 

        const data = await pool.query(query,values);
        if(!data){
            return res.status(400).json({"success":false , message:"failure"});
        }
        res.status(200).json({success:true , message:"success",data:data.rows});
    }catch(error){
        console.error("error while getting the events",error);
        res.status(500).json({success:false,message:"error while getting the events",err:error.message});
    }
}

const getFirstPageData = async (req,res)=>{
    try{
        const decoded_token = req.decoded_token;
        if(!decoded_token){
            return res.status(400).json({success:false,message:"missing data"});
        }

        const today = dayjs().toISOString();
        //return res.status(300).json({success:false,message:"fuck dates ",today:today})

        const query = `SELECT COUNT(DISTINCT at."ID") AS workshops, COUNT(DISTINCT ei.invite_id) AS participants , COUNT(DISTINCT e."ID") AS events
                        FROM evenement e 
                        LEFT JOIN atelier at ON at.evenement_id = e."ID"
                        LEFT JOIN evenement_invite ei ON ei.evenement_id = e."ID" 
                        WHERE TO_CHAR(e.date_debut, 'YYYY-MM') = TO_CHAR(CURRENT_DATE, 'YYYY-MM') 
                        AND client_id IN (SELECT "ID" FROM "Clients" WHERE entreprise_id=(SELECT entreprise_id FROM accounts WHERE "ID" = $1)) `;
        const values = [decoded_token.id]; 

        const data = await pool.query(query,values);
        if(!data){
            return res.status(400).json({"success":false , message:"failure"});
        }
        res.status(200).json({success:true , message:"success",data:data.rows});
    }catch(error){
        console.error("error while getting the events",error);
        res.status(500).json({success:false,message:"error while getting the events",err:error.message});
    }
}

const getUPcomingEventsFirstPage = async (req,res)=>{
    try{
        const decoded_token = req.decoded_token;
        if(!decoded_token){
            return res.status(400).json({success:false,message:"missing data"});
        }

        const query = `SELECT e.nom , e.address , e.description AS description , (e.date_debut - NOW()) AS timeleft
                        FROM evenement e  
                        WHERE date_debut > NOW() 
                        AND client_id IN (SELECT "ID" FROM "Clients" WHERE entreprise_id=(SELECT entreprise_id FROM accounts WHERE "ID" = $1))
                        ORDER BY date_debut
                        LIMIT 3`;
        const values = [decoded_token.id]; 

        const data = await pool.query(query,values);
        if(!data){
            return res.status(400).json({"success":false , message:"failure"});
        }
        res.status(200).json({success:true , message:"success",data:data.rows});
    }catch(error){
        console.error("error while getting the events",error);
        res.status(500).json({success:false,message:"error while getting the events",err:error.message});
    }
}

module.exports = {addEvent,updateEvent,deleteEvent,getUPcomingEvents,getEventsHistory,getRestOfEventsHistoryData,getUPcomingEventsPageData,getFirstPageData,getUPcomingEventsFirstPage};