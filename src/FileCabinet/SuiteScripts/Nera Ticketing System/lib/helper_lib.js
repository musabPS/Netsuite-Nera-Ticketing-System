/**
 * @NApiVersion 2.1
 * @NModuleScope public
 * @description This file contains all the constants for the project.
 */ 

 define(['N/url','N/file'], function (url,file) {

    function getSuiteletUrl(){
        var suitletUrl = url.resolveScript({
                scriptId: 'customscript_sl_sp_index',
                deploymentId: 'customdeploy_sl_sp_index', 
                returnExternalUrl: true
            })
            return suitletUrl;
     } 

     function addAssetsDataSource(datasource){
    
      var rootfolder='SuiteScripts/Nera Ticketing System/my-app/';

        datasource.fullcalendar_bundle_css = file.load({
            id: rootfolder+'assets/plugins/custom/fullcalendar/fullcalendar.bundle.css'
        }).url;

        datasource.plugins_bundle_css = file.load({
            id: rootfolder+'assets/plugins/global/plugins.bundle.css'
        }).url;
        datasource.prismjs_bundle_css = file.load({
            id: rootfolder+'assets/plugins/custom/prismjs/prismjs.bundle.css'
        }).url;
        datasource.style_bundle_css = file.load({
            id: rootfolder+'assets/css/style.bundle.css'
        }).url;
        datasource.plugins_bundle_js = file.load({
            id: rootfolder+'assets/plugins/global/plugins.bundle.js'
        }).url;
        datasource.prismjs_bundle_js = file.load({
            id: rootfolder+'assets/plugins/custom/prismjs/prismjs.bundle.js'
        }).url;
        datasource.script_bundle_js = file.load({
            id: rootfolder+'assets/js/scripts.bundle.js'
        }).url;
        datasource.fullcalendar_bundle_js = file.load({
            id: rootfolder+'assets/plugins/custom/fullcalendar/fullcalendar.bundle.js'
        }).url;
        datasource.widgets_js = file.load({
            id: rootfolder+'assets/js/pages/widgets.js'
        }).url;

      return datasource;
     }

    function renderHtmlContent(link, dataSource) {
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
      addAssetsDataSource,
     // addAsideDataSource,
      renderHtmlContent,
    //   getSuiteletUrl
     }

});