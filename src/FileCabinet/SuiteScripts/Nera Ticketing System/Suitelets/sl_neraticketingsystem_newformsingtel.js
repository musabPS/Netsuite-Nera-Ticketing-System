/**
* @NApiVersion 2.1
* @NScriptType Suitelet
*/

define([
    'N/render',
    'N/file',
    'N/search',
    'N/redirect', 
    'N/url',
    'N/https',
    'N/record',
     'SuiteScripts/Nera Ticketing System/lib/data_search_lib',
     'SuiteScripts/Nera Ticketing System/lib/constants_lib.js',
     'SuiteScripts/Nera Ticketing System/lib/helper_lib'
], function (render, file, search, redirect, url, https,record,searchlib,constants,helperlib) {


    function htmlContent(link, dataSource) {
        var pageRenderer = render.create(); //pageRenderer will combine datasource and template
        var templateFile = file.load({
            id: link
        });
        pageRenderer.templateContent = templateFile.getContents(); // template is set

        pageRenderer.addCustomDataSource({ //datasource is set now the template is going to recognize the ds object
            format: render.DataSource.OBJECT,
            alias: 'ds',
            data: dataSource
        });

        var renderedPage = pageRenderer.renderAsString();

        return renderedPage
    }

    function setAll_forEdit(fieldsSavedSearch,dataSavedsearch)
    {

        log.debug("fieldsSavedSearch",fieldsSavedSearch[0])
        log.debug("fieldsDataSavedsearch",dataSavedsearch[0])

       var netsuiteFieldId =""
       var htmlFieldId =""
       var fieldValue = ""
       var htmlFieldLabel=""

       var newObject=[]

        for(var i=0; i<fieldsSavedSearch.length; i++)
        {
            netsuiteFieldId = fieldsSavedSearch[i].values.custrecord_ps_support_fieldid
            fieldValue      = dataSavedsearch[0].values[netsuiteFieldId]
            htmlFieldId     =  fieldsSavedSearch[i].values.custrecord_ps_custom_support_fieldname
            htmlFieldLabel     =  fieldsSavedSearch[i].values.custrecord_ps_custom_support_fieldlabel
            newObject.push({
                netsuiteFiledId : netsuiteFieldId,
                htmlFieldValue  : fieldValue,
                htmlFieldId     : htmlFieldId,
                htmlFieldLabel     : htmlFieldLabel
            })

        }
        log.debug("newObject",newObject)

        return newObject
          // var fieldsId=Object.keys(fieldsDataSavedsearch)
          

    }

    function onRequest(context) {

        const eventRouter = {
            [https.Method.GET]: onGet,
            [https.Method.POST]: onPost
        };

        try {
            (eventRouter[context.request.method])(context);
        } catch (e) {
            onError({ context: context, error: e });
        }
    }

    function onGet(context) {
        masterDataSource={}
        var pageContent=""
        var templateFile =""
        var pageRenderer=""

        if(context.request.parameters.type=="View")
        {
           // getTicketData=searchlib.getTicketForEdit(context.request.parameters.id,context.request.parameters.userid)

            getCustomerFormsSavedSearch = searchlib.getCustomerforms(context.request.parameters.userid)
            getFormId=getCustomerFormsSavedSearch[0].values.custrecord_ps_support_customerform_forms[0].value
            var getAllFields =  searchlib.getFormFields(getFormId)

        
            getTicketData=searchlib.getTicketForEdit_ForDynamicFields(context.request.parameters.id,context.request.parameters.userid,JSON.parse(getAllFields))
           
            var getFieldsIdValue = setAll_forEdit(JSON.parse(getAllFields),getTicketData)
          //  log.debug("checkdd",getTicketData)

            // if(context.request.parameters.id>100611)
            // {
            //     templateFile = file.load({
            //         id: 'SuiteScripts/Customer_Ticket_html/'+context.request.parameters.id+"_Ticket.html"
            //     });
            //     log.debug("check",templateFile)
            //     pageRenderer = templateFile.getContents();
            // }
            templateFile = file.load({
                        id: constants.URL.SCREENSHOTS_HTMLFOLDER+""+context.request.parameters.id+"_Ticket.html"
                    });
                    pageRenderer = templateFile.getContents();
            var product=""
            var isAccessToDelete=true

            if(getTicketData[0].values.custevent_ps_ticketingsystem_product.length>0)
            {
                product=getTicketData[0].values.custevent_ps_ticketingsystem_product[0].text
            }
            if(getTicketData[0].values.assigned.length>0)  //check ticket is assign or not if not user cant delet
            {
                isAccessToDelete=false

            }

           
           
            masterDataSource = {
                itemList: searchlib.getProductList("check"), 
                type:context.request.parameters.type,
                ajaxscript: url.resolveScript({scriptId:constants.SCRIPT.SCRIPT_AJAX.SCRIPT_ID, deploymentId: "1",returnExternalUrl: true}),
                viewURL:  url.resolveScript({scriptId: constants.SCRIPT.CREATE_NEW_TICKET.SCRIPT_ID, deploymentId: "1",returnExternalUrl: true})+'&username='+context.request.parameters.username+'&userid='+context.request.parameters.userid,
                id: context.request.parameters.id,

                //set value to freemarker
                ticketId           : getTicketData[0].values.casenumber,
                ticketCreateDate   : getTicketData[0].values.createddate,
                subject            : getTicketData[0].values.title,
                // firstName          : getTicketData[0].values.custevent_ps_ticketingsystem_userfname,
                // LastName           : getTicketData[0].values.custevent_ps_ticketingsystem_userfname,
                // priority           : getTicketData[0].values.priority[0].value,
                // ccList             : getTicketData[0].values.custevent_ps_ticketingsystem_cclist,
                email              : getTicketData[0].values.custevent_ps_ticketingsystem_useremail,
                // productGroup       : getTicketData[0].values.custevent_ps_ticketingsystem_productgrp,
                title              : getTicketData[0].values.title,
                textArea           : pageRenderer,
                product            : product,
                // serialno           : '20937272',
                isAccessToDelete   : isAccessToDelete,
                customFields_Forms  :  getAllFields,
                getFieldsValues     :  JSON.stringify(getFieldsIdValue)

              }
              pageContent = helperlib.renderHtmlContent(constants.URL.HTMLPAGES.TicketView_ALL_SAVE_DATA,masterDataSource);
        }
        
        if(context.request.parameters.type=="Edit")
        {

            getCustomerFormsSavedSearch = searchlib.getCustomerforms(context.request.parameters.userid)
            getFormId=getCustomerFormsSavedSearch[0].values.custrecord_ps_support_customerform_forms[0].value
            var getAllFields =  searchlib.getFormFields(getFormId)

           // getTicketData=searchlib.getTicketForEdit(context.request.parameters.id,context.request.parameters.userid,getAllFields)

            getTicketData=searchlib.getTicketForEdit_ForDynamicFields(context.request.parameters.id,context.request.parameters.userid,JSON.parse(getAllFields))
           
           var getFieldsIdValue = setAll_forEdit(JSON.parse(getAllFields),getTicketData)

            // if(context.request.parameters.id>100611)
            // {
                 templateFile = file.load({
                    id: constants.URL.SCREENSHOTS_HTMLFOLDER+""+context.request.parameters.id+"_Ticket.html"
                 });

                pageRenderer = templateFile.getContents();
            // }
            var product=""

            if(getTicketData[0].values.custevent_ps_ticketingsystem_product.length>0) 
            {
                product=getTicketData[0].values.custevent_ps_ticketingsystem_product[0].value
            }

            masterDataSource = {
                itemList: searchlib.getProductList("check"),
                type:context.request.parameters.type,
                ajaxscript: url.resolveScript({scriptId:constants.SCRIPT.SCRIPT_AJAX.SCRIPT_ID, deploymentId: "1",returnExternalUrl: true}),

                //set value to freemarker
                ticketId            : getTicketData[0].values.casenumber,
                ticketCreateDate    : getTicketData[0].values.createddate,
                subject             : getTicketData[0].values.title,
                firstName           : getTicketData[0].values.custevent_ps_ticketingsystem_userfname,
                LastName            : getTicketData[0].values.custevent_ps_ticketingsystem_userfname,
                priority            : getTicketData[0].values.priority[0].value,
                ccList              : getTicketData[0].values.custevent_ps_ticketingsystem_cclist,
                email               : getTicketData[0].values.custevent_ps_ticketingsystem_useremail,
                productGroup        : getTicketData[0].values.custevent_ps_ticketingsystem_productgrp,
                title               : getTicketData[0].values.title,
                textArea            : pageRenderer,
                product             : product,
                customFields_Forms  :  getAllFields,
                getFieldsValues     :  JSON.stringify(getFieldsIdValue) 
              }

              pageContent = helperlib.renderHtmlContent(constants.URL.HTMLPAGES.NEWFORMSIGNTEL_Part2,masterDataSource);
        }

        if(context.request.parameters.type=="Create") 
        {
           getCustomerFormsSavedSearch = searchlib.getCustomerforms(context.request.parameters.userid)
           getFormId=getCustomerFormsSavedSearch[0].values.custrecord_ps_support_customerform_forms[0].value

            masterDataSource = {
                type                :  context.request.parameters.type,
                itemList            :  searchlib.getProductList("check"),
                ajaxScript          :  url.resolveScript({scriptId:constants.SCRIPT.SCRIPT_AJAX.SCRIPT_ID, deploymentId: "1",returnExternalUrl: true}),
                ticketView          :  url.resolveScript({scriptId:constants.SCRIPT.Ticket_VIEW.SCRIPT_ID, deploymentId: "1",returnExternalUrl: true})+'&username='+context.request.parameters.username+'&userid='+context.request.parameters.userid,
                customFields        :  searchlib.getCustomFields("check"),
                customFields_Forms  :  searchlib.getFormFields(getFormId)
              }
              pageContent = helperlib.renderHtmlContent(constants.URL.HTMLPAGES.NEWFORMSIGNTEL_Part2,masterDataSource);
        }

     //   log.debug("masterDataSource",masterDataSource) 

        var allLinks=searchlib.getScriptLinks()

         asidePageContent = helperlib.renderHtmlContent(constants.URL.HTMLPAGES.PARTIALS.ASIDE,allLinks);

        

        dataSource = {
            asidePageContent : asidePageContent,
            pageContent: pageContent,
            breadcrumbs: "",
            viewTicket :  url.resolveScript({scriptId:constants.SCRIPT.SCRIPT_AJAX.SCRIPT_ID, deploymentId: "1",returnExternalUrl: true}),
          }
         

           var finalDatasource = helperlib.addAssetsDataSource(dataSource);

 
        finalData = helperlib.renderHtmlContent(constants.URL.HTMLPAGES.INDEX, finalDatasource)   //current file

        context.response.write(finalData);
    }

    function onPost(context) {
        log.debug("POST", context.request.body);

        
         postJson=JSON.parse(context.request.body)

         log.debug("check dynamicFields",postJson.dynamicFieldsData)
         var dynamicFields=postJson.dynamicFieldsData
        
         var createSupportCase=""

            if(postJson.type=="Create")
            {
                var createSupportCase = record.create({
                    type: 'supportcase', 
                    isDynamic: true
                });
            }

            if(postJson.type=="Edit")
            {
                var createSupportCase = record.load({
                    id: postJson.internalId,
                    type: 'supportcase', 
                    isDynamic: true
                });

            


            }

           // Create a file containing text

         for(var i=0; i<dynamicFields.length; i++)
         {
            createSupportCase.setValue({   
                fieldId: dynamicFields[i].netsuiteFiledId,
                value: dynamicFields[i].htmlFieldValue,
             });

             log.debug("FieldsDataa",dynamicFields[i].netsuiteFiledId+"-"+dynamicFields[i].htmlFieldValue)
         }

            
         createSupportCase.setValue({   
            fieldId: 'title',
            value: postJson.subject
         });

         createSupportCase.setValue({   
            fieldId: 'company',
            value: context.request.parameters.userid
         });

         createSupportCase.setText({   
            fieldId: 'status',
            text: 'Not Started'
         });

//////////

        //  createSupportCase.setText({   
        //     fieldId: 'custevent_ps_ticketingsystem_userfname',
        //     text: postJson.fname
        //  });

            // createSupportCase.setText({   
            //     fieldId: 'custevent_ps_ticketingsystem_userlname',
            //     text: postJson.lname
            // });
            // createSupportCase.setText({   
            //     fieldId: 'custevent_ps_ticketingsystem_useremail',
            //     text: postJson.email
            // });
            // createSupportCase.setText({   
            //     fieldId: 'custevent_ps_ticketingsystem_cclist',
            //     text: postJson.cclist
            // });
            // createSupportCase.setText({   
            //     fieldId: 'custevent_ps_ticketingsystem_productgrp',
            //     text: postJson.productgroup
            // });
            // createSupportCase.setText({   
            //     fieldId: 'custevent_ps_ticketingsystem_netwrok',
            //     text: postJson.network
            // });

            // createSupportCase.setText({   
            //     fieldId: 'custevent_ps_ticketingsystem_textarea',
            //     text: fileObj
            // });

            createSupportCase.setText({   
                fieldId: 'custevent_ps_ticketingsystem_product',
                text: postJson.productId
            });


        // createSupportCase.setText({   
        //     fieldId: '_ps_ticketingsystem_chassisser',
        //     text: postJson.productgroup
        // });
        // createSupportCase.setText({   
        //     fieldId: '_ps_ticketingsystem_netwrok',
        //     text: postJson.productgroup
        // });
        // createSupportCase.setText({   
        //     fieldId: '_ps_ticketingsystem_hostname',
        //     text: postJson.productgroup
        // });
        // createSupportCase.setText({   
        //     fieldId: '_ps_ticketingsystem_casetype',
        //     text: postJson.productgroup
        // });
        // createSupportCase.setText({   
        //     fieldId: '_ps_ticketingsystem_softwarver',
        //     text: postJson.productgroup
        // });



        saveid =  createSupportCase.save({                   
            ignoreMandatoryFields: true    
        });

        fileObj = file.create({
            name: saveid+'_Ticket.html',
            fileType: file.Type.PLAINTEXT,
            contents: "<html>"+postJson.textarea+"</html>"
            });
    
           fileObj.folder = 7896;
           id = fileObj.save();
           fileObj = file.load({
            id: id
        }).url
      //  log.debug("checkfileid",id)

        var objRecord = record.load({type: 'supportcase',id: parseInt(saveid)});
     //   log.debug("check",objRecord)

        data={
            tranid: objRecord.getValue({fieldId:'casenumber'}), 
            id: saveid,
            userid: context.request.parameters.userid,
            username: context.request.parameters.username
        }
       // log.debug("data",data)

        context.response.write(JSON.stringify(data));
        
    }

    function onError(context) {
        log.error({ title: context.error.name, details: context.error });
        throw context.error;
    }


    return {
        onRequest: onRequest
    }

});

