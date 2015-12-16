var Mailgun = require('mailgun');
Mailgun.initialize('dprealty.in', 'key-e381d5ad254b2c858fce41dc06ea9f79');
//Mailgun.initialize('sandbox7783da52ab3a4cff818cb04e2df818a6.mailgun.org', 'key-e381d5ad254b2c858fce41dc06ea9f79');


Parse.Cloud.define("sendEmail", function(request, response) {

    console.log(request.params.email);

    Mailgun.sendEmail({
        to: request.params.email,
        from: "My Awesome Name <ajay@dprealty.in>",
        subject: "Hello World!",
        text: "Hello from Parse Mailgun! It's awesome!"
    }, {
        success: function(httpResponse) {
            console.log(httpResponse);
            response.success("Email sent!");
        },
        error: function(httpResponse) {
            console.error(httpResponse);
            response.error("Uh oh, something went wrong");
        }
    });
});

Parse.Cloud.define("forgotPassword", function(request, response) {

    var _email = request.params.credentials.email;

    Parse.User.requestPasswordReset(_email, {
        success: function() {
            response.success("Password reset request was sent successfully!");
        },
        error: function(error) {
            response.error("Error: "+ error.code + " - "+ error.message);
        }
    });

});

Parse.Cloud.define("login", function(request, response) {

    var _username = request.params.credentials.username;
    var _password = request.params.credentials.password;

    //var user = new Parse.User();

    Parse.User.logIn(_username, _password, {
        success: function(user) {
            response.success(user);
        },
        error: function(user, error) {
            response.error("error");
        }
    });

});


Parse.Cloud.define("signUp", function(request, response) {

    console.log(request.params);

    var _name = request.params.credentials.name;
    var _email = request.params.credentials.email;
    var _password = request.params.credentials.password;

    // FIXME : need to add this when exposed via UI
    // var _contact = request.params.credentials.phone;
    // var _lastName = request.params.credentials.last_name;

    var _contact = "123456789";

    var regEmail = /\S+@\S+\.\S+/;

    if (!_name || !_email || !_contact) {
        response.error("Invalid or Blank Name/Email/Contact");
        return;
    }
    if (!regEmail.test(_email)) {
        response.error("Invalid Email");
        return;
    }

    var user = new Parse.User();
    user.set("username", _email);
    user.set("password", _password);
    user.set("email", _email);
    user.set("first_name", _name);

    // FIXME : need to add this when exposed via UI
    //user.set("phone", request.params.credentials.phone);
    //user.set("last_name", request.params.credentials.last_name);

    user.signUp(null, {
        success: function(user) {
            response.success(user);
        },
        error: function(error) {
            response.error("error");
        }
    });

    //var query = new Parse.Query(Parse.User);
    //query.equalTo("username", email);
    //query.find({
    //    success: function(results) {
    //        if (results.length == 0) {
    //
    //            var user = new Parse.User();
    //            user.set("username", request.params.credentials.email);
    //            user.set("password", request.params.credentials.password);
    //            user.set("email", request.params.credentials.email);
    //            user.set("first_name", request.params.credentials.name);
    //
    //            // FIXME : need to add this when exposed via UI
    //            //user.set("phone", request.params.credentials.phone);
    //            //user.set("last_name", request.params.credentials.last_name);
    //
    //            user.signUp(null, {
    //                success: function(user) {
    //                    response.success(user);
    //                },
    //                error: function(error) {
    //                    response.error("error");
    //                }
    //            });
    //        } else {
    //            var user = new Parse.User();
    //            user.id=results[0].id;
    //            orderTemp.set("USER_ID", user);
    //            orderTemp.save(null, {
    //                success: function(orderTemp1) {
    //                    response.success(orderTemp1);
    //                },
    //                error: function(error) {
    //                    response.error("error");
    //                }
    //            });
    //        }
    //
    //    },
    //    error: function(error) {
    //        response.error("error");
    //    }
    //});

});


