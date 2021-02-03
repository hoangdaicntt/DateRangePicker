import * as moment from "moment";
import "moment/locale/vi"
import Picker from "pickerjs";
import "pickerjs/dist/picker.min.css";
import SwiperCore, {Navigation} from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/swiper.scss';
import './style.scss';

SwiperCore.use([Navigation]);

moment.locale('vi');
var React = require('react');
var ReactDOM = require('react-dom');

const icons = {
    right: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNyIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDcgMTQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xLjAwMDUxIDE0TDcgN0wxLjAwMDUxIDBMNC43NjgzN2UtMDcgMS4xNjY1M0w1LjAwMDQgN0w0Ljc2ODM3ZS0wNyAxMi44MzM1TDEuMDAwNTEgMTRaIiBmaWxsPSIjNzc4RkJCIi8+Cjwvc3ZnPgo=',
    left: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNyIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDcgMTQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik01Ljk5OTQ5IDBMMCA3TDUuOTk5NDkgMTRMNyAxMi44MzM1TDEuOTk5NiA3TDcgMS4xNjY1M0w1Ljk5OTQ5IDBaIiBmaWxsPSIjNzc4RkJCIi8+Cjwvc3ZnPgo=',
    down: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOSIgaGVpZ2h0PSI1IiB2aWV3Qm94PSIwIDAgOSA1IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMCAwLjcxNDY0Nkw0LjUgNUw5IDAuNzE0NjQ2TDguMjUwMDkgMEw0LjUgMy41NzE3MkwwLjc0OTkxMiAwTDAgMC43MTQ2NDZaIiBmaWxsPSIjNzc4RkJCIi8+Cjwvc3ZnPgo='
}

class HDDateRangePicker extends React.Component {
    constructor() {
        super();
        this.rangeDefault = [
            {
                text: 'Hôm nay',
                start: moment(new Date()).startOf('date').toDate(),
                end: moment(new Date()).endOf('date').toDate(),
            }, {
                text: '2 ngày',
                start: moment(new Date()).subtract(2, 'days').startOf('date').toDate(),
                end: moment(new Date()).endOf('date').toDate(),
            }, {
                text: '7 ngày',
                start: moment(new Date()).subtract(7, 'days').startOf('date').toDate(),
                end: moment(new Date()).endOf('date').toDate(),
            }, {
                text: '15 ngày',
                start: moment(new Date()).subtract(15, 'days').startOf('date').toDate(),
                end: moment(new Date()).endOf('date').toDate(),
            },
        ]
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
            rangeText: ''
        }
        this.inputStart = React.createRef();
        this.inputEnd = React.createRef();
        this.popupYearMonthContent = React.createRef();
        this.popupYearMonthInput = React.createRef();
        this.popupYearMonthTrigger = React.createRef();
        this.pickerYearMonth = null;

