(function() {
    "use strict";
    adminapp.controller("LeadsController", [
        '$scope',
        '$log',
        'APIService',
        '$routeParams',
        '$rootScope',
        'ngProgressBarService',
        'ToastService',
        '$location',
        function($scope, $log,APIService, $routeParams, $rootScope, ngProgressBarService, ToastService, $location) {

            $scope.data = {
                leads: [],
                leadID: null,
                lead: {}
            };
            $scope.leadType= $routeParams.leadType;
        
            function getLeads(params) {
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("GET", APIService.getAPIUrl($scope.leadType), null, params)
                .then(function(response) {
                    $rootScope.$broadcast('endProgressbar');
                    if($scope.leadType=='buyerLeads' && response.buyer_leads.length>0) {
                        if($scope.data.leadID) 
                            $scope.data.lead = response.buyer_leads[0];
                        else
                           $scope.data.leads = response.buyer_leads;       
                   }       
                   else if($scope.leadType=='sellerLeads' && response.seller_leads.length>0) {
                    if($scope.data.leadID) 
                        $scope.data.lead = response.seller_leads[0];
                    else
                       $scope.data.leads = response.seller_leads;       
                    }
                    else if($scope.leadType=='contactusLeads' && response.contactus_leads.length>0) {
                    if($scope.data.leadID) 
                    $scope.data.lead = response.contactus_leads[0];
                    else
                   $scope.data.leads = response.contactus_leads;       
                    }       

                    else if($scope.data.leadID) {
                    ToastService.showActionToast("No such lead exists! GO BACK", 0)
                        .then(function(response) {
                            if($scope.leadType=='buyerLeads')
                                $location.url('/leads/buyerLeads');
                            else if($scope.leadType=='sellerLeads')        
                                $location.url('/leads/sellerLeads');
                            else if($scope.leadType=='contactusLeads')
                                $location.url('/leads/contactusLeads');

                    });
                    }
                    else{

                         if($scope.leadType=='buyerLeads')
                                 $scope.data.leads = response.buyer_leads;
                            else if($scope.leadType=='sellerLeads')        
                                $scope.data.leads = response.seller_leads;
                            else if($scope.leadType=='contactusLeads')
                                $scope.data.leads = response.contactus_leads; 
                    }
    }, function(error) {
        $rootScope.$broadcast('endProgressbar');
    });
            }

            function pageSetting() {
                   $scope.data.leadID = parseInt($routeParams.leadID);
                if($scope.leadType=='buyerLeads'){
                 
                    if($routeParams.leadID) {
                        getLeads({
                            buyerleadID: $routeParams.leadID
                        });
                    } else {
                            getLeads();
                    }
                } 
                else if($scope.leadType=='sellerLeads'){
                    if($routeParams.leadID){
                        getLeads({
                            sellerleadID: $routeParams.leadID
                        });
                    } else {
                        getLeads();
                }
            } if($scope.leadType=='contactusLeads'){
                if($routeParams.leadID) {
                    getLeads({
                        contactusleadID: $routeParams.leadID
                    });
                } else {
                    getLeads();
            }
        }
    }

    pageSetting();

    $scope.resolvedLeads=function(){
        getLeads({status: 1});

    }
    $scope.newLeads=function(){
        getLeads({status: 0});

    }
    $scope.reset = function() {
        pageSetting();
    };

    $scope.changeLeads = function(event, type) {
        if(type=="DELETE" || type=="PUT") {
            $rootScope.$broadcast('showProgressbar');
            APIService.apiCall(type, APIService.getAPIUrl($scope.leadType), $scope.data.lead)
            .then(function(response) {
                $rootScope.$broadcast('endProgressbar');
                pageSetting();
                ToastService.showActionToast("successful", 0).then(function(response) {
                    if(type=="DELETE") {
                        if($scope.leadType=='buyerLeads')
                            $location.url('/buyer-leads');
                        else if($scope.leadType=='sellerLeads')        
                            $location.url('/seller-leads');
                        else if($scope.leadType=='contactusLeads')
                            $location.url('/contactus-leads');
                    }
                });
            }, function(error) {
                $rootScope.$broadcast('endProgressbar');
                ToastService.showActionToast("something went wrong! please reload", 0);
            });
        }
    };

}
]);
})();
