/*
    Summary: Create the application window.
*/

let electron = require("electron");
const {ipcMain, dialog, session, app, BrowserWindow, Menu} = require('electron');
var fs = require('fs');
let path = require('path');

app.on('ready', (_:any) => {
    let mainWindow = new BrowserWindow({
        height: 768,
        width: 1366
    })
    mainWindow.loadURL(`file://${__dirname}/home.html`)
    mainWindow.on('closed', (_:any) => {
        mainWindow = null
    })
    // mainWindow.setMenu(null); // this hides the developer tool menu
})