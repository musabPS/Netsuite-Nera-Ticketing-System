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

        var objRecord = record.create({
            type: 'supportcase',
            defaultValue: {fieldId:'customform', value:"4545"}

        });
       
        var allBodyFields = objRecord.getField({fieldId:'custevent_ps_ticketingsystem_userlname'});
        log.debug("allBodyFields",allBodyFields)

        log.debug("chsfgjg",constants)


        masterDataSource = {

            Kb_ViewPage:url.resolveScript({ scriptId: constants.SCRIPT.KB_VIEW_PAGE.SCRIPT_ID, deploymentId: "1",returnExternalUrl: true}),
            create_NewTicketScriptUrl:url.resolveScript({ scriptId: constants.SCRIPT.CREATE_NEW_TICKET.SCRIPT_ID, deploymentId: "1",returnExternalUrl: true})
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
        log.debug("POST", "POST WITH RECORDTYPE");
        log.debug("POST", context.request.body);
        parseBody=JSON.parse(context.request.body)
        searchText=searchlib.getquestionsFromKB(parseBody.search_text)
        log.debug("searchText",searchText)
        context.response.write(JSON.stringify(searchText));
    }

    function onError(context) {
        log.error({ title: context.error.name, details: context.error });
        throw context.error;
    }


    return {
        onRequest: onRequest
    }

});

