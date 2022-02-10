/**
 * @NApiVersion 2.1
 * @NModuleScope public
 * @description This file contains all the constants for the project.
 */ 

 define(['N/url','SuiteScripts/Nera Ticketing System/lib/data_search_lib'], function (url,searchlib) {


    return {
        
       
        URL: {   
            HTMLPAGES: {
                INDEX: 'SuiteScripts/Nera Ticketing System/my-app/index.html',
                LOGIN: 'SuiteScripts/Nera Ticketing System/my-app/pages/login-2.html',
                SALES_ORDER_FORM: 'SuiteScripts/Nera Ticketing System/my-app/pages/salesOrderForm.html',
                TRANSACTION : 'SuiteScripts/Nera Ticketing System/my-app/pages/transaction.html',
                TRANSACTION_TABLE : 'SuiteScripts/Nera Ticketing System/my-app/pages/transactionTable.html',
                INVENTORY_TABLE : 'SuiteScripts/Nera Ticketing System/my-app/pages/inventoryTable.html',
                CUSTOMER_TABLE : 'SuiteScripts/Nera Ticketing System/my-app/pages/customertable.html',
                PARTIALS : {
                        EXTRAS : '',
                        CONTENT : 'SuiteScripts/Nera Ticketing System/my-app/partials/_content.html',
                        ASIDE: 'SuiteScripts/Nera Ticketing System/my-app/partials/_aside.html',
                }
            },
         
        }
      
            } 
        
    
});
 