Parse.Cloud.define("getActivityTypes", function(request, response) {
    var ActivityTypeDetail = Parse.Object.extend("ACTIVITY_TYPE_DETAIL");
    var Destination = Parse.Object.extend("DESTINATION");
 
    var destinationId = request.params.dest_objectId;
    var destinationObj = new Destination();
    destinationObj.id = destinationId;
    var query = new Parse.Query(ActivityTypeDetail);
    query.select("TITLE", "ACTIVITY_TYPE_IMAGE", "DESCRIPTION");
    query.equalTo("DESTINATION_ID", destinationObj);
    query.equalTo("FLAG_ACTIVE", true);
 
    query.find({
        success: function(activityTypeDetail) {
            response.success(activityTypeDetail);
        },
        error: function() {
            response.error("error");
        }
    });
});
 
Parse.Cloud.define("getDestination", function(request, response) {
    var destination = Parse.Object.extend("DESTINATION");
    var query = new Parse.Query(destination);
    query.select("NAME", "DESTINATION_IMAGE", "FLAG_ACTIVE");
    query.find({
        success: function(results) {
            response.success(results);
 
        },
        error: function(error) {
            response.error("error");
        }
    });
});
 
Parse.Cloud.define("getActivityDetails", function(request, response) {
      var dayObjest = {
                    0: "SUN",
                    1: "MON",
                    2: "TUE",
                    3: "WED",
                    4: "THU",
                    5: "FRI",
                    6: "SAT"
                };
 
                var Activity = Parse.Object.extend("ACTIVITY");
 
                var ActivityTypeDetail = Parse.Object.extend("ACTIVITY_TYPE_DETAIL");
 
 
                var activityTypeDetail = new ActivityTypeDetail();
                activityTypeDetail.id = request.params.activityTypeId;
 
                var query = new Parse.Query(Activity);
                query.include("ACTIVITY_TYPE_ID");
                query.include("OPERATOR_ID");
                query.include("ACTIVITY_OCCURENCE_ID");
                query.include("ACTIVITY_DURATION_ID");
                query.include("SUB_DETAILS_LIST");
                query.equalTo("ACTIVITY_TYPE_ID", activityTypeDetail);
                query.find({
                    success: function (results) {
                        var availablesDates = [];
                        var advanceOccouranceBookTime = results[0].get("ADVANCE_OCCURENCE_BOOK_COUNT");
 
                        var i = new Date().getDay();
                        for (var counter = i, k = 0; counter <= (advanceOccouranceBookTime + i); counter++, k++) {
                            var j = counter;
                            if (counter > 6) {
                                j = counter - 7;
                            }
                            if (results[0].get("ACTIVITY_OCCURENCE_ID").get(dayObjest[j])) {
                                var myDate = new Date();
                                myDate.setDate(myDate.getDate() + k);
                                availablesDates.push({
                                    availableDates: myDate.toDateString()
                                });
                            }
 
                        }
 
 
 
 
                        var jsonObj = [];
                        jsonObj.push({
                            ACTIVITY_ID: results[0].id,
                            DURATION_TYPE: results[0].get("ACTIVITY_DURATION_ID").get("DURATION_TYPE"),
                            DURATION_VALUE: results[0].get("ACTIVITY_DURATION_ID").get("DURATION_VALUE"),
                            PRICE: results[0].get("PRICE"),
                            AVAILABLE_DATES: availablesDates,
                            ACTIVITY_SUB_DETAILS: results[0].get("ACTIVITY_SUB_DETAILS"),
                            OPERATOR_NAME: results[0].get("OPERATOR_ID").get("OPERATOR_NAME"),
                            IMAGE: results[0].get("OPERATOR_ID").get("IMAGE")._url,
                            DESC: results[0].get("OPERATOR_ID").get("DESCRIPTION")
                        });
 
                        var jsonString = JSON.stringify(jsonObj);
            response.success(jsonString);
 
                    },
                    error: function (error) {
                        response.error("error");
                    }
                });
});
 
 
Parse.Cloud.define("getTicketsAvailable", function(request, response) {
    var Activity = Parse.Object.extend("ACTIVITY");
    var dayObjest = {
        0: "SUN",
        1: "MON",
        2: "TUE",
        3: "WED",
        4: "THU",
        5: "FRI",
        6: "SAT"
    };
    var query = new Parse.Query(Activity);
    query.include("ACTIVITY_TYPE_ID");
    query.include("OPERATOR_ID");
    query.include("ACTIVITY_OCCURENCE_ID");
    query.include("ACTIVITY_DURATION_ID");
    query.include("SUB_DETAILS_LIST");
    var activityId = request.params.activityId;
    query.get(activityId, {
        success: function(results) {
            var ticketsResult = [];
            var advanceOccouranceBookTime = results.get("ADVANCE_OCCURENCE_BOOK_COUNT");
            var i = new Date().getDay();
            for (var counter = i, k = 0; counter <= (advanceOccouranceBookTime + i); counter++, k++) {
                var j = counter;
                if (counter > 6) {
                    j = counter - 7;
                }
                if (results.get("ACTIVITY_OCCURENCE_ID").get(dayObjest[j])) {
                    var a = new Date();
                    a.setDate(a.getDate() + k);
                    ticketsResult.push({
                        date: a.toDateString(),
                        numberOfAvailableTickets: results.get("TOTAL_TICKET_COUNT")
                    });
                }
 
            }
            var activityName = results.get("ACTIVITY_TYPE_ID").get("TITLE");
            var minDate = new Date();
            minDate.setHours(0, 0, 0, 0);
            var maxDate = new Date();
            maxDate.setDate(minDate.getDate() + advanceOccouranceBookTime);
            maxDate.setHours(0, 0, 0, 0);
            var Ticket = Parse.Object.extend("TICKET");
            var ticketQuery = new Parse.Query(Ticket);
            ticketQuery.equalTo("ACTIVITY_ID", results);
            ticketQuery.greaterThanOrEqualTo("ACTIVITY_DATE_TIME", minDate)
            ticketQuery.lessThan("ACTIVITY_DATE_TIME", maxDate)
            ticketQuery.ascending("ACTIVITY_DATE_TIME");
            ticketQuery.find().then(function(obj) {
 
 
                for (var i = 0; i < obj.length; i++) {
                    var activityDateTime = obj[i].get("ACTIVITY_DATE_TIME");
                    var ticketSoldCount = obj[i].get("TICKET_SOLD_COUNT");
 
                    for (var h = 0; h < ticketsResult.length; h++) {
 
                        if (ticketsResult[h].date === activityDateTime.toDateString()) {
 
                            var totaTicketsAvailable = ticketsResult[h].numberOfAvailableTickets;
                            ticketsResult[h].numberOfAvailableTickets = totaTicketsAvailable - ticketSoldCount;
                            break;
                        }
                    }
                }
                var activityTicketDetail = {};
                activityTicketDetail.activityName = activityName;
                activityTicketDetail.activityId = activityId;
                jsonString = JSON.stringify(ticketsResult);
                activityTicketDetail.jsonString = jsonString;
                //console.log(jsonString);
                response.success(activityTicketDetail);
 
            }, function(error) {
                response.error("error");
            });
 
 
        },
        error: function(results, error) {
            response.error("error");
        }
    });
});
 
 
// not in use currently
Parse.Cloud.define("getTicketCounts", function(request, response) {
    var activityId = request.params.activityId;
    var bookingDate = request.params.bookingDate;
    var date = new Date(bookingDate);
    var Activity = Parse.Object.extend("ACTIVITY");
    var Destination = Parse.Object.extend("DESTINATION");
    var Ticket = Parse.Object.extend("TICKET");
 
    var activity = new Activity();
    activity.id = activityId;
 
    var query = new Parse.Query(Ticket);
    query.select("TICKET_SOLD_COUNT");
    query.equalTo("ACTIVITY_ID", activity);
 
    query.find({
        success: function(results) {
            var totalSoldCount = 0;
            for (var i = 0; i < results.length; i++) {
                totalSoldCount = totalSoldCount + results[i].get('TICKET_SOLD_COUNT');
            }
            query = new Parse.Query(Activity);
            query.select("TOTAL_TICKET_COUNT", "PRICE");
 
            query.get(activityId, {
                success: function(result) {
                    var totalTicketCount = result.get('TOTAL_TICKET_COUNT');
                    var remainCount = (parseInt(totalTicketCount) - parseInt(totalSoldCount));
                    var OrderTemp = Parse.Object.extend("ORDER_TEMP");
                    var orderTemp = new OrderTemp();
                    orderTemp.set("BOOKING_DATE", date);
                    orderTemp.set("ACTIVITY_ID", activity);
                    orderTemp.set("REMAIN_TICKET_COUNT", remainCount);
                    orderTemp.set("FLAG_ACTIVE", true);
                    orderTemp.set("ORDER_AMOUNT", result.get('PRICE'));
                    orderTemp.save(null, {
                        success: function(orderTemp1) {
                            response.success(orderTemp1);
                        },
                        error: function(error) {
                            response.error("error");
                        }
                    });
                },
                error: function(error) {
                    response.error("error");
                }
            });
        },
        error: function(error) {
            response.error("error");
        }
    });
});
 
