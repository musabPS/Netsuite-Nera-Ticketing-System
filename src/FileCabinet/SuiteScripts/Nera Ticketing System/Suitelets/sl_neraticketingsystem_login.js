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

    function onGet(context) {
 
        dataSource = {
            breadcrumbs : "",
            message : ""
        }
        dataSource = helperlib.addAssetsDataSource(dataSource)

        //dataSource=""
        finalData = htmlContent(constants.URL.HTMLPAGES.LOGIN,dataSource)
    
        context.response.write(finalData);
    }

    function onPost(context)
     {
       
       var parseData= JSON.parse(context.request.body)

        // var userName = context.request.parameters.username;
        // var password = context.request.parameters.password;

        log.debug("POST", "POST WITH RECORDTYPE")
        log.debug("Postdaa",context.request.body)

        customerInfo= searchlib.loginSavedSearch(parseData.username,parseData.password)
        customerInfo=JSON.parse(customerInfo)
        if(customerInfo.length>0)
        {
            log.debug("cc",customerInfo)
           
            url=url.resolveScript({
                scriptId: 'customscript_sl_ticketingsystem_index',
                deploymentId: "1",
                returnExternalUrl: true
              })
               returnObj={

          url:url+"&userid="+customerInfo[0].id+"&username="+customerInfo[0].values.entityid,
          userDataSaveinCache: customerInfo,
          success:true
      }
              context.response.write(JSON.stringify(returnObj));

            log.debug("url afyer",url)
        }
        else
        {
            returnObj=
            {
                url:'dfdf',
                success:false
            }
            returnObj=JSON.stringify(returnObj)
              //log.debug("check",customerInfo)
             context.response.write(returnObj);
        }


    }

    function onError(context) {
        log.error({ title: context.error.name, details: context.error });
        throw context.error;
    }

        
    function htmlContent(link,dataSource)
    {
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
  
    return {
        onRequest: onRequest
    }
  
  });
  

  //SL Sales Portal LOGIN
  //customscript_sl_sp_login
  //customdeploy_sl_sp_login
  //https://tstdrv925863.app.netsuite.com/app/common/scripting/script.nl?id=650&whence=