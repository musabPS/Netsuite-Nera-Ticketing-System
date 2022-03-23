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





      var asidePageContent="";
      var pageContent ="";
        if(context.request.parameters.pagetype=="kbview")
        {
            data =  searchlib.getKBDetail(context.request.parameters.kbid)
      
            log.debug("check data",context.request.parameters.kbid)
            log.debug("data",data)
            kbTitle=data[0].values.title
            kbMessage=data[0].values.message
            kbDescription=data[0].values.description
      
              masterDataSource = {
                  kbtitle: `${kbTitle}`,
                  kbMessage: `${kbMessage}`,
                  kbDescription : `${kbDescription}`
              }
      
              log.debug("check",masterDataSource)
      
               asidePageContent = helperlib.renderHtmlContent(constants.URL.HTMLPAGES.PARTIALS.ASIDE,searchlib.getScriptLinks());
               pageContent = helperlib.renderHtmlContent(constants.URL.HTMLPAGES.KB_VIEW_PAGE,masterDataSource);    
        }

        if(context.request.parameters.pagetype=="kbsearch")
        {
             
      
              masterDataSource = {
                searchKeyword: searchlib.getTopicsforSearchKeyword(),
                Kb_ViewPage               : url.resolveScript({ scriptId: constants.SCRIPT.KB_VIEW_PAGE.SCRIPT_ID, deploymentId: "1",returnExternalUrl: true}),
                create_NewTicketScriptUrl : url.resolveScript({ scriptId: constants.SCRIPT.CREATE_NEW_TICKET.SCRIPT_ID, deploymentId: "1",returnExternalUrl: true}),

              }
      
              log.debug("check",masterDataSource)
      
               asidePageContent = helperlib.renderHtmlContent(constants.URL.HTMLPAGES.PARTIALS.ASIDE,searchlib.getScriptLinks());
               pageContent = helperlib.renderHtmlContent(constants.URL.HTMLPAGES.KB_SEARCH_PAGE,masterDataSource);    


        }
        
    
         dataSource = {
            asidePageContent : asidePageContent,
            pageContent: pageContent,
            breadcrumbs: "",
          }
         
 
           var finalDatasource = helperlib.addAssetsDataSource(dataSource); 

 
        finalData =  helperlib.renderHtmlContent(constants.URL.HTMLPAGES.INDEX,finalDatasource);   //current file
       
 
        context.response.write(finalData);
    }

    function onPost(context) {
        log.debug("POST", "POST WITH RECORDTYPE");
        log.debug("POST", context.request.body);
        parseBody=JSON.parse(context.request.body)
        searchText=searchlib.getquestionsFromKB(parseBody.search_text)
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