Parse.Cloud.define("selectTicketCount", function(request, response) {
    var orderTempId = request.params.orderTId;
    var OrderTemp = Parse.Object.extend("ORDER_TEMP");
    var orderTemp = new OrderTemp();
    orderTemp.id = orderTempId;
    orderTemp.fetch().then(function() {
        response.success(orderTemp);
    });
});
 
Parse.Cloud.define("updateOrCreateUser", function(request, response) {
    var orderTempId = request.params.orderTId;
    var name = request.params.firstName + " " + request.params.lastName;
    var email = request.params.emailId;
    var contact = request.params.contact;
    var regEmail = /\S+@\S+\.\S+/;
 
    if (!name || !email || !contact) {
        response.error("Invalid or Blank Name/Email/Contact");
        return;
    }
    if (!regEmail.test(email)) {
        response.error("Invalid Email");
        return;
    }
    var Order = Parse.Object.extend("ORDER_TEMP");
    var orderTemp = new Order();
    orderTemp.id = orderTempId;
    query = new Parse.Query(Parse.User);
    query.equalTo("username", email);
    query.find({
        success: function(results) {
            if (results.length == 0) {
                var user = new Parse.User();
                user.set("NAME", name);
                user.set("username", email);
                user.set("CONTACT_NUMBER", contact);
                user.set("password", "my pass");
                user.set("email", email);
 
                user.signUp(null, {
                    success: function(user) {
                        orderTemp.set("USER_ID", user);
                        orderTemp.save(null, {
                            success: function(orderTemp1) {
                                response.success(orderTemp1);
                            },
                            error: function(error) {
                                response.error("error");
                            }
                        })
                    },
                    error: function(error) {
                        response.error("error");
                    }
                });
            } else {
				var user = new Parse.User();
				user.id=results[0].id;
                orderTemp.set("USER_ID", user);
                orderTemp.save(null, {
                    success: function(orderTemp1) {
                        response.success(orderTemp1);
                    },
                    error: function(error) {
                        response.error("error");
                    }
                });
            }
 
        },
        error: function(error) {
            response.error("error");
        }
    });
});
 
 
 
