import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { store, persistor, history } from './reducers'
import Root from './root'
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-quill/dist/quill.snow.css'
import 'react-accessible-accordion/dist/fancy-example.css'
import 'emoji-mart/css/emoji-mart.css'
import 'rc-calendar/assets/index.css'
import 'react-daterange-picker/dist/css/react-calendar.css'
import 'react-image-lightbox/style.css'
import 'react-image-crop/dist/ReactCrop.css'
import './app.scss'

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Router history={history}>
        <Switch>
          <Root />
        </Switch>
      </Router>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)