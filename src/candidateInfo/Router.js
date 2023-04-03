const express=require('express')

const Router=express.Router();

const {getCourses,getAdmission,getFacility,postCandidateInfo,getCandidateInfo,deleteCandidateInfo,getEditCandidateInfo,updateCandidateInfo}=require('./Controller')



Router.get('/getCourses',getCourses)//PS_FPL_7

Router.get('/getAdmission',getAdmission)//PS_FPL_19

Router.get('/getFacility',getFacility)//PS_FPL_31

Router.post('/postCandidateInfo',postCandidateInfo) //PS_OC_10

Router.post('/getCandidateInfo',getCandidateInfo) //PS_PL_8

Router.put('/deleteCandidateInfo/:id',deleteCandidateInfo) //PS_DL_7

Router.get('/getEditCandidateInfo/:id',getEditCandidateInfo) //PS_FPL_45

Router.put('/updateCandidateInfo/:id',updateCandidateInfo) //PS_OC_20














module.exports={Router}