Parse.Cloud.define("getOrderSummary", function(request, response) {
    var orderTempId = request.params.orderTId;
    var OrderTemp = Parse.Object.extend("ORDER_TEMP");
    var orderTemp = new OrderTemp();
    orderTemp.id = orderTempId;
    orderTemp.fetch().then(function() {
        var activityId = orderTemp.get("ACTIVITY_ID").id;
        var Activity = Parse.Object.extend("ACTIVITY");
        var activity = new Activity();
        activity.id = activityId;
        var userId = orderTemp.get("USER_ID").id;
        var user = new Parse.User();
        user.id = userId;
        user.fetch();
        activity.fetch().then(function() {
            var activityTypeId = activity.get("ACTIVITY_TYPE_ID").id;
            var ActivityTypeDetail = Parse.Object.extend("ACTIVITY_TYPE_DETAIL");
            var activityType = new ActivityTypeDetail();
            activityType.id = activityTypeId;
            activityType.fetch();
            var locationId = activity.get("LOCATION_ID").id;
            var LocationDetail = Parse.Object.extend("LOCATION_DETAIL");
            var location = new LocationDetail();
            location.id = locationId;
            location.fetch().then(function() {
                var destinationId = location.get("DESTINATION_ID").id;
                var DESTINATION = Parse.Object.extend("DESTINATION");
                var destination = new DESTINATION();
                destination.id = destinationId;
                destination.fetch().then(function() {
                    var result = {};
                    result.activityName = activityType.get("TITLE");
                    result.activityPrice = activity.get("PRICE");
                    result.destinationName = destination.get("NAME");
                    result.bookingDate = orderTemp.get("BOOKING_DATE");
                    result.orderAmount = orderTemp.get("ORDER_AMOUNT");
                    result.ticketCount = orderTemp.get("TICKET_COUNT");
                    result.location = location.get("LOCATION_NAME");
                    result.username = user.get("NAME");
                    result.email = user.get("email");
                    result.contact = user.get("CONTACT_NUMBER");
                    response.success(result);
                });
            });
        });
    });
})
 
