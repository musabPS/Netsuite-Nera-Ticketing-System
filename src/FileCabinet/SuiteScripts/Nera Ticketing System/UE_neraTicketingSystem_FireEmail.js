/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(['N/record','N/task','N/search','N/email'],
    function(record,task,search,email) {

        function afterSubmit(context) {
            log.debug('Stage','afterSubmit') 
            log.debug('Context',context.type) 
            var curRec = context.newRecord;
              log.debug("curRec", curRec)
            // log.debug('new','Map Reduce called from UE') ;

         //   log.debug("curRec", curRec.fields)

            

        var supportcaseSearchObj = search.create({
            type: "supportcase",
            filters:
            [
               ["internalid","anyof",curRec.id]
            ],
            columns:
            [
               search.createColumn({name: "createddate", label: "Date Created"}),
               search.createColumn({
                  name: "casenumber",
                  sort: search.Sort.ASC,
                  label: "Number"
               }),
               search.createColumn({name: "title", label: "Subject"}),
               search.createColumn({name: "custevent_ps_ticketingsystem_casetype", label: "Case Type"}),
               search.createColumn({name: "custevent_ps_ticketingsystem_product", label: "Product"}),
               search.createColumn({
                  name: "employee",
                  join: "time",
                  label: "Employee"
               }),
               search.createColumn({
                  name: "hours",
                  join: "time",
                  label: "Duration"
               }),
               search.createColumn({
                  name: "status",
                  label: "Status"
               }),
               search.createColumn({
                  name: "locationnohierarchy",
                  join: "time",
                  label: "LOCATION (no hierarchy)"
               }),
               search.createColumn({
                  name: "department",
                  join: "time",
                  label: "DEPARTMENT"
               }),
               search.createColumn({
                  name: "item",
                  join: "time",
                  label: "Item"
               }),
               search.createColumn({
                  name: "starttime",
                  join: "time",
                  label: "Start Time"
               }),
               search.createColumn({
                  name: "endtime",
                  join: "time",
                  label: "End Time"
               })
            ]
         });

         var isData = supportcaseSearchObj.run();
         var isFinalResult = isData.getRange(0, 999);
         var caseData = JSON.parse(JSON.stringify(isFinalResult));
         var htmlData=""
     

         log.debug("caseData",caseData)
         htmlData+="<tbody>"
        
         if(caseData[0].values.status[0].value==5)
         {

          htmlData="<table>"+
         "<thead>"+
                "<tr>"+
                    "<th title='Field #1'>Employee</th>"+
                    "<th title='Field #1'>Duration</th>"+
                    "<th title='Field #1'>Department</th>"+
                    "<th title='Field #1'>Location</th>"+
                "</tr>"+
            "</thead>"
        
            for(var j=0; j<caseData.length; j++)
            {
                for(var i=0; i<5; i++)   //set table coulmn
                {
                    htmlData+="<tr>"
                    htmlData+="<td>"+caseData[j].values.status[0].value+"</td>"
                    htmlData+="<td>"+caseData[j].values.status[0].value+"</td>"
                    htmlData+="<td>"+caseData[j].values.status[0].value+"</td>"
                    htmlData+="<td>"+caseData[j].values.status[0].value+"</td>"
                    
                    htmlData+="</tr>"
                }
            }
          htmlData+="</tbody>"

          htmlData+="</table>"    

         }


         var sentemail= email.send({
            author : '2484', 
            recipients : ['musab@point-star.com'], 
            subject : 'PS Vendor Portal Login Detail', 
            body : "<html>"+ htmlData+"</html>" 
            }); 

        }



        return {
            afterSubmit: afterSubmit
        };
    });