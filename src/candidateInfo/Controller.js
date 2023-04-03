const mssql = require('mssql')
//PS_PL_9
//PS_DL_8
//PS_FPL_8
//PS_FPL_20
//PS_FPL_32
//PS_FPL_46
//PS_OC_21


//database connecting authorization
const db = new mssql.ConnectionPool({
    server: 'localhost',
    database: 'CandidateInfo',
    user: 'sa',
    password: 'Admin@123',
    options: {
        trustServerCertificate: true
    }
})

//dropdown DB hit
//PS_FPL_9
const getCourses = async (req, res) => {
    //connect the DB
    await db.connect()

    //send the query to the DB
    let result = await db.query(`select * from courses`);

    await db.close()

    //send the response back
    res.send(result);
}

//radiobutton DB hit
//PS_FPL_21
const getAdmission = async (req, res) => {
    //connect the DB
    await db.connect()

    //send the query to the DB
    let result = await db.query(`select * from admissionMode`);

    await db.close()

    //send the response back
    res.send(result);
}

//checkbox DB hit
//PS_FPL_33
const getFacility = async (req, res) => {
    //connect the DB
    await db.connect()

    //send the query to the DB
    let result = await db.query(`select * from facilities`);

    await db.close()

    //send the response back
    res.send(result);
}

//for inserting new data to the table
//PS_OC_12
const postCandidateInfo = async (req, res) => {
    
    //connect the DB
    await db.connect()

    //send the query to the DB
    var responseId = await db.query(`insert into candidates (firstName,lastName,dateOfBirth,
        courseId,admissionModeId,issuesFaced) output inserted.candidateId
        values('${req.body.firstName}','${req.body.lastName}','${req.body.dateOfBirth}',${req.body.courseId},${req.body.admissionModeId},'${req.body.issuesFaced}')`);

    for(let id of req.body.facId){
         var result=await db.query(`insert into facilitiesBox (candidateId,facId)values(${responseId.recordset[0].candidateId},${id})`)
    }

    await db.close()

    //send the response back
    console.log(result);
    res.send(result);
}

//for getting data to populate to the table
//PS_PL_10
const getCandidateInfo = async (req, res) => {
    //connect the DB
    await db.connect()
    
    let recordsPerPage=2;
    
    //select * from candidas
    //[1,2,3,4]
    //loop
    //send the query to the DB
    let response=await db.query(`select * from candidates Ca  inner join courses Co on Co.courseId=Ca.courseId
    inner join admissionMode Am on Am.admissionModeId=Ca.admissionModeId   where Ca.firstName+''+Ca.lastName LIKE '%${req.query.name}%' and isActive=1
    order by ${req.body.sort.column} ${req.body.sort.id} offset ${req.body.offset * recordsPerPage} rows fetch next ${recordsPerPage} rows only`) ;
    let length=response.recordset.length;
    
    let response1=await db.query(`select * from candidates Ca  inner join courses Co on Co.courseId=Ca.courseId
    inner join admissionMode Am on Am.admissionModeId=Ca.admissionModeId   where Ca.firstName+''+Ca.lastName LIKE '%${req.query.name}%' and isActive=1`)
    let totalRecords=response1.recordset.length;

    if(totalRecords!=0){
    response.recordset[0].records=totalRecords
    }
    

    for(let i=0;i<length;i++){
        let facId=await db.query(`select * from facilitiesBox Fb inner join facilities Fc on Fc.facId=Fb.facId where candidateId=${response.recordset[i].candidateId}`)
        
        let facility=facId.recordset.map((fac)=>{
            return fac.facilities
        })
       
        
        response.recordset[i].facId=facility;
    
    }
    
    await db.close()

    //send the response back
    res.send(response);
}

//for deleting data
//PS_DL_9
const deleteCandidateInfo = async (req, res) => {
    //connect the DB
    await db.connect()

    //send the query to the DB
    let result = await db.query(`update candidates set isActive=0 where candidateId=${req.params.id}`);

    await db.close()

    //send the response back
    res.send(result);
}

//for getting the data of the candidate to be edited
//PS_FPL_47
const getEditCandidateInfo = async (req, res) => {
    //connect the DB
    await db.connect()

    let result = await db.query(`select * from candidates Ca where Ca.candidateId=${req.params.id}`)

    //send the query to the DB
    await db.close()

    await db.connect()
    let result1 = await db.query(`select * from facilitiesBox where candidateId=${req.params.id}  `)
    await db.close()

    let facId=result1.recordset.map((values)=>{
        return values.facId                            //taking only the facId from the response of the 2nd query and storing it to the variable facId
    });

    result.recordset[0].facId = facId                 //creating new key facId inside the response of the 1st query and setting the value for it as facId we got from the 2nd query
   
    //send the response back
    res.send(result)
}

//for updating existing data to the table
//PS_OC_22
const updateCandidateInfo = async (req, res) => {
    
    //connect the DB
    await db.connect()

    //send the query to the DB
    var response = await db.query(`update candidates set firstName='${req.body.firstName}',lastName='${req.body.lastName}',dateOfBirth='${req.body.dateOfBirth}',courseId=${req.body.courseId},admissionModeId=${req.body.admissionModeId},issuesFaced='${req.body.issuesFaced}' where candidateId=${req.params.id}`);
    
    var response1= await db.query(` delete from facilitiesBox where candidateId=${req.params.id}`)

    for(let id of req.body.facId){
         var result=await db.query(`insert into facilitiesBox (candidateId,facId)values(${req.params.id},${id})`)
    }

    await db.close()

    //send the response back
    
    res.send(result);
}





module.exports = { getCourses, getAdmission, getFacility, postCandidateInfo, getCandidateInfo,deleteCandidateInfo,getEditCandidateInfo,updateCandidateInfo }