Parse.Cloud.define("getDiscount", function(request, response) {
    var orderTempId = request.params.orderTId;
    var disCode = request.params.disCode;
    var Discount = Parse.Object.extend("DISCOUNT");
    var query = new Parse.Query(Discount);
    query.select("MIN_ORDER_VALUE", "MAX_DISCOUNT", "DISCOUNT_PERCENT");
    query.equalTo("CODE", disCode);
    query.equalTo("FLAG_ACTIVE", true);
 
    query.find({
        success: function(discount) {
            var OrderTemp = Parse.Object.extend("ORDER_TEMP");
            var orderTemp = new OrderTemp();
            orderTemp.id = orderTempId;
            orderTemp.fetch().then(function() {
                var totalPrice = parseInt(orderTemp.get("ORDER_AMOUNT"));
                var minOrderAmount = parseInt(discount[0].get("MIN_ORDER_VALUE"));
 
                var maxDiscount = parseInt(discount[0].get("MAX_DISCOUNT"));
 
                var discountPercent = parseInt(discount[0].get("DISCOUNT_PERCENT"));
                if (Number(totalPrice) < Number(minOrderAmount)) {
                    response.error("Order Amount must be above Rs." + minOrderAmount);
                } else {
                    var discountAmt = ((totalPrice * discountPercent) / 100);
                    if (discountAmt > maxDiscount) {
                        discountAmt = maxDiscount;
                    }
                    var finalPrice = totalPrice - discountAmt;
                    var Discount = Parse.Object.extend("DISCOUNT");
                    var discountClass = new Discount();
                    discountClass.id = discount[0].id;
                    orderTemp.set("DISCOUNT_ID", discountClass);
                    orderTemp.set("FINAL_ORDER_AMOUNT", finalPrice);
                    orderTemp.save().then(function() {
                        var result = {};
                        result.discountAmount = discountAmt;
                        result.finalOrderPrice = finalPrice;
                        result.discountCode = disCode;
                        response.success(result);
                    });
                }
            })
        },
        error: function(error) {
            response.error("Coupon Code not found");
        }
    });
})
 
