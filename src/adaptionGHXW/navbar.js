document.querySelectorAll('#header .account a').forEach(a => {
  let className = a.className
  let lang = a.attributes.lang && a.attributes.lang.value
  if (className === 'gotoSetting') {
    a.parentNode.style.display = 'none'
  } else if (lang === 'zh-CN' || lang === 'en-US') {
    a.onclick = e => {
      let dom = e.target
      if (!~dom.className.indexOf('selected')) {
        let url = window.location.href
        let baseUrl = url.replace(/[?](.*)/, '')
        window.location.href = `${baseUrl}?lang=${lang}`
      }
    }
  }
})
