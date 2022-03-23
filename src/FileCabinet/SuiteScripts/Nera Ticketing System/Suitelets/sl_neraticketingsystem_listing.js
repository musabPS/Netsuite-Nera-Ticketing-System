/** 
 * A Login Form Suitelet which is the entry point of the Sales Portal Dashboard
 *
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @NScriptType Suitelet
 */ 
 
 define([
    'N/render',
    'N/file',
    'N/search',
    'N/redirect', 
    'N/url',
    'N/https',
     'SuiteScripts/Nera Ticketing System/lib/data_search_lib',
     'SuiteScripts/Nera Ticketing System/lib/constants_lib.js',
     'SuiteScripts/Nera Ticketing System/lib/helper_lib'
], function (render, file, search, redirect, url, https,searchlib,constants,helperlib) {
  
  
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

    function onGet(context)
     {
 
        dataSource = {
            breadcrumbs : "",
            message : ""
        }
        dataSource = helperlib.addAssetsDataSource(dataSource)

        //dataSource=""
        log.debug("cheddd",context.request.parameters.userid)
        masterDataSource = {
            caseList:searchlib.getCustomersTicket(context.request.parameters.userid),
            viewURL:  url.resolveScript({scriptId: constants.SCRIPT.CREATE_NEW_TICKET.SCRIPT_ID, deploymentId: "1",returnExternalUrl: true})+'&username='+context.request.parameters.username+'&userid='+context.request.parameters.userid,
            ticketURL:  url.resolveScript({scriptId: constants.SCRIPT.CREATE_NEW_TICKET.SCRIPT_ID, deploymentId: "1",returnExternalUrl: true})+'&username='+context.request.parameters.username+'&userid='+context.request.parameters.userid
          }

  
          log.debug("masterDataSource",masterDataSource) 
  
           asidePageContent = helperlib.renderHtmlContent(constants.URL.HTMLPAGES.PARTIALS.ASIDE,searchlib.getScriptLinks());
           pageContent = helperlib.renderHtmlContent(constants.URL.HTMLPAGES.LISTING,masterDataSource);
           dataSource = {
              asidePageContent : asidePageContent,
              pageContent: pageContent,
              breadcrumbs: "",
            }
           
          var finalDatasource = helperlib.addAssetsDataSource(dataSource);
          finalData = helperlib.renderHtmlContent(constants.URL.HTMLPAGES.INDEX, finalDatasource)   //current file
  
          context.response.write(finalData);
    }

    function onPost(context)
     {
       

    }

    function onError(context) {
        log.error({ title: context.error.name, details: context.error });
        throw context.error;
    }

        
   
  
    return {
        onRequest: onRequest
    }
  
  });
  

