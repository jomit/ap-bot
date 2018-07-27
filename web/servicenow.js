var btoa = require("btoa");
var request = require("request-promise")
var logger = require("./logger");
var helper = require("./helper");
require("dotenv").load();

async function createOrUpdateTicket(botReply, session, updateDesc = false) {
    if(!process.env.ServiceNowUrl) return;
    
    var commentText = "\nUser : " + session.message.text;
    commentText += "\nBot : " + botReply;
    var ticketBody = {        
        "caller_id": "System Administrator",
        "comments": commentText
    };
    if (!session.conversationData.shortDesc && updateDesc) {
        session.conversationData.shortDesc = session.message.text;
        ticketBody.short_description = session.conversationData.shortDesc;
        ticketBody.description = session.conversationData.shortDesc;
    }
    var ticketSysId = helper.getFromSession(session, "serviceNowTicketSysId");
    if (!ticketSysId) {
        var newTicket = await create(ticketBody);
        helper.saveInSession(session, "serviceNowTicketNumber", newTicket.result.number);
        helper.saveInSession(session, "serviceNowTicketSysId", newTicket.result.sys_id);
        console.log("Created Ticket Number => " + newTicket.result.number);
    } else {
        var result = await update(ticketSysId, ticketBody);
        console.log("Updated Ticket Sys Id =>" + ticketSysId);
    }
};

async function resolveTicket(botReply, session, updateDesc = false) {
    if(!process.env.ServiceNowUrl) return;

    var commentText = "\nUser : " + session.message.text;
    commentText += "\nBot : " + botReply;
    var ticketBody = {
        "comments": commentText,
        "state": "6",
        "close_notes": "Resolve ticket",
        "close_code": "Closed/Resolved By Caller"
    };
    if (!session.conversationData.shortDesc && updateDesc) {
        session.conversationData.shortDesc = session.message.text;
        ticketBody.short_description = session.conversationData.shortDesc;
        ticketBody.description = session.conversationData.shortDesc;
    }
    var ticketSysId = helper.getFromSession(session, "serviceNowTicketSysId");
    var result = await update(ticketSysId, ticketBody);
    console.log("Resolved Ticket Sys Id =>" + ticketSysId);
};

async function assignTicket(botReply, session, updateDesc = false) {
    if(!process.env.ServiceNowUrl) return;
    
    var commentText = "\nUser : " + session.message.text;
    commentText += "\nBot : " + botReply;
    var ticketBody = {
        "comments": commentText,
        "assignment_group": "AP Admins"
    };
    if (!session.conversationData.shortDesc && updateDesc) {
        session.conversationData.shortDesc = session.message.text;
        ticketBody.short_description = session.conversationData.shortDesc;
        ticketBody.description = session.conversationData.shortDesc;
    }
    var ticketSysId = helper.getFromSession(session, "serviceNowTicketSysId");
    var result = await update(ticketSysId, ticketBody);
    console.log("Ticket Sys Id =>" + ticketSysId);
};

async function create(ticketBody) {
    var authzString = process.env.ServiceNowUserName + ":" + process.env.ServiceNowPassword;
    var options = {
        uri: process.env.ServiceNowUrl + "/api/now/table/incident",
        method: "POST",
        body: ticketBody,
        json: true,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Basic " + btoa(authzString)
        }
    }
    try {
        var newTicket = await request(options);
        logger.log("New ticket created =>" + newTicket.result.number);
        return newTicket;
    } catch (err) {
        console.error(err);
    }
};

async function update(sysId, ticketBody) {
    var authzString = process.env.ServiceNowUserName + ":" + process.env.ServiceNowPassword;
    var options = {
        uri: process.env.ServiceNowUrl + "/api/now/v1/table/incident/" + sysId,
        method: "PATCH",
        body: ticketBody,
        json: true,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Basic " + btoa(authzString)
        }
    }
    try {
        return await request(options);
    } catch (err) {
        console.error(err);
    }
};

exports.createOrUpdateTicket = createOrUpdateTicket;
exports.resolveTicket = resolveTicket;
exports.assignTicket = assignTicket;

