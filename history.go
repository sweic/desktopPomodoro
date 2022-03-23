package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path"
	"reflect"
	"strconv"
	"time"

	// "reflect"
	"github.com/gen2brain/beeep"
	"github.com/wailsapp/wails"
)

type Helper struct {
	runtime *wails.Runtime
	logger  *wails.CustomLogger
}

type Config struct {
	ProdogoSeconds       float64
	SbreakSeconds        float64
	LbreakSeconds        float64
	AutoMove             bool
	AutoStartBreak       bool
	AutoStartProdogo     bool
	DesktopNotifications bool
	AlarmSound           float64
	Rest                 float64
}

type Timed struct {
	ProdogoSeconds int
	SbreakSeconds  int
	LbreakSeconds  int
}

func NewHelper() *Helper {
	result := &Helper{}
	return result
}
func DecodeFile(path string, v interface{}) interface{} {
	fileContents, _ := ioutil.ReadFile(path)
	json.Unmarshal(fileContents, v)
	return v
}

func EncodeWrite(path string, v interface{}) {
	encodedText, _ := json.Marshal(v)
	ioutil.WriteFile(path, encodedText, 0600)

}

func (h *Helper) CheckConfigExist() {
	cwd, err := os.UserConfigDir()
	prodogoPath := path.Join(cwd, "Prodogo")
	errs := os.MkdirAll(prodogoPath, os.ModePerm)
	if errs != nil {
		fmt.Println(err)
	}
	if err != nil {
		h.logger.Info("Error finding path?")
	}

	fileName := path.Join(cwd, "Prodogo", "history.json")
	_, err2 := os.Stat(fileName)
	var tmpHistory map[string]interface{}
	DecodeFile(fileName, &tmpHistory)

	if os.IsNotExist(err2) {
		h.InitHistoryFile()
	}

	newFileName := path.Join(cwd, "Prodogo", "config.json")
	_, err5 := os.Stat(newFileName)

	if os.IsNotExist(err5) {
		h.InitConfigFile()
	}

}

func (h *Helper) WailsInit(runtime *wails.Runtime) error {
	h.runtime = runtime
	h.logger = h.runtime.Log.New("Todos")
	h.CheckConfigExist()
	var test Config
	actual := make(map[string]interface{})
	appdataPath, _ := os.UserConfigDir()
	pathName := path.Join(appdataPath, "Prodogo", "config.json")
	data, _ := ioutil.ReadFile(pathName)
	json.Unmarshal(data, &actual)
	h.CheckConfigValidity(&test, actual)
	historyPath := path.Join(appdataPath, "Prodogo", "history.json")
	dataHistory, _ := ioutil.ReadFile(historyPath)
	v := make(map[string]map[string]float64)
	json.Unmarshal(dataHistory, &v)
	h.checkHistoryValidity(v)

	return nil

}

func (h *Helper) FetchConfig() Config {
	appdataPath, _ := os.UserConfigDir()
	pathName := path.Join(appdataPath, "Prodogo", "config.json")
	var result Config
	DecodeFile(pathName, &result)
	return result

}

func (h *Helper) CheckConfigValidity(v interface{}, actual map[string]interface{}) {
	a := reflect.ValueOf(v).Elem()
	fmt.Println(actual)
	for i := 0; i < a.NumField(); i++ {
		currType := a.Field(i).Kind()
		name := a.Type().Field(i).Name
		currValue := actual[name]
		if currValue == nil {
			h.InitConfigFile()
			return
		}
		if reflect.TypeOf(currValue).String() != currType.String() {
			h.InitConfigFile()
			return
		}
	}

}

func (h *Helper) checkHistoryValidity(file map[string]map[string]float64) {
	for _, value := range file {
		for _, val := range value {
			fmt.Println("below")
			fmt.Println(reflect.TypeOf(val).Kind())
			if reflect.TypeOf(val).Kind() == reflect.Float64 || reflect.TypeOf(val).Kind() == reflect.Int {
				continue

			} else {
				h.InitHistoryFile()
			}
		}
	}
}

func (h *Helper) InitConfigFile() {
	appdataPath, _ := os.UserConfigDir()
	pathName := path.Join(appdataPath, "Prodogo", "config.json")
	tmpFile := &Config{ProdogoSeconds: 1500, SbreakSeconds: 300, LbreakSeconds: 600, AutoMove: false, AutoStartBreak: false, AutoStartProdogo: false, DesktopNotifications: true, AlarmSound: 0, Rest: 4}
	EncodeWrite(pathName, tmpFile)
}

