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

         

        context.response.write(finalData);
    }
 
    function onPost(context) 
    {
        log.debug("POST", "POST WITH RECORDTYPE");
        log.debug("POST", context.request.body);
        parseBody=JSON.parse(context.request.body)
        if(parseBody.dataType=="User_Profile_Data")
        {

        }
        if(parseBody.actionType=="voidTicket")
        {
            log.debug("POST voidTicket", context.request.body);
           // record.delete({ type: 'supportcase', id: parseBody.ticketInternalID });
            var returnPost={
                success: true,
                TicketList:  url.resolveScript({scriptId: constants.SCRIPT.Ticket_Listing.SCRIPT_ID, deploymentId: "1",returnExternalUrl: true})

            }
            context.response.write(JSON.stringify(returnPost))
            return;
        }


        if(parseBody.type=="getFields")
        {
            getProductSerialNumber=searchlib.getCustomFields_accordingToSelectedItems(parseBody.itemCat)
            context.response.write(getProductSerialNumber);
            return
        }

        getProductSerialNumber=searchlib.getSerailNumber(parseBody.productid)
        log.debug("check",getProductSerialNumber)
        context.response.write(JSON.stringify(getProductSerialNumber));
    }

    function onError(context) {
        log.error({ title: context.error.name, details: context.error });
        throw context.error;
    }


    return {
        onRequest: onRequest
    }

});

