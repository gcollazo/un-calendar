!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),(n.Un||(n.Un={})).Calendar=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
/*!
un-calendar
(c) 2014 Carsten Nielsen
License: https://github.com/unspace/un-calendar/blob/master/LICENSE
*/

var UnCalendarComponent = _dereq_("./un-calendar-component")["default"] || _dereq_("./un-calendar-component");
var UnCalendarMonthComponent = _dereq_("./un-calendar-month-component")["default"] || _dereq_("./un-calendar-month-component");
var UnCalendarTemplate = _dereq_("./un-calendar-template")["default"] || _dereq_("./un-calendar-template");
var Application = window.Ember.Application;

Application.initializer({
  name: 'ember-un-calendar',

  initialize: function(container) {
    container.register('template:components/un-calendar', UnCalendarTemplate);
    container.register('component:un-calendar', UnCalendarComponent);
    container.register('component:un-calendar-month', UnCalendarMonthComponent);
  }
});

exports.UnCalendarComponent = UnCalendarComponent;
exports.UnCalendarMonthComponent = UnCalendarMonthComponent;
exports.UnCalendarTemplate = UnCalendarTemplate;
},{"./un-calendar-component":2,"./un-calendar-month-component":3,"./un-calendar-template":4}],2:[function(_dereq_,module,exports){
"use strict";
var moment = window.moment["default"] || window.moment;
var Component = window.Ember.Component;
var computed = window.Ember.computed;

function cpFormatMoment(key, format) {
  return computed(function() {
    var date = this.get(key);
    return date ? date.format(format) : null;
  }).property(key);
}

exports["default"] = Component.extend({
  classNames: 'un-calendar',

  prevLabel:           '&larr;',
  nextLabel:           '&rarr;',
  todayLabel:          'Today',
  showNextMonth:       true,
  showPrevMonth:       true,
  disableHeader:       false,
  disableControls:     false,
  disableTodayButton:  false,
  multiple:            false,
  disablePast:         null,
  disableFuture:       null,
  disableManipulation: null,
  maxPastDate:         null,
  maxFutureDate:       null,
  month:               null,
  disabledDates:       null,
  selectedDates:       null,
  selectedDate:        null,

  init: function() {
    this._super();

    if (!this.get('selectedDates')) {
      this.set('selectedDates', []);
    } else {
      this.set('multiple', true);
    }

    if (this.get('selectedDate')) {
      this.get('selectedDates').addObject(this.get('selectedDate'));
    }

    var firstSelectedDate = this.get('selectedDates.firstObject');

    if (!this.get('month') && firstSelectedDate) {
      this.set('month', firstSelectedDate.clone().startOf('month'));
    }

    if (!this.get('month')) {
      this.set('month', moment().startOf('month'));
    }
  },

  actions: {
    dateSelected: function(date) {
      this.sendAction('select', date);

      if (this.get('disableManipulation')) {
        return;
      }

      if (this.get('multiple')) {
        if (this.hasDate(date)) {
          this.removeDate(date);
        } else {
          this.addDate(date);
        }
      } else {
        if (this.hasDate(date)) {
          this.set('selectedDate', null);
        } else {
          this.set('selectedDate', date);
        }
      }
    },

    prev: function() {
      var month = this.get('month');

      if (!month || this.get('isPrevDisabled')) {
        return;
      }

      this.set('month', month.clone().subtract('months', 1));
    },

    next: function() {
      var month = this.get('month');

      if (!month || this.get('isNextDisabled')) {
        return;
      }

      this.set('month', month.clone().add('months', 1));
    },

    today: function() {
      this.set('month', moment());
    }
  },

  hasDate: function(date) {
    return this.get('selectedDates').any(function(d) {
      return d.isSame(date);
    });
  },

  removeDate: function(date) {
    var dates = this.get('selectedDates');
    var removeDates;

    removeDates = dates.filter(function(d) {
      return d.isSame(date);
    });

    dates.removeObjects(removeDates);
  },

  addDate: function(date) {
    this.removeDate(date);
    this.get('selectedDates').pushObject(date);
  },

  selectedDateWillChange: function() {
    this.removeDate(this.get('selectedDate'));
  }.observesBefore('selectedDate'),

  selectedDateDidChange: function() {
    var date = this.get('selectedDate');

    if (!date) {
      return;
    }

    this.addDate(this.get('selectedDate'));
  }.observes('selectedDate'),

  // TODO: Add timer to invalidate this
  now: function() {
    return moment();
  }.property(),

  prevMonth: function() {
    var month = this.get('month');
    return month ? month.clone().subtract('months', 1) : null;
  }.property('month'),

  nextMonth: function() {
    var month = this.get('month');
    return month ? month.clone().add('months', 1) : null;
  }.property('month'),

  isNextMonthInFuture: function() {
    var nextMonth = this.get('nextMonth'),
        now       = this.get('now');

    return nextMonth ? nextMonth.isAfter(now, 'month') : false;
  }.property('nextMonth', 'now'),

  isPrevMonthInPast: function() {
    var prevMonth = this.get('prevMonth'),
        now       = this.get('now');

    return prevMonth ? prevMonth.isBefore(now, 'month') : false;
  }.property('prevMonth', 'now'),

  isPrevMonthBeyondMax: function() {
    var prevMonth   = this.get('prevMonth'),
        maxPastDate = this.get('maxPastDate');

    if (!prevMonth || !maxPastDate) {
      return false;
    }

    return prevMonth.isBefore(maxPastDate, 'month');
  }.property('prevMonth', 'maxPastDate'),

  isNextMonthBeyondMax: function() {
    var nextMonth     = this.get('nextMonth'),
        maxFutureDate = this.get('maxFutureDate');

    if (!nextMonth || !maxFutureDate) {
      return false;
    }

    return nextMonth.isAfter(maxFutureDate, 'month');
  }.property('nextMonth', 'maxFutureDate'),

  isPrevDisabled: function() {
    if (this.get('isPrevMonthBeyondMax')) {
      return true;
    }

    if (this.get('disablePast') && this.get('isPrevMonthInPast')) {
      return true;
    }

    return false;
  }.property('isPrevMonthBeyondMax', 'isPrevMonthInPast', 'disablePast'),

  isNextDisabled: function() {
    if (this.get('isNextMonthBeyondMax')) {
      return true;
    }

    if (this.get('disableFuture') && this.get('isNextMonthInFuture')) {
      return true;
    }

    return false;
  }.property('isNextMonthBeyondMax', 'isNextMonthInFuture', 'disableFuture'),

  prevMonthLabel: cpFormatMoment('prevMonth', 'MMMM YYYY'),
  nextMonthLabel: cpFormatMoment('nextMonth', 'MMMM YYYY'),
  monthLabel:     cpFormatMoment('month', 'MMMM YYYY')
});
},{}],3:[function(_dereq_,module,exports){
"use strict";
var Handlebars = window.Handlebars["default"] || window.Handlebars;
var moment = window.moment["default"] || window.moment;
var Component = window.Ember.Component;
var $ = window.Ember.$;
var run = window.Ember.run;
var get = window.Ember.get;

var DATE_SLOT_HBS = Handlebars.compile(
  '<li class="{{classNames}}" data-date="{{jsonDate}}">' +
    '{{date}}' +
  '</li>'
);

function containsDate(dates, date) {
  if (!dates || !get(dates, 'length')) {
    return false;
  }

  return dates.any(function(d) {
    return date.isSame(d, 'day');
  });
}

function forEachSlot(month, iter) {
  var totalDays  = month.daysInMonth(),
      firstDay   = month.clone().startOf('month').weekday(),
      currentDay = 1;

  function popCurrentDay() {
    if (currentDay > totalDays) {
      return null;
    } else {
      return moment([month.year(), month.month(), currentDay++]);
    }
  }

  for (var week = 0; week <= 6; week++) {
    for (var day = 0; day <= 6; day++) {
      if (week === 0) {
        iter(day < firstDay ? null : popCurrentDay());
      } else {
        iter(currentDay <= totalDays ? popCurrentDay() : null);
      }
    }

    if (currentDay > totalDays) {
      break;
    }
  }
}

exports["default"] = Component.extend({
  tagName:      'ol',
  classNames:   'un-calendar-month',
  month:         null,
  selectedDates: null,
  disabledDates: null,

  init: function() {
    this._super();

    if (!this.get('selectedDates')) {
      throw 'you must provide selectedDates to un-calendar-month';
    }
  },

  click: function(event) {
    var $target = $(event.target);

    if ($target.is('.is-disabled')) {
      return;
    }

    if ($target.is('[data-date]')) {
      this.sendAction('select', moment($target.data('date'), 'YYYY-MM-DD'));
    }
  },

  monthDidChange: function() {
    run.scheduleOnce('afterRender', this, 'rerender');
  }.observes('month'),

  selectedDatesDidChange: function() {
    run.scheduleOnce('afterRender', this, 'setSelectedDates');
  }.observes('selectedDates.@each'),

  setSelectedDates: function() {
    var dates = this.get('selectedDates'),
        view  = this,
        json;

    if (this.state !== 'inDOM') {
      return;
    }

    this.$('li').removeClass('is-selected');

    dates.forEach(function(date) {
      json = date.format('YYYY-MM-DD');
      view.$('[data-date="' + json + '"]').addClass('is-selected');
    });
  },

  didInsertElement: function() {
    this.setSelectedDates();
  },

  render: function(buff) {
    var month = this.get('month'),
        view  = this;

    if (!month) {
      return;
    }

    function renderSlot(slot) {
      var attrs;

      if (slot) {
        attrs = {
          date:       slot.format('D'),
          jsonDate:   slot.format('YYYY-MM-DD'),
          classNames: ['un-calendar-slot', 'un-calendar-day']
        };

        view.applyOptionsForDate(attrs, slot);
        attrs.classNames = attrs.classNames.join(' ');
        buff.push(DATE_SLOT_HBS(attrs));
      } else {
        buff.push('<li class="un-calendar-slot un-calendar-empty"></li>');
      }
    }

    forEachSlot(month, function(slot) {
      renderSlot(slot);
    });
  },

  applyOptionsForDate: function(options, date) {
    var disabledDates = this.get('disabledDates'),
        selectedDates = this.get('selectedDates');

    if (moment().isSame(date, 'day')) {
      options.classNames.push('is-today');
    }

    if (disabledDates && containsDate(disabledDates, date)) {
      options.classNames.push('is-disabled');
    }

    if (selectedDates && containsDate(selectedDates, date)) {
      options.classNames.push('is-selected');
    }
  },
});
},{}],4:[function(_dereq_,module,exports){
"use strict";
exports["default"] = Ember.Handlebars.compile("{{#unless disableHeader}}\n  <div class=\"un-calendar-header\">\n    {{#unless disableControls}}\n      <nav>\n        <button {{action \"prev\"}} {{bind-attr disabled=\"isPrevDisabled\"}} class=\"un-calendar-prev\">\n          <span>{{{unbound prevLabel}}}</span>\n        </button>\n        <button {{action \"next\"}} {{bind-attr disabled=\"isNextDisabled\"}} class=\"un-calendar-next\">\n          <span>{{{unbound nextLabel}}}</span>\n        </button>\n        {{#unless disableTodayButton}}\n          <button {{action \"today\"}} class=\"un-calendar-today\">\n            <span>{{{unbound todayLabel}}}</span>\n          </button>\n        {{/unless}}\n      </nav>\n    {{/unless}}\n  </div>\n{{/unless}}\n\n<div class=\"un-calendar-months\">\n  {{#if showPrevMonth}}\n    <div class=\"un-calendar-prev-month un-calendar-month-container\">\n      <header>\n        {{prevMonthLabel}}\n      </header>\n      {{un-calendar-month\n        month=prevMonth\n        selectedDates=selectedDates\n        disabledDates=disabledDates\n        select=\"dateSelected\"}}\n    </div>\n  {{/if}}\n\n  <div class=\"un-calendar-current-month un-calendar-month-container\">\n    <header>\n      {{monthLabel}}\n    </header>\n    {{un-calendar-month\n      month=month\n      selectedDates=selectedDates\n      disabledDates=disabledDates\n      select=\"dateSelected\"}}\n  </div>\n\n  {{#if showNextMonth}}\n    <div class=\"un-calendar-next-month un-calendar-month-container\">\n      <header>\n        {{nextMonthLabel}}\n      </header>\n      {{un-calendar-month\n        month=nextMonth\n        selectedDates=selectedDates\n        disabledDates=disabledDates\n        select=\"dateSelected\"}}\n    </div>\n  {{/if}}\n</div>\n");
},{}]},{},[1])
(1)
});