func (h *Helper) GetTodayDate() string {
	now := time.Now()
	y, m, d := now.Date()
	s := fmt.Sprintf("%d%02d%02d", y, int(m), d)
	return s
}

func (h *Helper) InitHistoryFile() {
	appdataPath, _ := os.UserConfigDir()
	pathName := path.Join(appdataPath, "Prodogo", "history.json")
	s := h.GetTodayDate()
	tmpTimedMap := make(map[string]Timed)
	tmpTimedMap[s] = Timed{}
	fmt.Println(tmpTimedMap)
	EncodeWrite(pathName, tmpTimedMap)

}

func (h *Helper) AppendSeconds(details map[string]interface{}) {

	appDataPath, _ := os.UserConfigDir()
	pathName := path.Join(appDataPath, "Prodogo", "history.json")
	fileContents, _ := ioutil.ReadFile(pathName)
	currentHistory := make(map[string]Timed)
	json.Unmarshal(fileContents, &currentHistory)
	d := fmt.Sprintf("%v", details["date"]) // 20220315
	tmpMap := currentHistory[d]
	m := fmt.Sprintf("%v", details["mode"])
	tm := fmt.Sprintf("%v", details["timeTaken"])
	t, _ := strconv.Atoi(tm)

	switch m {
	case "ProdogoSeconds":
		tmpMap.ProdogoSeconds += t
	case "SbreakSeconds":
		tmpMap.SbreakSeconds += t
	case "LbreakSeconds":
		tmpMap.LbreakSeconds += t

	}
	currentHistory[d] = tmpMap
	EncodeWrite(pathName, currentHistory)
}

func (h *Helper) Update(details map[string]interface{}) {
	h.AppendSeconds(details)
	var text string
	switch details["mode"] {
	case "ProdogoSeconds":
		text = "Times up! Take a break for your hard work!"
	case "SbreakSeconds":
		text = "Times up! Let's get started on your work!"
	case "LbreakSeconds":
		text = "You definitely deserved that long break! Push on champ!"
	}

	beeep.Notify("Prodogo", text, "Prodogo.ico")
}

func (h *Helper) SaveConfig(newConfig map[string]interface{}) {
	fmt.Println(newConfig)
	pathapp, _ := os.UserConfigDir()
	fileName := path.Join(pathapp, "Prodogo", "config.json")
	EncodeWrite(fileName, newConfig)

}

func (h *Helper) ConvertDate(currDate string) time.Time {

	year := currDate[:4]
	month := currDate[4:6]
	day := currDate[6:8]

	final := year + "-" + month + "-" + day + "T15:04:05+07:00"

	t, _ := time.Parse(time.RFC3339, final)

	return t
}

func (h *Helper) GetWeekBefore(currDate time.Time) map[string][7]string {
	var res [7]string
	var label [7]string

	for i := 6; i >= 0; i-- {
		dayBefore := currDate.Add(-time.Hour * time.Duration(24*i))
		y := dayBefore.Year()
		m := fmt.Sprintf("%02d", int(dayBefore.Month()))
		d := fmt.Sprintf("%02d", dayBefore.Day())
		final := strconv.Itoa(y) + m + d
		mn := dayBefore.Month().String()
		mnd := mn[:3]

		label[6-i] = mnd + "-" + d
		res[6-i] = final

	}
	fmt.Println(res)
	finalRes := map[string][7]string{"res": res, "label": label}
	return finalRes
}

func (h *Helper) RetrieveHistory() map[string]Timed {
	pathName, _ := os.UserConfigDir()
	fileName := path.Join(pathName, "Prodogo", "history.json")
	contents, _ := ioutil.ReadFile(fileName)
	var res map[string]Timed
	json.Unmarshal(contents, &res)
	return res

}

func (h *Helper) PrintProdogo(history map[string]Timed, datesArr [7]string) [7]int {
	var res [7]int
	for i, date := range datesArr {
		res[i] = history[date].ProdogoSeconds / 60
	}
	return res
}

func (h *Helper) FetchHistoryChart() map[string]interface{} {
	t := h.GetTodayDate()
	curr := h.ConvertDate(t)
	data := h.GetWeekBefore(curr)
	s := h.RetrieveHistory()
	dataArr := h.PrintProdogo(s, data["res"])

	res := map[string]interface{}{"datesArr": data["label"], "dataArr": dataArr}
	return res

}
