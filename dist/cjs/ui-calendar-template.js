"use strict";
exports["default"] = Ember.Handlebars.compile("{{#unless disableHeader}}\n  <div class=\"ui-calendar-header\">\n    {{#unless disableControls}}\n      <nav>\n        <button {{action \"prev\"}} {{bind-attr disabled=\"isPrevDisabled\"}} class=\"ui-calendar-prev\">\n          <span>{{{unbound prevLabel}}}</span>\n        </button>\n        <button {{action \"next\"}} {{bind-attr disabled=\"isNextDisabled\"}} class=\"ui-calendar-next\">\n          <span>{{{unbound nextLabel}}}</span>\n        </button>\n        {{#unless disableTodayButton}}\n          <button {{action \"today\"}} class=\"ui-calendar-today\">\n            <span>{{{unbound todayLabel}}}</span>\n          </button>\n        {{/unless}}\n      </nav>\n    {{/unless}}\n  </div>\n{{/unless}}\n\n<div class=\"ui-calendar-months\">\n  {{#if showPrevMonth}}\n    <div class=\"ui-calendar-prev-month ui-calendar-month-container\">\n      <header>\n        {{prevMonthLabel}}\n      </header>\n      {{ui-calendar-month\n        month=prevMonth\n        selectedDates=selectedDates\n        disabledDates=disabledDates\n        select=\"dateSelected\"}}\n    </div>\n  {{/if}}\n\n  <div class=\"ui-calendar-current-month ui-calendar-month-container\">\n    <header>\n      {{monthLabel}}\n    </header>\n    {{ui-calendar-month\n      month=month\n      selectedDates=selectedDates\n      disabledDates=disabledDates\n      select=\"dateSelected\"}}\n  </div>\n\n  {{#if showNextMonth}}\n    <div class=\"ui-calendar-next-month ui-calendar-month-container\">\n      <header>\n        {{nextMonthLabel}}\n      </header>\n      {{ui-calendar-month\n        month=nextMonth\n        selectedDates=selectedDates\n        disabledDates=disabledDates\n        select=\"dateSelected\"}}\n    </div>\n  {{/if}}\n</div>\n");