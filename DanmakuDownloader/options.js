let page = document.getElementById('buttonDiv');
  const kButtonColors = ['#3fa7f7', '#e2453c', '#f0fb2d', '#ffffff'];
  function constructOptions(btns) {
    for (let item of btns) {
      let button = document.createElement('button');
      button.style.backgroundColor = item;
      button.addEventListener('click', function() {
        chrome.storage.sync.set({color: item}, function() {
          console.log('color is ' + item);
        })
      });
      page.appendChild(button);
    }
  }
  constructOptions(kButtonColors);