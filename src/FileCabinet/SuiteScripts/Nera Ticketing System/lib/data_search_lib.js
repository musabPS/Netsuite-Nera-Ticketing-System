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
        }),
        search.createColumn({name: "firstname", label: "First Name"}),
        search.createColumn({name: "lastname", label: "Last Name"}),
        search.createColumn({name: "email", label: "Email"})
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
            }),
            search.createColumn({
               name: "custitem_vis_itemcat",
               join: "item",
               summary: "GROUP",
               label: "Item Category"
            })
         ]
      });
      
     var isData = transactionSearchObj.run();
     var isFinalResult = isData.getRange(0, 999);
     var  parseData = JSON.stringify(isFinalResult);
   //   var newObject=[]
   //   log.debug("check",parseData)
   //   for(var i=0; i<parseData.length; i++)
   //   {
   //       newObject.push({
   //       itemName:parseData[i].values["GROUP(item.itemid)"],
   //       itemid:parseData[i].values["GROUP(item.internalid)"][0].value
   //    })
   //   }

     return parseData
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
            ["company.internalid","anyof",userid],   // lkn jb ye krta hn tou display ni hota
          // ["company","is","3M AAA"],     jb me ye open krta hn data display hojata hy
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
     log.debug("checktable",parseData[0])

         return parseData
   }

   function getTicketForEdit(internalId,userid,coulmns)
   {

      log.debug("check allcolumns",coulmns)
      var supportcaseSearchObj = search.create({
         type: "supportcase",
         filters:
         [
            ["company.internalid","anyof",userid],
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
            search.createColumn({name: "custevent_ps_ticketingsystem_product", label: "Product"}),
            search.createColumn({name: "assigned", label: "Assigned To"})
         ]
      });

      var isData = supportcaseSearchObj.run();
      var isFinalResult = isData.getRange(0, 999);
      var  parseData = JSON.parse(JSON.stringify(isFinalResult));
      log.debug("checktable",parseData[0])
      return parseData

   }
   function getTicketForEdit_ForDynamicFields(internalId,userid,coulmns)
   {

      log.debug("check allcolumns",coulmns)

        var columnsArray=[
          "casenumber",
          "createddate", 
          "custevent_ps_ticketingsystem_casetype", 
          "product", 
          "title", 
          "assigned",
          "custevent_ps_ticketingsystem_product",
          "custevent_ps_ticketingsystem_textarea", 
          "priority", 
        ]

        for(var i=0; i<coulmns.length;i++)
        {
          columnsArray.push(
             coulmns[i].values.custrecord_ps_support_fieldid
             )
        }

        log.debug("columns Data",columnsArray)
       
       //  search.createColumn({name: "custevent_ps_ticketingsystem_userfname", label: "User First Name"})

      var supportcaseSearchObj = search.create({


         type: "supportcase",
         filters:
         [
            ["company.internalid","anyof",userid],
            "AND", 
            ["internalid","anyof",internalId]
         ],
         columns: columnsArray
         
      });

      var isData = supportcaseSearchObj.run();
      var isFinalResult = isData.getRange(0, 999);
      var  parseData = JSON.parse(JSON.stringify(isFinalResult));
      log.debug("checktable",parseData[0])
      return parseData

   }

   function countAllSatus(userid)
   {
      var supportcaseSearchObj = search.create({
         type: "supportcase",
         filters:
         [
            ["status","anyof","1","5","2"], 
            "AND", 
          //  ["company","contains",name]
          ["company.internalid","anyof",userid]
         ],
         columns:
         [
            search.createColumn({
               name: "internalid",
               summary: "COUNT",
               label: "Internal ID"
            }),
            search.createColumn({
               name: "status",
               summary: "GROUP",
               label: "Status"
            })
         ]
      });

      
      var isData = supportcaseSearchObj.run();
      var isFinalResult = isData.getRange(0, 999);
      var  parseData = JSON.parse(JSON.stringify(isFinalResult));
      log.debug("checktable",parseData)
      return parseData

   }

   function ticketsRecentActivites(name)
   {
      var supportcaseSearchObj = search.create({
         type: "supportcase",
         filters:
         [
            ["company","haskeywords",name], 
            "AND", 
            ["time.item","noneof","@NONE@"]
         ],
         columns:
         [
            search.createColumn({
               name: "casenumber",
               summary: "GROUP",
               sort: search.Sort.ASC,
               label: "Number"
            }),
            search.createColumn({
               name: "item",
               join: "time",
               summary: "GROUP",
               label: "Item"
            }),
            search.createColumn({
               name: "memo",
               join: "time",
               summary: "GROUP",
               label: "Note"
            }),
            search.createColumn({
               name: "status",
               summary: "GROUP",
               label: "Status"
            })
         ]
      });

      
      var isData = supportcaseSearchObj.run();
      var isFinalResult = isData.getRange(0, 10);
      var  parseData = JSON.parse(JSON.stringify(isFinalResult));
     // log.debug("checktable",parseData)


     // return parseData



   }

   function totalTickets(userid)
   {
      var supportcaseSearchObj = search.create({
         type: "supportcase",
         filters:
         [
            ["company.internalid","anyof",userid],
         ],
         columns:
         [
            search.createColumn({
               name: "company",
               summary: "GROUP",
               label: "Company"
            }),
            search.createColumn({
               name: "internalid",
               summary: "COUNT",
               label: "Internal ID"
            })
         ]
      });
      var isData = supportcaseSearchObj.run();
      var isFinalResult = isData.getRange(0, 10);
      var  parseData = JSON.parse(JSON.stringify(isFinalResult));
   //   log.debug("checktable",parseData)

      return parseData

   }

   function employeeSentOnPerTicket_TicketsProgress(userid)
   {
      var supportcaseSearchObj = search.create({
         type: "supportcase",
         filters:
         [
            ["company.internalid","anyof",userid],
            "AND", 
            ["time.employee","noneof","@NONE@"]
         ],
         columns:
         [
            search.createColumn({
               name: "employee",
               join: "time",
               summary: "GROUP",
               sort: search.Sort.ASC,
               label: "Employee"
            }),
            search.createColumn({
               name: "item",
               join: "time",
               summary: "GROUP",
               label: "Item"
            }),
            search.createColumn({
               name: "durationdecimal",
               join: "time",
               summary: "SUM",
               label: "Duration (Decimal)"
            }),
            search.createColumn({
               name: "formulatext",
               summary: "GROUP",
               formula: "{time.employee}",
               label: "employeeName"
            }),
             search.createColumn({
               name: "formulatext",
               summary: "GROUP",
               formula: "{time.item}",
               label: "Formula (Text)"
            }),
            search.createColumn({
               name: "formulanumeric",
               summary: "SUM",
               formula: "{time.durationdecimal}",
               label: "Formula (Numeric)"
            }),
           search.createColumn({
         name: "formulatext",
         summary: "GROUP",
         formula: "'Case'||'->'||{number} ||'-'|| {time.item}",
         label: "Formula (Text)"
      })
         ]
      });

      var isData = supportcaseSearchObj.run();
      var isFinalResult = isData.getRange(0, 10);
      var  parseData = JSON.stringify(isFinalResult);

      parseData = parseData.replace(/GROUP/g, '');
      parseData = parseData.replace(/SUM/g, '');
      parseData = parseData.replace(/\(/g, "");
      parseData = parseData.replace(/\)/g, "");
      parseData= JSON.parse(parseData)
     // log.debug("checktableemployee",parseData)

      return parseData
   }


   function  casePerDuration_TicketsProgressGraph(userid)
   {
      var supportcaseSearchObj = search.create({
         type: "supportcase",
         filters:
         [
            ["company.internalid","anyof",userid], 
            "AND", 
            ["time.duration","isnotempty",""]
         ],
         columns:
         [
            search.createColumn({
               name: "durationdecimal",
               join: "time",
               summary: "SUM",
               sort: search.Sort.ASC,
               label: "Duration (Decimal)"
            }),
            search.createColumn({
               name: "formulanumeric",
               summary: "SUM",
               formula: "{time.durationdecimal}",
               label: "Formula (Numeric)"
            }),
            search.createColumn({
               name: "formulatext",
               summary: "GROUP",
               formula: "{number}",
               label: "Formula (Text)"
            })
         ]
      });

      
      var isData = supportcaseSearchObj.run();
      var isFinalResult = isData.getRange(0, 999);
      var  parseData = JSON.stringify(isFinalResult);

      parseData = parseData.replace(/GROUP/g, '');
      parseData = parseData.replace(/SUM/g, '');
      parseData = parseData.replace(/\(/g, "");
      parseData = parseData.replace(/\)/g, "");
      parseData= JSON.parse(parseData)
      log.debug("checktableemployee",parseData)

      return parseData

   }
   
   function  getCustomFields_accordingToSelectedItems(itemCat)
   {
      var customrecord_ps_support_fieldsSearchObj = search.create({
         type: "customrecord_ps_support_fields",
         filters:
         [
            ["custrecord_ps_support_item_cat_list","anyof",itemCat]
         ],
         columns:
         [
            search.createColumn({name: "name",label: "Name"}),
            search.createColumn({name: "custrecord_ps_custom_support_fieldlabel", label: "Field Label"}),
            search.createColumn({name: "custrecord_ps_support_field_placeholder", label: "Place Holder"}),
            search.createColumn({name: "custrecord_ps_custom_support_fieldname", label: "Support Portal Field Id"}),
            search.createColumn({name: "custrecord_ps_custom_support_ismandatory", label: "Mandatory"}),
            search.createColumn({name: "custrecord_ps_support_fieldid", label: "Netsuite Field Id"}),
            search.createColumn({name: "custrecord_ps_custom_support_poptitle", label: "PopUP Title"}),
            search.createColumn({name: "custrecord_ps_support_field_popuptext", label: "POPUP Detail"}),

            search.createColumn({
               name: "internalid",
               sort: search.Sort.ASC,
               label: "Internal ID"
            })


         ]
      });

      
      var isData = customrecord_ps_support_fieldsSearchObj.run();
      var isFinalResult = isData.getRange(0, 999);
      var  parseData = JSON.stringify(isFinalResult);
      // parseData= JSON.parse(parseData)
      log.debug("checktableemployee",parseData)

      return parseData

   }
   function  getCustomFields(name)
   {
      var customrecord_ps_support_fieldsSearchObj = search.create({
         type: "customrecord_ps_support_fields",
         filters:
         [
         ],
         columns:
         [
            search.createColumn({name: "name",label: "Name"}),
            search.createColumn({name: "custrecord_ps_custom_support_fieldlabel", label: "Field Label"}),
            search.createColumn({name: "custrecord_ps_support_field_placeholder", label: "Place Holder"}),
            search.createColumn({name: "custrecord_ps_custom_support_fieldname", label: "Support Portal Field Id"}),
            search.createColumn({name: "custrecord_ps_custom_support_ismandatory", label: "Mandatory"}),
            search.createColumn({name: "custrecord_ps_support_fieldid", label: "Netsuite Field Id"}),
            search.createColumn({name: "custrecord_ps_custom_support_poptitle", label: "PopUP Title"}),
            search.createColumn({name: "custrecord_ps_support_field_popuptext", label: "POPUP Detail"}),
            search.createColumn({name: "custrecord_ps_support_div_type", label: "Div Type"}),

            search.createColumn({
               name: "internalid",
               sort: search.Sort.ASC,
               label: "Internal ID"
            })


         ]
      });

      
      var isData = customrecord_ps_support_fieldsSearchObj.run();
      var isFinalResult = isData.getRange(0, 999);
      var  parseData = JSON.stringify(isFinalResult);
      // parseData= JSON.parse(parseData)
      log.debug("checktableemployee",parseData)

      return parseData

   }

   function signup_UserCheck(username)
   {
      
      var customerSearchObj = search.create({
     type: "customer",
     filters:
     [
        ["email","is",username]
     ],
     columns:
     [
        search.createColumn({name: "internalid", label: "Internal ID"}),
        search.createColumn({
           name: "entityid",
           sort: search.Sort.ASC, 
           label: "Name"
        }),
        search.createColumn({name: "firstname", label: "First Name"}),
        search.createColumn({name: "lastname", label: "Last Name"}),
        search.createColumn({name: "email", label: "Email"})
     ]
  });
   var isData = customerSearchObj.run();
   var isFinalResult = isData.getRange(0, 999);
   var  parseData = JSON.parse(JSON.stringify(isFinalResult));

  return parseData
   }

   function getCustomerforms(customerid)
   {

      var customrecord_ps_support_customer_formsSearchObj = search.create({
         type: "customrecord_ps_support_customer_forms",
         filters:
         [
            ["custrecord_ps_support_customerforms_name","anyof",customerid]
         ],
         columns:
         [
            search.createColumn({
               name: "name",
               sort: search.Sort.ASC,
               label: "Name"
            }),
            search.createColumn({name: "custrecord_ps_support_customerform_forms", label: "Forms"})
         ]
      });

      var isData = customrecord_ps_support_customer_formsSearchObj.run();
      var isFinalResult = isData.getRange(0, 999);
      var  parseData = JSON.parse(JSON.stringify(isFinalResult));
   
     return parseData
   }

   function getFormFields(formId)
   {
      var customrecord_ps_support_fieldsSearchObj = search.create({
         type: "customrecord_ps_support_fields",
         filters:
         [
            ["custrecord_ps_support_forms","anyof",formId,"@NONE@"]
         ],
         columns:
         [
            search.createColumn({name: "name", label: "Name"}),
            search.createColumn({name: "custrecord_ps_custom_support_fieldlabel", label: "Field Label"}),
            search.createColumn({name: "custrecord_ps_support_field_placeholder", label: "Place Holder"}),
            search.createColumn({name: "custrecord_ps_custom_support_fieldname", label: "Support Portal Field Id"}),
            search.createColumn({name: "custrecord_ps_custom_support_ismandatory", label: "Mandatory"}),
            search.createColumn({name: "custrecord_ps_support_fieldid", label: "Netsuite Field Id"}), 
            search.createColumn({name: "custrecord_ps_custom_support_poptitle", label: "PopUP Title"}),
            search.createColumn({name: "custrecord_ps_support_field_popuptext", label: "POPUP Detail"}),
            search.createColumn({
               name: "internalid",
               sort: search.Sort.ASC,
               label: "Internal ID"
            }),
            search.createColumn({name: "custrecord_ps_support_div_type", label: "Div Type"})
         ]
      });

      var isData = customrecord_ps_support_fieldsSearchObj.run();
      var isFinalResult = isData.getRange(0, 999);
      var  parseData = JSON.stringify(isFinalResult);
   
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
       getTicketForEdit,
       countAllSatus,
       ticketsRecentActivites,
       totalTickets,
       employeeSentOnPerTicket_TicketsProgress,
       casePerDuration_TicketsProgressGraph,
       getCustomFields,
       signup_UserCheck,
       getCustomFields_accordingToSelectedItems,
       getCustomerforms,
       getFormFields,
       getTicketForEdit_ForDynamicFields
       

    }
});