/**
 * @NApiVersion 2.1
 * @NModuleScope public
 * @description This file contains all the constants for the project.
 */ 

 define(['N/url','SuiteScripts/Nera Ticketing System/lib/data_search_lib','SuiteScripts/Nera Ticketing System/lib/helper_lib'], 
 function (url,searchlib,helperlib) {


    return {

        URL: {   
            ROOTFOLDER:'SuiteScripts/Nera Ticketing System/my-app/', 
            SCREENSHOTS_HTMLFOLDER :  'SuiteScripts/Nera Ticketing System/Customer_Ticket_html/',

            HTMLPAGES: {
                INDEX: 'SuiteScripts/Nera Ticketing System/my-app/index.html',
                LOGIN: 'SuiteScripts/Nera Ticketing System/my-app/pages/Login.html',
                KB_VIEW_PAGE: 'SuiteScripts/Nera Ticketing System/my-app/pages/KBViewPage.html',
                TRANSACTION : 'SuiteScripts/Nera Ticketing System/my-app/pages/transaction.html',
                TRANSACTION_TABLE : 'SuiteScripts/Nera Ticketing System/my-app/pages/transactionTable.html',
                INVENTORY_TABLE : 'SuiteScripts/Nera Ticketing System/my-app/pages/inventoryTable.html',
                CUSTOMER_TABLE : 'SuiteScripts/Nera Ticketing System/my-app/pages/customertable.html',
                LISTING : 'SuiteScripts/Nera Ticketing System/my-app/pages/listing.html',
                NEWFORMSIGNTEL : 'SuiteScripts/Nera Ticketing System/my-app/pages/newFormSingtel.html',
                TicketView_ALL_SAVE_DATA : 'SuiteScripts/Nera Ticketing System/my-app/pages/TicketView_allSaveData.html',
                TicketView : 'SuiteScripts/Nera Ticketing System/my-app/pages/TicketView.html',
                NEWFORMSIGNTEL_Part2 : 'SuiteScripts/Nera Ticketing System/my-app/pages/newFormSingtel_2parts.html',
                KB_SEARCH_PAGE : 'SuiteScripts/Nera Ticketing System/my-app/pages/KB_SearhPage.html',
               

                PARTIALS : {
                        EXTRAS : '',
                        CONTENT : 'SuiteScripts/Nera Ticketing System/my-app/partials/_content.html',
                        ASIDE: 'SuiteScripts/Nera Ticketing System/my-app/partials/_aside.html'

                }
            }
        },    
            SCRIPT: {
                INDEX: {
                    SCRIPT_ID: 'customscript_sl_ticketingsystem_index',
                    SCRIPT_DEPLOYMENT: 'customdeploy_sl_ticketingsystem_index',
                },
                KB_VIEW_PAGE: {
                    SCRIPT_ID: 'customscript_ps_neraticketing_kbviewpage',
                    SCRIPT_DEPLOYMENT: 'customdeploy_sl_ticketingsystem_index',
                },
                CREATE_NEW_TICKET: {
                    SCRIPT_ID: 'customscript_sl_ticketingsystem_nwticket',
                    SCRIPT_DEPLOYMENT: 'customdeploy_sl_neraticketsystem_newtick',
                },
                SCRIPT_AJAX: {
                    SCRIPT_ID: 'customscriptsl_neraticketingsystem_ajaxu',
                    SCRIPT_DEPLOYMENT: 'customdeploysl_neraticketingsystem_ajaxu',
                },
                Ticket_Listing: {
                    SCRIPT_ID: 'customscript_sl_ticketingsystem_listing',
                    SCRIPT_DEPLOYMENT: 'customdeploy_sl_ticketingsystem_listing',
                },
                Ticket_VIEW: {
                    SCRIPT_ID: 'customscript_sl_ticketingsystem_ticketvi',
                    SCRIPT_DEPLOYMENT: 'customdeploy_sl_ticketingsystem_ticketvi',
                },
            }
          
        
    }   
        
    
});
 