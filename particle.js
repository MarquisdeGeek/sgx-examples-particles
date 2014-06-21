/**
Particle system - An SGX Example App

Copyright 2011-2014 by Steven Goodwin. All Rights Reserved.

This file is released under the GNU GPL, version 2.0

Please see the licensing conditions for details.

http://www.sgxengine.com

*/
var g_bIsLoaded = false;
var g_pRoot, g_pInterface;
var g_pEmitter;
var g_ptColor1 = new sgxPoint2f();
var g_ptColor2 = new sgxPoint2f();
var g_ColorWheelData;
var g_iCurrentPreset = 0;


function preset0(emitter) {
	var settings = g_pEmitter.createSettings();
	emitter.changeSettings(settings);	
	emitter.setTextureRegion(0);
}

function preset1(emitter) {
	var settings = g_pEmitter.createSettings();
	
	settings.m_fVelocityInitial = 158.3;
	settings.m_fAngularVelocityInitial = 0.48;
	settings.m_fLifespanInitial = 0.73;
	settings.m_fSizeInitial = 2.6;
	settings.m_fEmissionRate = 10;

	emitter.changeSettings(settings);	
	emitter.setTextureRegion(4);
}

function preset2(emitter) {
	var settings = g_pEmitter.createSettings();
	
	settings.m_fVelocityInitial = 210;
	settings.m_fAngularVelocityInitial = 6.8;
	settings.m_fLifespanInitial = 1.25;
	settings.m_fSizeInitial = 1.5;
		
	settings.m_fEmissionRate = 5.7;

	emitter.changeSettings(settings);	
	emitter.setTextureRegion(2);
}

function preset3(emitter) {
	var settings = g_pEmitter.createSettings();
	
	settings.m_fVelocityInitial = 22.9;
	settings.m_fAngularVelocityInitial = 0.8;
	settings.m_fLifespanInitial = 7.6;
	settings.m_fSizeInitial = 1.1;
		
	settings.m_fEmissionRate = 11.8;

	emitter.changeSettings(settings);	
	emitter.setTextureRegion(3);
}


function SGXPrepare_OS() {
	// Mounting allows you a lot of extra flexibility.
	// The only thing it limits you to, is being required to load the resources from anywhere
	// your own server. Normally, this is exactly what you want. For demo code, it's not
	// so useful.
	//sgx.filesystem.Engine.get().mountDirectory("sgx", "http://sgxengine.com/assets/sgx");

	sgxskeleton.PrepareLoadingPage();

	new sgx.main.System();

	sgx.graphics.Engine.create(640,428);	// the size of the draw area we (as programmers) will use

	sgx.main.System.writePage();
	sgx.main.System.initialize();	// optionally pass the 'loading_screen' ID here, to hide the contents once loaded
}

function SGXinit() {

	var stdFont = sgx.graphics.FontManager.get().registerFont("std", null, new sgx.graphics.FontParameters(sgx.graphics.FontParameters.eFontTypeNatural, 10, "Arial"));
	sgx.gui.Engine.get().setDefaultFont(stdFont);
	g_pDesign = sgxutils.gui.DesignManager.load("particle/ui");
	g_pTexture = sgx.graphics.TextureManager.get().load("particle/ball");
	g_pEmitter = new Emitter();
	preset1(g_pEmitter);

	var pSurface = sgx.graphics.DrawSurfaceManager.get().getDisplaySurface();
	g_pEmitter.setDrawArea(pSurface, 213+(640-428), 96);

}

function SGXstart() {
}


function SGXupdate(telaps) {
	if (g_bIsLoaded) {
		g_pEmitter.update(telaps);
	}
}

/**
 * @constructor
 */
PUI = function () {
}

PUI.prototype.getColorWheelRGB = function(widget, position) {
	var dx = position.x - widget.getX();
	var dy = position.y - widget.getY();
	var col = new sgx.ColorRGBA();
	g_ColorWheelData.getPixelAt(col, dx, dy);
	
	//texture.unlock(imageData);

	return col;
}

refreshInterface = function(emitter) {
	var settings = emitter.m_Settings;
	// prepare UI with defaults - check boxes
	g_pInterface.getWidgetOfUserData(1030).asCheckBox().setCheckedState(settings.m_fVelocityVariance==0?FALSE:TRUE);
	g_pInterface.getWidgetOfUserData(1031).asCheckBox().setCheckedState(settings.m_fAngularVelocityVariance==0?FALSE:TRUE);
	g_pInterface.getWidgetOfUserData(1032).asCheckBox().setCheckedState(settings.m_fLifespanVariance==0?FALSE:TRUE);
	g_pInterface.getWidgetOfUserData(1033).asCheckBox().setCheckedState(settings.m_fSizeVariance==0?FALSE:TRUE);
	// then sliders
	var w;
	var sliderParams = [10,20,  11, SGX_2PI,  12, SGX_2PI,  30, 1000, 31,10, 32, 10,  33,10 ];
	for(var i=0;i<sliderParams.length;i+=2) {		
		w = g_pInterface.getWidgetOfUserData(sliderParams[i]).asSliderBar();
		w.m_SetupParams = new sgxGUISliderBarSetupParams(sliderParams[i+1]);
		switch(sliderParams[i]) {
			case 10:
					w.setTrackPositionHorizontal(settings.m_fEmissionRate);
					break;
			case 11:
					w.setTrackPositionHorizontal(settings.m_fEmissionAngleFrom);
					break;
			case 12:
					w.setTrackPositionHorizontal(settings.m_fEmissionAngleTo);
					break;
			//
			case 30:
					w.setTrackPositionHorizontal(settings.m_fVelocityInitial);
					break;
			case 31:
					w.setTrackPositionHorizontal(settings.m_fAngularVelocityInitial);
					break;
			case 32:
					w.setTrackPositionHorizontal(settings.m_fLifespanInitial);
					break;
			case 33:
					w.setTrackPositionHorizontal(settings.m_fSizeInitial);
					break;
			//
		}
	}
}

