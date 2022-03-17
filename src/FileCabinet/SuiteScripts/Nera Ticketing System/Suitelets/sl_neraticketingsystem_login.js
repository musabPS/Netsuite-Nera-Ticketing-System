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
     'N/record',
     'SuiteScripts/Nera Ticketing System/lib/data_search_lib',
     'SuiteScripts/Nera Ticketing System/lib/constants_lib.js',
     'SuiteScripts/Nera Ticketing System/lib/helper_lib',
     'SuiteScripts/Vendor Test Theme/moment.js'
], function (render, file, search, redirect, url, https,record,searchlib,constants,helperlib,moment) {
  
  
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
        finalData = helperlib.renderHtmlContent(constants.URL.HTMLPAGES.LOGIN,dataSource)
    
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
           sessionToken= createSession(customerInfo[0].id,customerInfo[0].values.entityid)
            log.debug("cc",sessionToken)
           
            url=url.resolveScript({
                scriptId: 'customscript_sl_ticketingsystem_index',
                deploymentId: "1",
                returnExternalUrl: true
              })
               returnObj={

          url:url+"&userid="+customerInfo[0].id+"&username="+customerInfo[0].values.entityid,
          userDataSaveinCache: customerInfo,
          success:true,  
          token:sessionToken           
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

        function createSession(userid,username)
        {
            var wordcharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
            var Token = '';
            for(var i = 0; i < 20; i++) {
               Token += wordcharacters[parseInt(Math.random() * wordcharacters.length, 10)];
            }
              var  date = new Date();
            //    var hours = date.getHours();
            //    var minutes = date.getMinutes();
            //    var seconds = date.getSeconds();
            //    var ampm = hours >= 12 ? 'pm' : 'am';
            //    hours = hours % 12;
            //    hours = hours ? hours : 12; // the hour '0' should be '12'
            //    minutes = minutes < 10 ? '0'+minutes : minutes;
            //    var strTime = hours + ':' + minutes +':'+seconds+' ' + ampm;
            //    var endTime = hours + ':' + parseInt(date.getMinutes()+30) +':'+seconds+' ' + ampm;

            //    var tdate = date.getDate();
            //    var month = date.getMonth() + 1; // jan = 0
            //    var year = date.getFullYear();
            //    if(month.length<2)
            //    {
            //        month+=month
            //    }
            //    if(tdate<2)
            //    {
            //        tdate+=tdate
            //    }
            //    //change dateforma
            //    startDateTime=`${month}/${tdate}/${year} ${strTime}`
            //    EndDateTime=`${month}/${tdate}/${year} ${endTime}`
               var startDateTime = moment(date).format('MM/DD/YYYY hh:mm:ss A');
               var endDateTime = moment(startDateTime).add(30, 'minutes').format('MM/DD/YYYY hh:mm:ss A');

               log.debug("startDateTime",startDateTime)
               log.debug("EndDateTime",endDateTime)

              var createSession=record.create({
                  type : 'customrecord_ps_custom_user_sessions',  
             })
             createSession.setValue({fieldId : 'custrecord_ps_customsessions_userid', value:userid})
             createSession.setValue({fieldId : 'custrecord_ps_customsessions_username', value:username})
             createSession.setValue({fieldId : 'custrecord_ps_customsessions_usertoken', value:Token})
             createSession.setValue({fieldId : 'custrecord_ps_customsessions_startdate', value: new Date(startDateTime)})
             createSession.setValue({fieldId : 'custrecord_ps_customsessions_enddate', value: new Date(endDateTime)})
             saveID=createSession.save();

               log.debug("sessioninternl",saveID)
            return  Token
        }
  
    return {
        onRequest: onRequest
    }
  
  });
  

  //SL Sales Portal LOGIN
  //customscript_sl_sp_login
  //customdeploy_sl_sp_login
  //https://tstdrv925863.app.netsuite.com/app/common/scripting/script.nl?id=650&whence=