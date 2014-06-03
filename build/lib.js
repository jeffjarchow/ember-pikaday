(function() {

Ember.emberPikaday = Ember.Namespace.create();
Ember.emberPikaday.VERSION = '0.1.0';

Ember.libraries.register('ember-pikaday', Ember.emberPikaday.VERSION);


})();

(function() {

Ember.emberPikaday.PikadayComponent = Ember.Component.extend({

    /**
    HTML tag of this component's element.
    */
    tagName: 'input',

    /**
    Two-way bindings to element's attributes.
    */
    attributeBindings: ['type', 'value'],

    /**
    Input type
    */
    type: 'text',

    /**
    Pickaday object
    */
    picker: null,

    /**
    Moment format for input field. String format of date.
    */
    format: 'L',

    /**
    The current date. Default is today's date.
    */
    date: new Date(),

    /**
    String form of the date.
    */
    value: '',

    /**
    Date field is updated. Triggers sync with Pikaday picker.
    */
    dateDidChange: function() {
        var self = this;
        // Get date & format
        var date = moment(self.get('date'));
        var format = self.get('format');
        // Validate date
        if (date.isValid()) {
            // Set string value form of date
            var newValue = date.format(format);
            // Check if value has changed
            if (!Ember.isEqual(newValue, self.get('value'))) {
                // Value is different
                // Save the new value
                self.set('value', newValue);
                // Set the new current date on the picker
                self.get('picker').setDate(date.format(format));
            }
        }
    }.observes('date'),

    /**
    The value of the textbox has changed. syncs with Pikaday
    */
    valueDidChange: function() {
        var date = moment(this.get('value'));
        if (date.isValid()) {
            this.set('date', date.toDate());
        } else {
            // Value is invalid. Wait for it to validate.
            console.log('date is invalid');
        }
    }.observes('value'),


    /**
    Inserts the input element into the DOM
    */
    didInsertElement: function() {
        var self = this;
        // Setup bindings to input field
        var $el = self.$();
        $el.keyup(function(event) {
            console.log(event);
            var val = $el.val();
            self.set('value', val);
        });
        // Init Pikaday
        var format = self.get('format');
        var picker = new Pikaday({
            field: $el[0],
            format: format,
            onSelect: function(date) {
                console.log(date);
                self.set('date', date);
            }
        });
        // Remember the picker
        self.set('picker', picker);
        // Trigger update
        self.dateDidChange();
    },

    /**
    Removes the input element from the DOM
    */
    willDestroyElement: function() {
        var picker = this.get('picker');
        if (picker) {
            picker.destroy();
        }
        this.set('picker', null);
    }

});

Ember.Handlebars.helper('pik-a-day', Ember.emberPikaday.PikadayComponent);


})();