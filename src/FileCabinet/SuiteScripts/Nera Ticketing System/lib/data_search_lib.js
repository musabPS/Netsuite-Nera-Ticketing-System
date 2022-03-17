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
           suitelet[scriptslink[i].values["script.scriptid"]]=suiteletURL+"&username="+"&userid="
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
        ["custentity_ps_ticketingsystem_password","is",password], 
        "AND", 
        ["email","is",username]
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
   var  parseData = JSON.stringify(isFinalResult);

  return parseData


   }

   function getquestionsFromKB(searchText)
   {
     var topicSearchObj = search.create({
        type: "topic",
        filters:
        [
           ["internalid","anyof",searchText]
        ],
        columns:
        [
           search.createColumn({
              name: "name",
              sort: search.Sort.ASC,
              label: "Title"
           }),
           search.createColumn({
              name: "message",
              join: "solution",
              label: "Abstract"
           }),
           search.createColumn({
              name: "internalid",
              join: "solution",
              label: "Internal ID"
           }),
           search.createColumn({
              name: "title",
              join: "solution",
              label: "Title"
           })
        ]
       });

     var isData = topicSearchObj.run();
     var isFinalResult = isData.getRange(0, 999);
     var  parseData = JSON.stringify(isFinalResult);

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
     var  parseData =JSON.parse(JSON.stringify(isFinalResult));

     return parseData

   }

   function getTopicsforSearchKeyword()
   {

     var topicSearchObj = search.create({
        type: "topic",
        filters:
        [
        ],
        columns:
        [
           search.createColumn({
              name: "name",
              sort: search.Sort.ASC,
              label: "Title"
           })
        ]
     });

     var isData = topicSearchObj.run();
     var isFinalResult = isData.getRange(0, 999);
     var  parseData = JSON.stringify(isFinalResult);

     return parseData
   }


   function getKBFromTopics(searchKeyword)
   {
     var topicSearchObj = search.create({
        type: "topic",
        filters:
        [
           ["name","contains","Order Information"]
        ],
        columns:
        [
           search.createColumn({
              name: "name",
              sort: search.Sort.ASC,
              label: "Title"
           }),
           search.createColumn({
              name: "message",
              join: "solution",
              label: "Abstract"
           }),
           search.createColumn({
              name: "description",
              join: "solution",
              label: "Detailed Description"
           })
        ]
     });

     var isData = topicSearchObj.run();
     var isFinalResult = isData.getRange(0, 999);
     var  parseData = JSON.parse(JSON.stringify(isFinalResult));

     return parseData


   }

   function getProductList(userid)
   {
      var transactionSearchObj = search.create({
         type: "transaction",
         filters:
         [
            ["type","anyof","CashRfnd","CashSale","CustCred","CustChrg","CustInvc"], 
            "AND", 
            ["item.type","anyof","Service","OthCharge","NonInvtPart","Kit","Assembly","InvtPart"], 
            "AND", 
            ["accounttype","anyof","Income","DeferRevenue"], 
            "AND", 
            ["name","anyof","1397"]
         ],
         columns:
         [
            search.createColumn({
               name: "itemid",
               join: "item",
               summary: "GROUP",
               sort: search.Sort.ASC,
               label: "Item"
            }),
            search.createColumn({
               name: "salesdescription",
               join: "item",
               summary: "GROUP",
               label: "Description"
            }),
            search.createColumn({
               name: "internalid",
               join: "item",
               summary: "GROUP",
               label: "Internal ID"
            })
         ]
      });
      
     var isData = transactionSearchObj.run();
     var isFinalResult = isData.getRange(0, 999);
     var  parseData = JSON.parse(JSON.stringify(isFinalResult));
     var newObject=[]
     log.debug("check",parseData)
     for(var i=0; i<parseData.length; i++)
     {
         newObject.push({
         itemName:parseData[i].values["GROUP(item.itemid)"],
         itemid:parseData[i].values["GROUP(item.internalid)"][0].value
      })
     }

     return newObject
   }

   function getSerailNumber(itemid)
   {
      var itemfulfillmentSearchObj = search.create({
         type: "itemfulfillment",
         filters:
         [
            ["type","anyof","ItemShip"], 
            "AND", 
            ["item.type","anyof","Service","OthCharge","NonInvtPart","Kit","Assembly","InvtPart"], 
            "AND", 
            ["name","anyof","1397"], 
            "AND", 
            ["mainline","is","F"], 
            "AND", 
            ["item","anyof",itemid]
         ],
         columns:
         [
            search.createColumn({
               name: "serialnumbers",
               summary: "GROUP",
               label: "Serial/Lot Numbers"
            })
         ]
      });
      var isData = itemfulfillmentSearchObj.run();
      var isFinalResult = isData.getRange(0, 999);
      var  parseData = JSON.parse(JSON.stringify(isFinalResult));
      var newObject=[]
      log.debug("check",parseData)
      for(var i=0; i<parseData.length; i++)
      {
         if(parseData[i].values["GROUP(serialnumbers)"] =="- None -")
         {

         }
         else
         {
            newObject.push({
               itemSerailNumber:parseData[i].values["GROUP(serialnumbers)"],
            })
         }
        

      }
      
      return newObject


   }

   function getCustomersTicket(userid)
   {
      var supportcaseSearchObj = search.create({
         type: "supportcase",
         filters:
         [
            ["company","is","3M AAA"]  
         ],
         columns:
         [
            search.createColumn({
               name: "casenumber",
               sort: search.Sort.ASC,
               label: "Number"
            }),
            search.createColumn({name: "createddate", label: "Date Created"}),
            search.createColumn({name: "custevent_ps_ticketingsystem_casetype", label: "Case Type"}),
            search.createColumn({name: "custevent_ps_ticketingsystem_product", label: "Product"}),
            search.createColumn({name: "title", label: "Subject"}),
            search.createColumn({name: "custevent_ps_ticketingsystem_userfname", label: "User First Name"}),
            search.createColumn({name: "custevent_ps_ticketingsystem_userlname", label: "User Last Name"}),
            search.createColumn({name: "priority", label: "Priority"})
         ]
      });
      var isData = supportcaseSearchObj.run();
      var isFinalResult = isData.getRange(0, 999);
      var  parseData = JSON.parse(JSON.stringify(isFinalResult));
      log.debug("checktable",parseData[30])

         return parseData
   }

   function getTicketForEdit(internalId)
   {
      var supportcaseSearchObj = search.create({
         type: "supportcase",
         filters:
         [
            ["company","is","3M AAA"], 
            "AND", 
            ["internalid","anyof",internalId]
         ],
         columns:
         [
            search.createColumn({
               name: "casenumber",
               sort: search.Sort.ASC,
               label: "Number"
            }),
            search.createColumn({name: "createddate", label: "Date Created"}),
            search.createColumn({name: "custevent_ps_ticketingsystem_casetype", label: "Case Type"}),
            search.createColumn({name: "product", label: "Product"}),
            search.createColumn({name: "title", label: "Subject"}),
            search.createColumn({name: "custevent_ps_ticketingsystem_userfname", label: "User First Name"}),
            search.createColumn({name: "custevent_ps_ticketingsystem_userlname", label: "User Last Name"}),
            search.createColumn({name: "priority", label: "Priority"}),
            search.createColumn({name: "custevent_ps_ticketingsystem_useremail", label: "User Email "}),
            search.createColumn({name: "custevent_ps_ticketingsystem_netwrok", label: "User Network"}),
            search.createColumn({name: "custevent_ps_ticketingsystem_productgrp", label: "User Product Group"}),
            search.createColumn({name: "custevent_ps_ticketingsystem_cclist", label: "User CC List"}),
            search.createColumn({name: "custevent_ps_ticketingsystem_textarea", label: "User Text Area"}),
            search.createColumn({name: "custevent_ps_ticketingsystem_product", label: "Product"})

         ]
      });

      var isData = supportcaseSearchObj.run();
      var isFinalResult = isData.getRange(0, 999);
      var  parseData = JSON.parse(JSON.stringify(isFinalResult));
      log.debug("checktable",parseData[0])
      return parseData

   }

    return {
       getScriptLinks : getScriptLinks,
       loginSavedSearch : loginSavedSearch,
       getquestionsFromKB : getquestionsFromKB,
       getKBDetail : getKBDetail,
       getKBFromTopics : getKBFromTopics,
       getTopicsforSearchKeyword,
       getProductList,
       getSerailNumber,
       getCustomersTicket,
       getTicketForEdit
       
    }
});