Parse.Cloud.define("insertOrderTemp", function(request, response) {
    var activityId =  request.params.activityId;
                var bookingDate =  request.params.bookingDate;
 
                var minDate = new Date(bookingDate);
                minDate.setHours(0, 0, 0, 0);
                var maxDate = new Date();
                maxDate.setDate(minDate.getDate() + 1);
                maxDate.setHours(0, 0, 0, 0);
                var Ticket = Parse.Object.extend
                var date = new Date(bookingDate);
                var selectTicketCount =request.params.ticketCount;
                var Activity = Parse.Object.extend("ACTIVITY");
                var Destination = Parse.Object.extend("DESTINATION");
                var Ticket = Parse.Object.extend("TICKET");
 
                var activity = new Activity();
                activity.id = activityId;
 
                var query = new Parse.Query(Ticket);
                query.select("TICKET_SOLD_COUNT");
                query.equalTo("ACTIVITY_ID", activity);//ACTIVITY_DATE_TIME
                query.greaterThanOrEqualTo("ACTIVITY_DATE_TIME", minDate)
                query.lessThan("ACTIVITY_DATE_TIME", maxDate)
 
                query.find({
                    success: function (results) {
                        var totalSoldCount = 0;
                        for (var i = 0; i < results.length; i++) {
                            totalSoldCount = totalSoldCount + results[i].get('TICKET_SOLD_COUNT');
                        }
                        query = new Parse.Query(Activity);
                         query.include("ACTIVITY_DURATION_ID");
                        query.select("TOTAL_TICKET_COUNT", "PRICE","ACTIVITY_DURATION_ID");
 
                        query.get(activityId, {
                            success: function (result) {
                                var totalTicketCount = result.get('TOTAL_TICKET_COUNT');
								var activityTime = result.get("ACTIVITY_DURATION_ID").get("ACTIVITY_TIME");
                                var hrMin = activityTime.split(":");
                                var hr = parseInt(hrMin[0]);
                                var min = parseInt(hrMin[1]);
                                date.setHours(hr, min, 0, 0);
                                var remainCount = (parseInt(totalTicketCount) - parseInt(totalSoldCount));
                                var OrderTemp = Parse.Object.extend("ORDER_TEMP");
                                var orderTemp = new OrderTemp();
                                orderTemp.set("BOOKING_DATE", date);
                                orderTemp.set("ACTIVITY_ID", activity);
                                orderTemp.set("REMAIN_TICKET_COUNT", remainCount);
                                orderTemp.set("FLAG_ACTIVE", true);
                                var orderAmt = parseInt(selectTicketCount) * parseInt(result.get('PRICE'));
                                orderTemp.set("ORDER_AMOUNT", orderAmt);
                                orderTemp.set("TICKET_COUNT", parseInt(selectTicketCount));
                                orderTemp.save(null, {
                                    success: function (orderTemp1) {
                                         response.success(orderTemp1);
                                    },
                                    error: function (error) {
                                        response.error("error");
                                    }
                                });
                            },
                            error: function (error) {
                                response.error("error");
                            }
                        });
                    },
                    error: function (error) {
                        response.error("error");
                    }
                });
});
 
Parse.Cloud.define("insertOrder", function (request, response) {
        var orderTempId = request.params.orderTId;
        var OrderTemp = Parse.Object.extend("ORDER_TEMP");
        var query = new Parse.Query(OrderTemp);
        var paymentMode = "ONLINE"; 
        query.get(orderTempId, {
            success: function (results) {
            var Order = Parse.Object.extend("ORDER");
            var order = new Order();
            order.set("ORDER_AMOUNT", results.get("ORDER_AMOUNT"));
            order.set("DISCOUNT_ID", results.get("DISCOUNT_ID"));
            order.set("FINAL_DISCOUNT_AMOUNT", results.get("FINAL_DISCOUNT_AMOUNT"));
            order.set("PAYMENT_MODE", paymentMode);
            order.set("USER_ID", results.get("USER_ID"));
            order.save(null, {
                success: function(order) {
                      var TICKET = Parse.Object.extend("TICKET");
                      var ticket = new TICKET();
                      ticket.set("ACTIVITY_ID", results.get("ACTIVITY_ID"));
                      ticket.set("TICKET_SOLD_COUNT", results.get("TICKET_COUNT"));
                      ticket.set("CUSTOMER_CONTACT_NO", results.get("MOBILE_NUMBER"));
                      ticket.set("TICKET_AMOUNT",results.get("ORDER_AMOUNT"));
					  ticket.set("ACTIVITY_DATE_TIME",results.get("BOOKING_DATE"));
                      ticket.set("ORDER_ID",order);
                      ticket.save(null, {
                          success: function(ticket) {
                            var orderTemp = new OrderTemp();
                            orderTemp.id = orderTempId;
                            orderTemp.destroy();
							response.success(order);
                          },
                          error: function(error) {
                             response.error("error");
                            }
                        });
                },
                error: function(error) {
                    response.error("error");
                }
              });
        },
        error:function (error) {
            response.error("error");
        }
    });             
});