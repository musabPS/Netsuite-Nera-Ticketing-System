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

    function onPost(context) {
       
        var userName = context.request.parameters.username;
        var password = context.request.parameters.password;

        log.debug("POST", "POST WITH RECORDTYPE")
        log.debug("Postdaa",context.request.parameters)

        salesPersonInfo= searchlib.loginSavedSearch(userName,password)
        log.debug("check",salesPersonInfo)

         if(salesPersonInfo.length>0)
         {
             var suiteletURL = url.resolveScript({
                 scriptId: constants.SCRIPT.INDEX.SCRIPT_ID,
                 deploymentId: constants.SCRIPT.INDEX.SCRIPT_DEPLOYMENT,
                 returnExternalUrl: true
             });
 
             redirect.redirect({
                 url: suiteletURL,
                 parameters: {
                     'username':salesPersonInfo[0].values.entityid,
                     'userid' : salesPersonInfo[0].id
                 }
             });


             var wordcharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
             var Token = '';
             for(var i = 0; i < 20; i++) {
                Token += wordcharacters[parseInt(Math.random() * wordcharacters.length, 10)];
             }
           
            //  var sessionObj = runtime.getCurrentSession();
            //  sessionObj.set({
            //     name: salesPersonInfo[0].id,
            //     value: wordcharacters
            //  });

            //  log.debug('Session object myKey value: ' + sessionObj.get({name: salesPersonInfo[0].id}));
           
            //     var  date = new Date();
            //     var hours = date.getHours();
            //     var minutes = date.getMinutes();
            //     var endMinutes = date.getMinutes()+30
            //     var seconds = date.getSeconds();
            //     var ampm = hours >= 12 ? 'pm' : 'am';
            //     hours = hours % 12;
            //     hours = hours ? hours : 12; // the hour '0' should be '12'
            //     minutes = minutes < 10 ? '0'+minutes : minutes;
            //     var strTime = hours + ':' + minutes +':'+seconds+' ' + ampm;
            //     var endTime = hours + ':' + endMinutes +':'+seconds+' ' + ampm;

            //     var tdate = date.getDate();
            //     var month = date.getMonth() + 1; // jan = 0
            //     var year = date.getFullYear();
            //     if(month.length<2)
            //     {
            //         month+=month
            //     }
            //     if(tdate<2)
            //     {
            //         tdate+=tdate
            //     }
            //     //change dateforma
            //     startDateTime=`${month}/${tdate}/${year} ${strTime}`

            //    var createSession=record.create({
            //        type : 'customrecord_ps_custom_user_sessions',  
            //   })
            //   createSession.setValue({fieldId : 'custrecord_ps_customsessions_userid', value:salesPersonInfo[0].id})
            //   createSession.setValue({fieldId : 'custrecord_ps_customsessions_username', value:salesPersonInfo[0].values.entityid})
            //   createSession.setValue({fieldId : 'custrecord_ps_customsessions_usertoken', value:Token})
            //   createSession.setValue({fieldId : 'custrecord_ps_customsessions_startdate', value: new Date(startDateTime)})
            //   saveID=createSession.save();

         }

         else
         {
             pageContent =''

             dataSource = {
                pageContent : pageContent,
                breadcrumbs : "",
                message : "Invalid Login or Password"
             }
                //dataSource=""
                finalData = htmlContent(constants.URL.HTMLPAGES.LOGIN,dataSource)
                context.response.write(finalData);
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