/**
 * @NApiVersion 2.1
 * @NModuleScope public
 * @description This file contains all the saved searches for the project.
 */
 
 define([
    'N/render',
    'N/file',
    'N/search', 
    'N/redirect', 
    'N/url', 
    'N/https',
  ], function (render, file, search, redirect, url, https){

     function getScriptLinks()
    {
      var scriptdeploymentSearchObj = search.create({
         type: "scriptdeployment",
         filters:
         [
            ["script.scriptid","startswith","customscript_sl_ticketingsystem"], 
            "AND", 
            ["script.scripttype","anyof","SCRIPTLET"]
         ],
         columns:
         [
            search.createColumn({
               name: "scriptid",
               join: "script",
               label: "Script ID"
            }),
            search.createColumn({name: "script", label: "Script ID"}),
            search.createColumn({name: "internalid", label: "Internal ID"})
         ]
      });
       var isData = scriptdeploymentSearchObj.run();
       var isFinalResult = isData.getRange(0, 999);
       var scriptslink = JSON.parse(JSON.stringify(isFinalResult));

      

       suitelet={}
       
       
       for(var i=0; i<scriptslink.length; i++)
       {
                 log.audit("checklink list in data",scriptslink[i].values)
   
           var suiteletURL = url.resolveScript({
               scriptId: scriptslink[i].values["script"][0].value,
              deploymentId: "1",
               returnExternalUrl: true
             })

              log.debug("suiteletlink",suiteletURL)
            suitelet[scriptslink[i].values["script.scriptid"]]=suiteletURL+"&username="
       }
       
       return suitelet 

    }

    function loginSavedSearch(username,password)
    {
       var customerSearchObj = search.create({
      type: "customer",
      filters:
      [
         ["custentity_ps_neraticketing_accesscheck","is","T"], 
         "AND", 
         ["custentity_ps_ticketingsystem_password","is","12345678"]
      ],
      columns:
      [
         search.createColumn({name: "internalid", label: "Internal ID"}),
         search.createColumn({
            name: "entityid",
            sort: search.Sort.ASC,
            label: "Name"
         })
      ]
   });
    var isData = customerSearchObj.run();
    var isFinalResult = isData.getRange(0, 999);
    var  parseData = JSON.parse(JSON.stringify(isFinalResult));

   return parseData


    }

    function getquestionsFromKB(searchText)
    {
      var solutionSearchObj = search.create({
         type: "solution",
         filters:
         [
            ["status","anyof","APPROVED","UNAPPROVED"], 
            "AND", 
            ["abstract","contains",searchText]
         ],
         columns:
         [
            search.createColumn({
               name: "name",
               join: "topic",
               label: "Title"
            }),
            search.createColumn({
               name: "solutioncode",
               sort: search.Sort.ASC,
               label: "Code"
            }),
            search.createColumn({name: "title", label: "Title"}),
            search.createColumn({name: "message", label: "Abstract"}),         ]
      });

      var isData = solutionSearchObj.run();
      var isFinalResult = isData.getRange(0, 999);
      var  parseData = JSON.parse(JSON.stringify(isFinalResult));

      return parseData


    }

    function getKBDetail(internalid)
    {
      var solutionSearchObj = search.create({
         type: "solution",
         filters:
         [
            ["status","anyof","APPROVED","UNAPPROVED"], 
            "AND", 
            ["internalid","anyof",internalid]
         ],
         columns:
         [
            search.createColumn({
               name: "solutioncode",
               sort: search.Sort.ASC,
               label: "Code"
            }),
            search.createColumn({name: "title", label: "Title"}),
            search.createColumn({name: "message", label: "Abstract"}),
            search.createColumn({name: "description", label: "Detailed Description"}),
            search.createColumn({name: "previewref", label: "Preview"}),
            search.createColumn({name: "status", label: "Status"})
         ]
      });

      var isData = solutionSearchObj.run();
      var isFinalResult = isData.getRange(0, 999);
      var  parseData = JSON.parse(JSON.stringify(isFinalResult));

      return parseData

    }

     return {
        getScriptLinks : getScriptLinks,
        loginSavedSearch : loginSavedSearch,
        getquestionsFromKB : getquestionsFromKB,
        getKBDetail : getKBDetail
        
     }
 });