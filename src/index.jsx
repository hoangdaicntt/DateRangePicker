import * as moment from "moment";
import "moment/locale/vi"
import Picker from "pickerjs";
import "pickerjs/dist/picker.min.css";

moment.locale('vi');
var React = require('react');
var ReactDOM = require('react-dom');

const icons = {
    right: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNyIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDcgMTQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xLjAwMDUxIDE0TDcgN0wxLjAwMDUxIDBMNC43NjgzN2UtMDcgMS4xNjY1M0w1LjAwMDQgN0w0Ljc2ODM3ZS0wNyAxMi44MzM1TDEuMDAwNTEgMTRaIiBmaWxsPSIjNzc4RkJCIi8+Cjwvc3ZnPgo=',
    left: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNyIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDcgMTQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik01Ljk5OTQ5IDBMMCA3TDUuOTk5NDkgMTRMNyAxMi44MzM1TDEuOTk5NiA3TDcgMS4xNjY1M0w1Ljk5OTQ5IDBaIiBmaWxsPSIjNzc4RkJCIi8+Cjwvc3ZnPgo='
}

class AppComponent extends React.Component {
    render() {
        return <div>
            <MyDatePicker/>
        </div>;
    }
}

import './style.css';

let inputRef = React.createRef();

class MyDatePicker extends React.Component {
    constructor() {
        super();
        this.daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.monthMap = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
        let date = new Date();
        const current = moment(new Date());
        this.state = {
            currentYear: current.format('YYYY'),
            currentMonth: current.format('MM'),
            daysInMonth: this.getMonthDetails(new Date()),
            showDatePicker: true,
            selectedDateStart: null,
            selectedDateEnd: null,
            currentPoint: 'start',
            visiblePopupYearMonth: false,
            visiblePopupTime: false,
        }
        this.inputStart = React.createRef();
        this.inputEnd = React.createRef();
        this.popupYearMonthContent = React.createRef();
        this.popupYearMonthInput = React.createRef();
        this.popupYearMonthTrigger = React.createRef();
        this.popupYearMonth = null;
        this.pickerYearMonth = null;

        this.popupTimeContent = React.createRef();
        this.popupTimeInput = React.createRef();
        this.popupTimeTrigger = React.createRef();
        this.popupTime = null;
        this.pickerTime = null;
    }

    componentDidMount() {
        window.addEventListener('click', (e) => this.addBackDrop(e));

        //Popup year month
        this.pickerYearMonth = new Picker(this.popupYearMonthInput.current, {
            format: 'MM:YYYY',
            controls: false,
            inline: true,
        });
        this.pickerTime = new Picker(this.popupTimeInput.current, {
            format: 'HH:mm',
            controls: false,
            inline: true,
        });

    }

    componentWillUnmount() {
        window.removeEventListener('click', (e) => this.addBackDrop(e));
    }

    addBackDrop(e) {
        if (this.state.showDatePicker && !ReactDOM.findDOMNode(this).contains(e.target)) {
            this.showDatePicker(false);
        }
    }

    showDatePicker(showDatePicker = true) {
        this.setState({showDatePicker})
    }

    getMonthDetails(date) {
        var firstDayOfMonth = moment(date).startOf('month');
        var firstDayOfCal = firstDayOfMonth.clone().startOf('week');
        var lastDayOfMonth = firstDayOfMonth.clone().endOf('month');
        var lastDayOfCal = lastDayOfMonth.clone().endOf('week');
        var temp = firstDayOfCal.clone();
        var days = [{
            date: temp.toDate(),
            dateString: temp.format('D')
        }];
        while (temp.isBefore(lastDayOfCal) && days.length < 42) {
            temp = temp.add(1, 'day');
            days.push({
                date: temp.toDate(),
                dateString: temp.format('D'),
            });
        }
        while (days.length < 42) {
            temp = temp.add(1, 'day');
            days.push({
                date: temp.toDate(),
                dateString: temp.format('D')
            });
        }
        return days;
    }

    setDate(dateData) {
        let selectedDay = new Date(dateData.year, dateData.month - 1, dateData.date).getTime();
        this.setState({selectedDay})
        if (this.props.onChange) {
            this.props.onChange(selectedDay);
        }
    }

