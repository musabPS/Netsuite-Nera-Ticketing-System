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
    'N/cache',
    'N/record',
    'SuiteScripts/Nera Ticketing System/lib/data_search_lib',
    'SuiteScripts/Nera Ticketing System/lib/constants_lib.js',
    'SuiteScripts/Nera Ticketing System/lib/helper_lib'
], function (render, file, search, redirect, url, https,cache,record,searchlib,constants,helperlib) {


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
   var zipCacheJson
   function onGet(context) {


       const zipCache = cache.getCache({
           name: 'search_keyword',
           scope: cache.Scope.PUBLIC
       });
       
       zipCache.remove({
        key: 'search_keyword_json',
        
        });

        zipCacheJson = zipCache.get({
           key: 'search_keyword_json',
          loader: zipCodeDatabaseLoader,
          scope: cache.Scope.PUBLIC,
          ttl: 18000
       });
     function zipCodeDatabaseLoader(context) {
       var obj = searchlib.getquestionsFromKB("order")
       log.debug("checalltopics",searchlib.getquestionsFromKB("order"))
       return obj;
   }

            //Add additional code 
            //Add additional code 
                  
        log.debug("cacheValueonget",zipCacheJson)


       masterDataSource = {
           Kb_ViewPage:url.resolveScript({ scriptId: constants.SCRIPT.KB_VIEW_PAGE.SCRIPT_ID, deploymentId: "1",returnExternalUrl: true}),
           create_NewTicketScriptUrl:url.resolveScript({ scriptId: constants.SCRIPT.CREATE_NEW_TICKET.SCRIPT_ID, deploymentId: "1",returnExternalUrl: true}),
           searchKeyword: searchlib.getTopicsforSearchKeyword() 
        }

        asidePageContent = htmlContent(constants.URL.HTMLPAGES.PARTIALS.ASIDE,searchlib.getScriptLinks());
        pageContent = htmlContent(constants.URL.HTMLPAGES.PARTIALS.CONTENT,masterDataSource);
        dataSource = {
           asidePageContent : asidePageContent,
           pageContent: pageContent,
           breadcrumbs: "",
         }
        

          var finalDatasource = helperlib.addAssetsDataSource(dataSource);


       finalData = htmlContent(constants.URL.HTMLPAGES.INDEX, finalDatasource)   //current file

       context.response.write(finalData);
   }

   function onPost(context) {

    const zipCache = cache.getCache({
        name: 'search_keyword',
    });
    
     zipCacheJson = zipCache.get({
        key: 'search_keyword_json',
    });

    log.debug("cacheon post",zipCacheJson)
       
    //    log.debug("POST", "POST WITH RECORDTYPE");
        log.debug("POST", context.request.body);
        parseData=JSON.parse(context.request.body)
        log.debug(parseData.search_text)

        searchText=searchlib.getquestionsFromKB(parseData.search_text)
        log.debug("searchText",searchText)
        context.response.write(searchText);
   }

   function onError(context) {
       log.error({ title: context.error.name, details: context.error });
       throw context.error;
   }


   return {
       onRequest: onRequest
   }

});