        this.popupTimeContent = React.createRef();
        this.popupTimeInput = React.createRef();
        this.pickerTime = null;
    }

    componentDidMount() {
        const date = new Date();
        date.setHours(0);
        date.setMinutes(0)
        //Popup year month
        this.pickerYearMonth = new Picker(this.popupYearMonthInput.current, {
            format: 'MM:YYYY',
            controls: false,
            inline: true,
            date: date
        });
        this.pickerTime = new Picker(this.popupTimeInput.current, {
            format: 'HH:mm',
            controls: false,
            inline: true,
            date: date
        });
        this.changeCurrentPoint('start');
    }

    componentWillUnmount() {
    }

    convertTextTime() {
        let time, hasMin = true, hasSec = true;
        const startTime = this.state.selectedDateStart ? this.state.selectedDateStart.getTime() : 0;
        const endTime = this.state.selectedDateEnd ? this.state.selectedDateEnd.getTime() : 0;
        time = (endTime - startTime) / 1000;
        if (time === 0 || !this.state.selectedDateStart || !this.state.selectedDateEnd) {
            return '';
        }
        var text = '';
        var months = Math.floor(time / 60 / 60 / 24 / 30);
        if (months > 0) text += months + ' tháng ';
        time -= months * 30 * 24 * 60 * 60;
        var days = Math.floor(time / 60 / 60 / 24);
        if (text.length > 0 || days > 0) {
            text += days + ' ngày ';
        }
        time -= days * 24 * 60 * 60;
        var hours = Math.floor(time / 60 / 60);
        if (text.length > 0 || hours > 0) {
            text += hours + ' giờ ';
        }
        if (months == 0) {
            // Nếu có tháng thì k hiển thị phút nữa
            time -= hours * 60 * 60;
            var minutes = Math.floor(time / 60);
            if (hasMin && (text.length > 0 || minutes > 0)) {
                text += minutes + ' phút ';
            }

            // Nếu có ngày thì k hiển thị giây nữa
            time -= minutes * 60;
            if (hasSec && ((text.length > 0 || time > 0) && days == 0)) {
                text += Math.round(time) + ' giây';
            }
        }
        if (!text.length) text = '0 giây';
        return text;
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
        date = new Date(date.getTime());
        if (this.state.currentPoint === 'start') {
            if (!!this.state.selectedDateEnd && (date.getTime() > this.state.selectedDateEnd.getTime())) {
                return;
            }
            this.setState({selectedDateStart: date});
        }
        if (this.state.currentPoint === 'end') {
            if (!!this.state.selectedDateStart && (date.getTime() < this.state.selectedDateStart.getTime())) {
                return;
            }
            this.setState({selectedDateEnd: date});
        }
    }

    changeCurrentPoint(currentPoint) {
        this.setState({currentPoint});
        const date = (currentPoint === 'start' ? this.state.selectedDateStart : this.state.selectedDateEnd);
        if (date) {
            this.pickerTime.setDate(date);
        }
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

    selectDefaultDate(item) {
        this.setState({
            selectedDateStart: item.start,
            selectedDateEnd: item.end,
        });
    }

    render() {
        return (
            <div className='HDDateRangePicker'>
                {this.state.showDatePicker ? (
                    <div className='mdp-container'>
                        <div className='range-head-days'>
                            <Swiper
                                spaceBetween={16}
                                slidesPerView={3}
                                navigation>
                                {this.rangeDefault.map((value, index) => {
                                    return (
                                        <SwiperSlide key={index.toString()}>
                                            <span className="item-select-range"
                                                  onClick={() => this.selectDefaultDate(value)}>{value.text}</span>
                                        </SwiperSlide>
                                    )
                                })}
                            </Swiper>
                        </div>
                        <div className='range-head'>
                            <input ref={this.inputStart} readOnly={true}
                                   value={this.state.selectedDateStart ? 'Từ ' + moment(this.state.selectedDateStart).format('DD/MM/YYYY HH:mm') : ''}
                                   onClick={() => this.changeCurrentPoint('start')}
                                   className={"app-input app-input-start " + (this.state.currentPoint === 'start' ? 'active' : '')}
                                   placeholder="Từ ngày"/>
                            <input ref={this.inputEnd} readOnly={true} onClick={() => this.changeCurrentPoint('end')}
                                   value={this.state.selectedDateEnd ? 'Đến ' + moment(this.state.selectedDateEnd).format('DD/MM/YYYY HH:mm') : ''}
                                   className={"app-input app-input-end " + (this.state.currentPoint === 'end' ? 'active' : '')}
                                   placeholder="Đến ngày"/>
                        </div>
                        <div className='mdpc-head'>
                            <div className='mdpch-button'>
                                <div className='mdpchb-inner' onClick={() => this.setMonth(-1)}>
                                    <img src={icons.left}/>
                                </div>
                                {this.checkToday() === -1 ? (
                                    <button className="goto-today goto-today-item-left"
                                            onClick={() => this.gotoToday()}>Hôm nay</button>) : ''}
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
                                {this.checkToday() === 1 ? (
                                    <button className="goto-today goto-today-item-right"
                                            onClick={() => this.gotoToday()}>Hôm nay</button>) : ''}
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
                                    <span className="time-input" onClick={event => this.togglePopupTime(true)}>
                                        {(this.state.currentPoint === 'start' ? this.state.selectedDateStart : this.state.selectedDateEnd) ? moment((this.state.currentPoint === 'start' ? this.state.selectedDateStart : this.state.selectedDateEnd)).format('HH:mm') : '00:00'}
                                        <img src={icons.down}/>
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
                        <div className='mdpc-footer'>
                            <div className='mdpc-footer-left'>
                                <span>{this.convertTextTime()}</span>
                            </div>
                            <div className='mdpc-footer-right'>
                                <button onClick={() => this.onHide()} className="mpci-close">Đóng</button>
                                <button disabled={!this.convertTextTime()} onClick={() => this.onSubmit()}
                                        className={"mpci-submit " + (!!this.convertTextTime() ? '' : 'disabled')}>Xác
                                    nhận
                                </button>
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
        this.pickerYearMonth.setDate(date.toDate());
    }

    changeTime(date) {
        console.log(this.state.currentPoint, date);
        if (this.state.currentPoint === 'start') {
            const currentDate = this.state.selectedDateStart;
            if (currentDate) {
                currentDate.setHours(date.getHours());
                currentDate.setMinutes(date.getMinutes());
                this.setState({
                    selectedDateStart: currentDate
                });
            }
        }
        if (this.state.currentPoint === 'end') {
            const currentDate = this.state.selectedDateEnd;
            if (currentDate) {
                currentDate.setHours(date.getHours());
                currentDate.setMinutes(date.getMinutes());
                this.setState({
                    selectedDateEnd: currentDate
                });
            }
        }

    }

    checkToday() {
        const start = this.state.daysInMonth[0].date.getTime();
        const end = this.state.daysInMonth[this.state.daysInMonth.length - 1].date.getTime();
        const today = new Date().getTime();
        if (start > today) {
            return -1;
        }
        if (today > end) {
            return 1;
        }
        return 0;
    }

    gotoToday() {
        const today = new Date();
        const date = moment(today);
        this.setState({
            currentYear: date.format('YYYY'),
            currentMonth: date.format('MM'),
            daysInMonth: this.getMonthDetails(date.toDate()),
        });
        this.pickerYearMonth.setDate(date.toDate());
        return null;
    }

    onSubmit() {
        this.props.onEvent({
            type: 'submit',
            payload: {
                fromDate: this.state.selectedDateStart,
                toDate: this.state.selectedDateEnd,
            }
        });
    }

    onHide() {
        this.props.onEvent({
            type: 'hide',
            payload: {}
        });
    }
}

class AppComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            popupVisible: false
        };

    }

    componentDidMount() {
        this.props.popupVisible((v) => {
            this.eventVisible(v);
        });
    }

    render() {
        return <div className="date-range-picker-container">
            {this.state.popupVisible ? (<HDDateRangePicker onEvent={(data) => this.onEvent(data)}/>) : null}
        </div>;
    }

    onEvent(data) {
        switch (data.type) {
            case "submit": {
                if (this.props.onSubmit) {
                    this.props.onSubmit(data.payload);
                }
                break;
            }
            default: {
                this.setState({popupVisible: false})
                break;
            }
        }
    }

    eventVisible(visible) {
        this.setState({popupVisible: visible});
    }
}

export default class DateRangePicker {
    constructor(dom) {
        this.submitCallback = null;
        this.visibleCallback = null;
        ReactDOM.render(<AppComponent popupVisible={(callback) => {
            this.visibleCallback = callback
        }} onSubmit={(data) => {
            this.submitCallback ? this.submitCallback(data) : null;
            this.hide();
        }}/>, document.querySelector(dom));
    }

    onSubmit(callback) {
        this.submitCallback = callback;
    }

    show() {
        this.visibleCallback(true);
    }

    hide() {
        this.visibleCallback(false)
    }
}
