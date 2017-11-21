//
// import bus from '../renderer/bus'

module.exports = function (win, e) {
  return [
    {
      label: 'window',
      submenu: [
        {role: 'minimize'},
        {role: 'quit'}
      ]
    },
    // {
    //   label: 'actions',
    //   submenu: [
    //     {label: 'dictionaries', click () { win.webContents.send('section', 'dicts') }},
    //     {label: 'signup/login'}
    //   ]
    // },
    {
      label: 'about',
      submenu: [
        {label: 'about Morpheus', click () { win.webContents.send('section', 'about') }},
        {label: 'Dharma-Reader', click () { win.webContents.send('section', 'dharma') }},
        {label: 'code and license', click () { win.webContents.send('section', 'code') }},
        {label: 'contacs', click () { win.webContents.send('section', 'contacts') }},
        {label: 'acknowledgements', click () { win.webContents.send('section', 'acknowledgements') }}
        // {
        //     label: 'learn more',
        //   click () { e.shell.openExternal ('http://diglossa.org') }
        // }
      ]
    },
    {
      label: 'dictionaries',
      submenu: [
        {label: 'active dicts', click () { win.webContents.send('section', 'active') }},
        {label: 'install from file', click () { win.webContents.send('section', 'install') }},
        {label: 'cleanup db', click () { win.webContents.send('section', 'cleanup') }}
      ]
    },
    {
      label: 'help',
      submenu: [
        {label: 'help', click () { win.webContents.send('section', 'help') }},
        {label: 'screencast', click () { win.webContents.send('section', 'screencast') }},
        {label: 'tests', click () { win.webContents.send('section', 'tests') }}
      ]
    }
  ]
}

// export default template
