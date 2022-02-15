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

        log.debug("chsfgjg",constants.URL)

        

        masterDataSource = {

        }

         asidePageContent = htmlContent(constants.URL.HTMLPAGES.PARTIALS.ASIDE,searchlib.getScriptLinks());
        pageContent = htmlContent('SuiteScripts/Nera Ticketing System/my-app/pages/newFormSingtel.html',masterDataSource);
        dataSource = {
            asidePageContent : asidePageContent,
            pageContent: pageContent,
            breadcrumbs: "",
          }
         

           var finalDatasource = helperlib.addAssetsDataSource(dataSource);

 
        finalData = htmlContent("SuiteScripts/Nera Ticketing System/my-app/index.html", finalDatasource)   //current file

        context.response.write(finalData);
    }

    function onPost(context) {
        log.debug("POST", context.request.body);

        
         postJson=JSON.parse(context.request.body)

        log.debug("check",postJson)
        log.debug("check", postJson.fname)

        var createSupportCase = record.create({
            type: 'supportcase', 
            isDynamic: true
        });

        createSupportCase.setValue({   
            fieldId: 'title',
            value: 'test'
        });
        createSupportCase.setValue({   
            fieldId: 'company',
            value: 1397
        });

        createSupportCase.setText({   
            fieldId: 'status',
            text: 'Not Started'
        });
//////////
        createSupportCase.setText({   
            fieldId: 'custevent_ps_ticketingsystem_userfname',
            text: postJson.fname
        });
        createSupportCase.setText({   
            fieldId: 'custevent_ps_ticketingsystem_userlname',
            text: postJson.lname
        });
        createSupportCase.setText({   
            fieldId: 'custevent_ps_ticketingsystem_useremail',
            text: postJson.email
        });
        createSupportCase.setText({   
            fieldId: 'custevent_ps_ticketingsystem_cclist',
            text: postJson.cclist
        });
        createSupportCase.setText({   
            fieldId: 'custevent_ps_ticketingsystem_productgrp',
            text: postJson.productgroup
        });
        createSupportCase.setText({   
            fieldId: 'custevent_ps_ticketingsystem_netwrok',
            text: postJson.network
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

        var objRecord = record.load({type: 'supportcase',id: parseInt(saveid)});
        log.debug("check",objRecord)

        data={
            tranid: objRecord.getValue({fieldId:'casenumber'})
        }
        log.debug("data",data)

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

