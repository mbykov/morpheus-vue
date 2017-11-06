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
        {label: 'about ECBT series', click () { win.webContents.send('section', 'ecbt') }},
        {label: 'license and code', click () { win.webContents.send('section', 'code') }},
        {label: 'contacs', click () { win.webContents.send('section', 'contacts') }},
        {label: 'screencast', click () { win.webContents.send('section', 'screencast') }},
        {label: 'acknowledgements', click () { win.webContents.send('section', 'acknowledgements') }}
        // {
        //     label: 'learn more',
        //   click () { e.shell.openExternal ('http://diglossa.org') }
        // }
      ]
    },
    // {
    //   label: 'help',
    //   submenu: [
    //     {label: 'help', click () { win.webContents.send('section', 'help') }}
    //   ]
    // }
    {
      label: 'help',
      click () {
        win.webContents.send('section', 'help')
        return true
      }
    },
    {
      label: 'tests',
      click () {
        win.webContents.send('section', 'tests')
        return true
      }
    }
  ]
}

// export default template
