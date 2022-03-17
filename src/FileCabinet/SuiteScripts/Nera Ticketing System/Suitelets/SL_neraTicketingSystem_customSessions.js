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
    'SuiteScripts/netsuite_salesPortal/getMasterData.js',
    'N/query',
    'N/record',
    'SuiteScripts/Vendor Test Theme/moment.js'

  ], function (render, file, search, redirect, url, https,getMasterData,query,record,moment) {
  
  
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


  
    function isSessionExpired(token) {

        try
        {


           var customrecord_ps_custom_user_sessionsSearchObj = search.create({
            type: "customrecord_ps_custom_user_sessions",
            filters:
            [
               ["custrecord_ps_customsessions_usertoken","is",token] 

            ],
            columns:
            [
               search.createColumn({name: "custrecord_ps_customsessions_enddate", label: "End Date"})
            ]
         });

         var isData = customrecord_ps_custom_user_sessionsSearchObj.run();
         var isFinalResult = isData.getRange(0, 999);
         var customersList = JSON.parse(JSON.stringify(isFinalResult));
       
         if(customersList.length>0)
         {
            log.debug("checksavedsearchdata",customersList[0].values.custrecord_ps_customsessions_enddate)
            log.debug("check time","fff")
            var  date = new Date();
            var startDateTime = moment(date).add(1, 'days').format('MM/DD/YYYY hh:mm:ss A')
            var endDate=moment(customersList[0].values.custrecord_ps_customsessions_enddate).format('MM/DD/YYYY hh:mm:ss A')

            // startDateTime=moment(startDateTime, "MM/DD/YYYY hh:mm:ss A").add(1, 'days');
            // endDate=moment(endDate, "MM/DD/YYYY hh:mm:ss A").add(1, 'days');
            log.debug("check time",startDateTime)
            log.debug("check endDate",endDate)
            log.debug("date didd",(new Date(endDate)-new Date(startDateTime))/60000)
            if(new Date(endDate)>new Date(startDateTime))
            {
                log.debug("check time","musab")
                log.debug("check endDate",endDate)
                return false
            }

         }

         else
         {
            return true
         }

    }
    catch(e)
    {
        log.error("Error",e);
        return false
    }

  

    }



        function onRequest(context) 
        {

            if (context.request.method === "POST") 
            {
                log.debug("check POST",context.request.parameters)
                log.debug("POST body", context.request.body)
                var postJson=JSON.parse(context.request.body)
                log.debug("POST body", postJson)
          
                isToeknExpired = isSessionExpired(postJson.token)

                log.debug("result",isToeknExpired)
                if(!isToeknExpired)
                {
                     var responce={
                        success : false
                    }
                    responce = JSON.stringify(responce)
                    context.response.write(responce);
                }
                else
                {
                    url=url.resolveScript({
                        scriptId: 'customscript_sl_neraticketsystem_login',
                        deploymentId: "1",
                        returnExternalUrl: true})
                    var responce={
                        success : true,
                        url : url
                    }

                    responce = JSON.stringify(responce)

                    context.response.write(responce);
                }
               
              //  log.debug("check",result)
            }
        }


    return {
        onRequest: onRequest,
        isSessionExpired : isSessionExpired
     //   createSession : createSession
        
    }
  
  });
  