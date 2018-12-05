import React from "react";
import ReactDOM from "react-dom";
import {
    Catalog,
    pageLoader
} from "catalog";

const globalCSS = [
  'styles/css/global/global.css'
];

const theme = {
    bgLight: '#fbfbfb',
    bgDark: '#3a3a3a',
    fontFamily: "'Avenir', sans-serif",
    fontHeading: "'Bebas Neue', sans-serif",
    fontMono: "'Brandon Grotesque', monospace",
    background: '#F9F9F9',
    textColor: '#333333',
    codeColor: '#00263E',
    linkColor: '#4594fd',

}

const pages = [
    {
        path: "/",
        title: "Welcome",
        content: pageLoader(() =>
            import ("./WELCOME.md"))
  },
    {
        path: "/branding",
        title: "Branding",
        pages: [
            {
                path: "/branding/logo",
                title: "Logo",
                content: pageLoader(() =>
                    import ("./branding/LOGO.md"))
      },
            {
                path: "/branding/colors",
                title: "Colors",
                content: pageLoader(() =>
                    import ("./branding/COLORS.md"))
      },
            {
                path: "/branding/typography",
                title: "Typography",
                content: pageLoader(() =>
                    import ("./branding/TYPOGRAPHY.md"))
      },
            {
                path: "/branding/icons",
                title: "Icons",
                content: pageLoader(() =>
                    import ("./branding/ICONS.md"))
      }
    ]
  },
    {
        path: "/components",
        title: "Components",
        pages: [
            {
                path: "/components/buttons",
                title: "Button",
                styles: ['styles/css/buttons.css'],
                imports: {
                    Button: require('./react/button/Button.jsx')
                },
                content: pageLoader(() =>
                    import ("./components/BUTTONS.md"))
      },
            {
                path: "/components/headers",
                title: "Header",
                styles: ['styles/css/header.css'],
                imports: {
                    MyBookingHeader: require('./react/header/myBookingHeader.jsx'),
                    BookablesHeader: require('./react/header/bookablesHeader.jsx')
                },
                content: pageLoader(() =>
                    import ("./components/HEADERS.md"))
      },
            {
                path: "/components/notifications",
                title: "Notifications & Error Messages",
                styles: ['styles/css/notifications.css'],
                imports: {
                    InputError: require('./react/notifications/input-error.jsx'),
                    SuccessNotification: require('./react/notifications/SuccessNotification.jsx'),
                    ErrorNotification: require('./react/notifications/ErrorNotification.jsx'),
                },
                content: pageLoader(() =>
                    import ("./components/NOTIFICATIONS.md"))
      },
            {
                path: "/components/pickers",
                title: "Picker",
                styles: ['styles/css/roompicker.css', 'styles/css/datepicker.css', 'styles/css/timepicker.css', 'styles/css/weekspinner.css'],
                imports: {
                    DatePicker: require('./react/picker/datepicker/DatePicker.jsx'),
                    TimePicker: require('./react/picker/timepicker/TimePicker.jsx'),
                    RoomPicker: require('./react/picker/roompicker/RoomPicker.jsx'),
                    WeekSpinner: require('./react/picker/weekspinner/WeekSpinner.jsx')
                },
                content: pageLoader(() =>
                    import ("./components/PICKERS.md"))
      },
            {
                path: "/components/textfields",
                title: "Inputs",
                styles: ['styles/css/input.css'],
                imports: {
                    StandardInput: require('./react/input/Input.jsx')
                },
                content: pageLoader(() =>
                    import ("./components/TEXTFIELDS.md"))
      },
            {
                path: "/components/listview",
                title: "List View",
                styles: ['styles/css/listview.css'],
                imports: {
                    ListView: require('./react/listview/ListView.jsx')
                },
                content: pageLoader(() =>
                    import ("./components/LISTVIEW.md")
                )
            },
            
            {
                path: "/components/collection",
                title: "Booking Card Collection",
                styles: ['styles/css/bookingcard.css','styles/css/bookingcard-collection.scss','styles/css/bookingcard-date-header.css'],
                imports: {
                    BookingCardCollection: require('./react/booking-card-collection/BookingCardCollection.jsx'),
                    BookingCardDateHeader: require('./react/booking-card-collection/BookingCardDateHeader.jsx'),
                    BookingCard: require('./react/booking-card-collection/BookingCard.jsx')
                },
                content: pageLoader(() =>
                    import ("./components/BOOKINGCARDCOLLECTION.md")
                )
            },

    ]
  },
    {
        path: "/resources",
        title: "Resources",
        pages: [
            {
                path: "/resources/sketch",
                title: "Sketch File",
                content: pageLoader(() =>
                    import ("./resources/SKETCH.md"))
      }
    ]
  },
];

ReactDOM.render( <
    Catalog title = "Bookit Styleguide"
    pages = {
        pages
    }
    styles = {
        globalCSS
    }
    theme = {
        theme
    }
    />,
    document.getElementById("catalog")
);
