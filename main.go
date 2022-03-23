package main

import (
	_ "embed"

	"github.com/wailsapp/wails"
)

//go:embed frontend/build/static/js/main.js
var js string

//go:embed frontend/build/static/css/main.css
var css string

func main() {

	newHistory := NewHelper()

	app := wails.CreateApp(&wails.AppConfig{
		Width:     500,
		Height:    405,
		Title:     "prodogo",
		JS:        js,
		CSS:       css,
		Colour:    "#131313",
		Resizable: true,
		MinWidth:  500,
		MinHeight: 405,
	})
	app.Bind(newHistory)
	app.Run()
}
