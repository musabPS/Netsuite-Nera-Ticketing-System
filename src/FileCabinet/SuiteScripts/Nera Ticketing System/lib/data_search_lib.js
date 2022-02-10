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

     return {
        getScriptLinks : getScriptLinks
     }
 });