const logString = () => {
    const osa1 = Math.random().toString(36).substring(2)
    const osa2 = Math.random().toString(36).substring(2)
    const osa3 = Math.random().toString(36).substring(2)
    const osa4 = Math.random().toString(36).substring(2)
    const date = new Date()
    const aika = date.toLocaleDateString() + " " + date.toLocaleTimeString()
  
    console.log(aika + ": " + osa1 + "-" + osa2 + "-" + osa3 + "-" + osa4)
  
    setTimeout(logString, 5000)
}
  
logString()