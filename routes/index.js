/*
 *  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.
 */

// routes/index.js

var url = require('url');
var appSettings = require('../models/appSettings.js');
var os = require('os');
var ifaces = os.networkInterfaces();

//var ip;

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
      ip = iface.address;
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
      ip = iface.address;
    }
  });
});

module.exports = function (app, passport) {
    
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function (req, res) {
        res.render('index', {title: 'O365-Node-Express-Ejs | Home',ipAddress:ip}); 
    });
    
    // =====================================
    // LOGIN ===============================
    // =====================================
    app.get('/login', function (req, res) {
        // redirect the login request to Azure Active Directory oauth2
        res.redirect('/auth/azureOAuth');
    });
    
    // =====================================
    // Starts Azure authentication/authorization
    // =====================================
    app.get('/auth/azureOAuth', 
        passport.authenticate('azureoauth', { failureRedirect: '/' })
    );
    
    // =====================================
    // cache and handle access token and refresh token as returned from AAD. 
    // This presumes that the app's redirectURL is set in AAD as
    // 'http://{host}/auth/azureOAuth/callback' 
    app.get('/auth/azureOAuth/callback', 
        passport.authenticate('azureoauth', { failureRedirect: '/' }),
        function (req, res) {
            console.dir(passport.user.tokens);
            res.render('apiTasks', { user : passport.user });
    });
    
       
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

};


// *********************************************************
//
// O365-Node-Express-Ejs-Sample-App, https://github.com/OfficeDev/O365-Node-Express-Ejs-Sample-App
//
// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// *********************************************************