PUI.prototype.onGUIWidgetPressed = function(widget, position) {
	this.onGUIWidgetCursorDragged(widget, position);
	
	return true;
}

PUI.prototype.onGUIWidgetSelect= function(widget, position) {
	var uid = widget.getUserData();
	
	switch(uid) {
		case 	20:
		case 	21:
		case 	22:
		case 	23:
		case 	24:
			g_pEmitter.setTextureRegion(uid-20);
			break;
		case	1030:
			g_pEmitter.m_Settings.m_fVelocityVariance = widget.getCheckedState() ? 0.3 : 0;
			break;
		case	1031:
			g_pEmitter.m_Settings.m_fAngularVelocityVariance = widget.getCheckedState() ? 0.9 : 0;
			break;
		case	1032:
			g_pEmitter.m_Settings.m_fLifespanVariance = widget.getCheckedState() ? 0.4 : 0;
			break;
		case	1033:
			g_pEmitter.m_Settings.m_fSizeVariance = widget.getCheckedState() ? 0.4 : 0;
			break;
		
		case	2000:
			if (g_pEmitter.isEnabled()) {
				g_pEmitter.disable();
				widget.setText("Resume");
			} else {
				g_pEmitter.enable();
				widget.setText("Pause");
			}
			break;
		case	2001:
			if (g_pEmitter.m_pEnvironment.m_fGravityOn) {
				g_pEmitter.m_pEnvironment.m_fGravityOn = FALSE;
				widget.setText("Gravity: On");
			} else {
				g_pEmitter.m_pEnvironment.m_fGravityOn = TRUE;
				widget.setText("Gravity: Off");
			}
			break;
		case	2002:
			if (++g_iCurrentPreset == 4) {
				g_iCurrentPreset = 0;
			}
			g_pEmitter.reset();
			var fn = "preset"+g_iCurrentPreset+"(g_pEmitter)";
			eval(fn);
			
			refreshInterface(g_pEmitter);
			
			// Force a refresh of the color wheel
			var w = g_pInterface.getWidgetOfUserData(50);
			this.onGUIWidgetCursorDragged(w, g_ptColor1);

			break;
		}
	
	return true;
}

PUI.prototype.onGUIWidgetCursorDragged = function(widget, position) {
	if (widget.getUserData() == 50) {
		var rgb = this.getColorWheelRGB(widget, position);
		if (rgb.a) {
			g_pEmitter.m_Settings.m_rgbaColorInitial = (rgb);
			g_ptColor1.set(position);
		}

	} else if (widget.asSliderBar()) {
		var uid = widget.getUserData();
		var pos = new sgxPoint2f();
		var track = widget.getTrackPositionHorizontal(pos);
		
		switch(uid) {
			case	10:
				g_pEmitter.m_Settings.m_fEmissionRate = track;
				break;
			case	11:
				g_pEmitter.m_Settings.m_fEmissionAngleFrom = track;
				break;
			case	12:
				g_pEmitter.m_Settings.m_fEmissionAngleTo = track;
				break;
			case	30:
				g_pEmitter.m_Settings.m_fVelocityInitial = track;
				break;
			case	31:
				g_pEmitter.m_Settings.m_fAngularVelocityInitial = track;
				break;
			case	32:
				g_pEmitter.m_Settings.m_fLifespanInitial = track;
				break;
			case	33:
				g_pEmitter.m_Settings.m_fSizeInitial = track;
				break;
		}
	}
	
	return TRUE;
}

function postLoadInitialize() {
	var pui = new PUI();
	g_bIsLoaded = true;
	//
	g_pEmitter.setTexture(g_pTexture);
	//
	g_pRoot = g_pDesign.getScreen(0).applyScreen();
	g_pInterface = g_pDesign.getScreen(1).applyScreen();
	g_pHoopTexture = g_pDesign.getAssetData("colorhoop");
	
	g_pInterface.setHandler(pui, TRUE);
	sgx.gui.Engine.get().setRootWidget(g_pInterface);

	// Grab the color wheel texture
	var texture = g_pDesign.getAssetData("swatch");
	g_ColorWheelData = new CImageData();
	texture.lock(g_ColorWheelData);
	
	refreshInterface(g_pEmitter);

	// init color wheels
	var rc = new sgx.Rect2f();
	g_pInterface.getWidgetOfUserData(50).asHotSpot().getArea(rc);
	g_ptColor1.set(rc.centre());

	
}

function SGXdraw() {
var pSurface = sgx.graphics.DrawSurfaceManager.get().getDisplaySurface();

	if (!g_bIsLoaded) {
		if (g_pDesign.isLoaded() && g_pTexture.isLoaded()) {
			postLoadInitialize();
		}
		return;
	}

	// TODO: Move these into a callback
	pSurface.setFillColor(sgx.ColorRGBA.White);	
	g_pRoot.draw(pSurface, 0, 0);

	g_pEmitter.draw();
	
	pSurface.setFontColor(sgx.ColorRGBA.White);
	pSurface.setFillColor(sgx.ColorRGBA.White);
	g_pInterface.draw(pSurface, 0, 0);
	
	pSurface.setFillTexture(g_pHoopTexture);	
	pSurface.fillPoint(g_ptColor1);
	pSurface.fillPoint(g_ptColor2);
	
	sgx.graphics.Engine.get().draw();
}