    setMonth(offset) {
        let date = new Date();
        if (offset > 0) {
            date = moment(new Date(this.state.currentYear, parseInt(this.state.currentMonth) - 1, 1)).add(offset, 'month');
        } else {
            date = moment(new Date(this.state.currentYear, parseInt(this.state.currentMonth) - 1, 1)).subtract(-offset, 'month');
        }
        this.changeMonth(date.toDate().getMonth(), date.toDate().getFullYear());
    }

    checkDayStatus(date) {
        const status = [];
        // Ngày hiện tại
        const today = new Date();
        const currentMonth = moment(new Date(this.state.currentYear, parseInt(this.state.currentMonth) - 1, 1));
        if (moment(date).format('DD/MM/YYYY') === moment(today).format('DD/MM/YYYY')) {
            status.push('current-date');
        }
        //tháng hiện tại
        if (moment(date).format('MM/YYYY') === currentMonth.format('MM/YYYY')) {
            status.push('current-month');
        }
        // Ngày được chọn
        if (moment(date).format('DD/MM/YYYY') === moment(this.state.selectedDateStart).format('DD/MM/YYYY')) {
            status.push('selected');
        }
        if (moment(date).format('DD/MM/YYYY') === moment(this.state.selectedDateEnd).format('DD/MM/YYYY')) {
            status.push('selected');
        }
        // Ngày ở giữa
        if (this.state.selectedDateStart && this.state.selectedDateEnd) {
            if ((date.getTime() <= this.state.selectedDateEnd.getTime()) && (date.getTime() >= this.state.selectedDateStart.getTime())) {
                status.push('inrange');
                // Ngày được chọn
                if (moment(date).format('DD/MM/YYYY') === moment(this.state.selectedDateStart).format('DD/MM/YYYY')) {
                    status.push('start');
                }
                if (moment(date).format('DD/MM/YYYY') === moment(this.state.selectedDateEnd).format('DD/MM/YYYY')) {
                    status.push('end');
                }
            }
        }
        return status;
    }

    selectDate(date) {
        if (this.state.currentPoint === 'start') {
            this.setState({selectedDateStart: date});
        }
        if (this.state.currentPoint === 'end') {
            this.setState({selectedDateEnd: date});
        }
    }

    changeCurrentPoint(currentPoint) {
        this.setState({currentPoint})
    }

