/**
 *
 * Zoho SalesIQ (Live Chat) to support our customers  
 *
 */
const HCMChat = () => {
  window.$zoho = window.$zoho || {}
  window.$zoho.salesiq = window.$zoho.salesiq || {
    widgetcode:
      '02a29a70956867a40cb615e533ea6f8dd4f1d63fcaddbf2b14f2da4fcadccc0bfeb79731b60e202192c2895c9acefb61',
    values: {},
    ready: function() {},
  }

  const doc = document

  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = 'https://salesiq.zoho.com/widget'
  script.id = 'zsiqscript'
  script.defer = true

  let zohoChat = document.createElement('div')
  zohoChat.setAttribute('id', 'zsiqwidget')

  let tag = doc.getElementsByTagName('script')[0]
  tag.parentNode.insertBefore(script, tag)
}

export { HCMChat }
