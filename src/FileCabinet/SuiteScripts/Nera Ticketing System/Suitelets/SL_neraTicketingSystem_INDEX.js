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
    // 'SuiteScripts/Vendor2/model/dataSource.js',
    // './lib/constants_lib.js',
    // './lib/data_search_lib',
    // './lib/helper_lib'
], function (render, file, search, redirect, url, https) {


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

        // let userId = context.request.parameters.userid;

        // salesOrderDetails = searchlib.getSalesorderDetailsBySalesRep(userId)
        // log.debug("salesOrderDetails", salesOrderDetails)

        masterDataSource = {
            // list: salesOrderDetails,
            // customerRequests: searchlib.getTotalCustomerRequestForCard(),
            // totalOrders: searchlib.getTotalSalesorders(),
            // pendingOrders: searchlib.getPendingOrders(),
            // salesbymonthgraph: searchlib.getSalesByMonthForGraph(),
            // salesbycustomer: searchlib.getSalesByCustomer(),
            // salesordercreatelink: constants.SCRIPT.SALESORDER_CREATE.URL,
            // salesorderviewlink: constants.SCRIPT.SALESORDER_VIEW.URL,
        }

        // log.debug("masterDataSource", masterDataSource)

        // asideDataSource = helperlib.addAsideDataSource();

        // ///dynamic extract link
        // pageContent = htmlContent(constants.URL.PAGE.PARTIALS.CONTENT, masterDataSource);
        // asidePageContent = htmlContent(constants.URL.PAGE.PARTIALS.ASIDE,asideDataSource);
        pageContent = htmlContent('SuiteScripts/Nera Ticketing System/my-app/partials/_content.html',masterDataSource);
        dataSource = {
            // asidePageContent : asidePageContent,
            pageContent: pageContent,
            breadcrumbs: "",
          }
        // // log.debug("dataSource : ", dataSource);

        //   var finalDatasource = helperlib.addAssetsDataSource(dataSource);

        //   log.debug("finalDatasource : ",finalDatasource);

        //dataSource=""

       
        finalData = htmlContent("SuiteScripts/Nera Ticketing System/my-app/index.html", dataSource)   //current file

        context.response.write(finalData);
    }

    function onPost(context) {
        log.debug("POST", "POST WITH RECORDTYPE");
    }

    function onError(context) {
        log.error({ title: context.error.name, details: context.error });
        throw context.error;
    }


    return {
        onRequest: onRequest
    }

});