    renderCalendar() {
        let days = [1, 2, 3, 4, 5, 6].map(row => {
            return <div className='c-days-container' key={row.toString()}>
                {this.state.daysInMonth.filter((x, index) => index >= (row - 1) * 7 && index < (row) * 7).map((item, index) => {
                    return (
                        <div onClick={() => this.selectDate(item.date)}
                             className={'c-day-container ' + this.checkDayStatus(item.date).join(' ')}
                             key={index * row}>
                            <div className='cdc-day'>
                                <span>{item.dateString}</span>
                            </div>
                        </div>
                    );
                })
                }
            </div>
        })


        return (
            <div className='c-container'>
                <div className='cc-head'>
                    {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d, i) =>
                        <div className='cch-name-container' key={i}>
                            <div className='cch-name'>{d}</div>
                        </div>)
                    }
                </div>
                <div className='cc-body'>
                    {days}
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className='MyDatePicker'>
                <div className='mdp-input' onClick={() => this.showDatePicker(true)}>
                    <input type='date' ref={inputRef}/>
                </div>
                {this.state.showDatePicker ? (
                    <div className='mdp-container'>
                        <div className='range-head'>
                            <input ref={this.inputStart} readOnly={true}
                                   value={moment(this.state.selectedDateStart).format('DD/MM/YYYY HH:mm')}
                                   onClick={() => this.changeCurrentPoint('start')}
                                   className={"app-input app-input-start " + (this.state.currentPoint === 'start' ? 'active' : '')}
                                   placeholder="Từ ngày"/>
                            <input ref={this.inputEnd} readOnly={true} onClick={() => this.changeCurrentPoint('end')}
                                   value={moment(this.state.selectedDateEnd).format('DD/MM/YYYY HH:mm')}
                                   className={"app-input app-input-end " + (this.state.currentPoint === 'end' ? 'active' : '')}
                                   placeholder="Đến ngày"/>
                        </div>
                        <div className='mdpc-head'>
                            <div className='mdpch-button'>
                                <div className='mdpchb-inner' onClick={() => this.setMonth(-1)}>
                                    <img src={icons.left}/>
                                </div>
                            </div>
                            <div className='mdpch-container'>
                                <div ref={this.popupYearMonthTrigger}
                                     className='mdpchc-view'>
                                    <span
                                        onClick={event => this.togglePopupYearMonth(true)}>{this.renderMonthYear()}</span>
                                    <div ref={this.popupYearMonthContent} id='popup-yearmonth'
                                         style={{display: (this.state.visiblePopupYearMonth ? 'block' : 'none')}}>
                                        <div onClick={() => this.togglePopupYearMonth(false)} className='popup-bg'/>
                                        <div className="app-popup-content">
                                            <div className='popup-yearmonth-head'>
                                                <p>Tháng</p>
                                                <p>Năm</p>
                                            </div>
                                            <div className='popup-yearmonth-body' ref={this.popupYearMonthInput}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='mdpch-button'>
                                <div className='mdpchb-inner' onClick={() => this.setMonth(1)}>
                                    <img src={icons.right}/>
                                </div>
                            </div>

                        </div>
                        <div className='mdpc-body'>
                            {this.renderCalendar()}
                        </div>
                        <div className='mdpc-body-time'>
                            <div>
                                <label>Chọn giờ</label>
                                <div>
                                    <span onClick={event => this.togglePopupTime(true)}>
                                        {moment(this.state.currentPoint === 'start' ? this.state.selectedDateStart : this.state.selectedDateEnd).format('HH:mm')}
                                    </span>
                                    <div ref={this.popupTimeContent} id='popup-time'
                                         style={{display: (this.state.visiblePopupTime ? 'block' : 'none')}}>
                                        <div onClick={() => this.togglePopupTime(false)} className='popup-bg'/>
                                        <div className="app-popup-content">
                                            <div className='popup-time-head'>
                                                <p>Giờ</p>
                                                <p>Phút</p>
                                            </div>
                                            <div className='popup-time-body' ref={this.popupTimeInput}/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                ) : ''}

            </div>
        )
    }

    renderMonthYear() {
        return this.monthMap[parseInt(this.state.currentMonth) - 1] + ' ' + this.state.currentYear;
    }

    togglePopupYearMonth(visible) {
        this.setState({visiblePopupYearMonth: visible});
        if (!visible) {
            const date = moment(this.pickerYearMonth.getDate());
            this.changeMonth(date.toDate().getMonth(), date.toDate().getFullYear());
        }
    }

    togglePopupTime(visible) {
        this.setState({visiblePopupTime: visible});
        if (!visible) {
            const date = moment(this.pickerTime.getDate());
            this.changeTime(date.toDate());
        }
    }

    changeMonth(month, year) {
        year = year ? year : this.state.currentYear;
        const date = moment(new Date(year, month, 1));
        this.setState({
            currentYear: date.format('YYYY'),
            currentMonth: date.format('MM'),
            daysInMonth: this.getMonthDetails(date.toDate()),
        });
    }

    changeTime(date) {
        console.log(date);
        if (this.state.currentPoint === 'start') {
            const currentDate = this.state.selectedDateStart;
            currentDate.setHours(date.getHours());
            currentDate.setMinutes(date.getMinutes());
            this.setState({
                selectedDateStart: currentDate
            });
        }
        if (this.state.currentPoint === 'end') {
            const currentDate = this.state.selectedDateEnd;
            currentDate.setHours(date.getHours());
            currentDate.setMinutes(date.getMinutes());
            this.setState({
                selectedDateEnd: currentDate
            });
        }

    }
}

export default class DateRangePicker {
    constructor(dom) {
        ReactDOM.render(<AppComponent/>, document.querySelector(dom));
    }
}
