/*
    Summary: Create the application window.
    
    Author: Elena Scobici (elena@scobici.com)
*/

const electron = require("electron");
const {ipcMain, dialog, session, app, BrowserWindow, Menu} = require('electron');
var fs = require('fs');
const path = require('path');

app.on('ready', _ => {
    mainWindow = new BrowserWindow({
        height: 768,
        width: 1366
    })
    mainWindow.loadURL(`file://${__dirname}/home.html`)
    mainWindow.on('closed', _ => {
        mainWindow = null
    })
    mainWindow.setMenu(null); // this hides the developer tool menu
})