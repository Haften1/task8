let items = document.querySelectorAll('.item');
let hideBar = document.querySelector('.hidebar');
let hbtext = document.querySelector('.hbtext');
let btnLoad = document.querySelector('.button');
let hideInput = document.querySelector("[hidden=\'hidden\']");
let form = document.querySelector('form');
let itemsBlock = document.querySelector('.items');
let text = document.querySelector('.text');
let curPathText = document.querySelector('.curpathtext');
let back = document.querySelector('.back');
let dirPath = 'disk:/';
let path;


// При нажатии пкм по элементам  
openHideBar = (e) => {
    if (!hideBar) return;

    if (e.target.dataset.item == 'true') {
        e.preventDefault();

        hideBar.classList.remove('hidden');
        let x = e.pageX + 3;
        let y = e.pageY + 3;

        // Проверка на выход за границы экрана
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const hideBarWidth = hideBar.offsetWidth;
        const hideBarHeight = hideBar.offsetHeight;

        if (x + hideBarWidth > viewportWidth) {
            x = viewportWidth - hideBarWidth - 10;
        }
        if (y + hideBarHeight > viewportHeight) {
            y = viewportHeight - hideBarHeight - 10;
        }

        hideBar.style.left = x + 'px';
        hideBar.style.top = y + 'px';

        if (e.target.dataset.pathtoitem) {
            path = e.target.dataset.pathtoitem;
        } else {
            let parent = e.target.closest('.item');
            if (parent && parent.dataset.pathtoitem) {
                path = parent.dataset.pathtoitem;
            } else {
                console.error("Path not found for the clicked item.");
            }
        }
    }
};

function closeHideBar(e) {
    hideBar.classList.add('hidden');
}

//Нажатии удалить
function clickDelete(e) {
    text.textContent = ' ';
    let deleteItem = document.querySelector(`[data-pathtoitem="${path}"]`);
    let data = new FormData();
    data.append('data-pathtoitem', path);

    fetch('delete.php', {
        method: 'POST',
        body: data
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            deleteItem.remove();
        } else {
            text.textContent = 'Ошибка удаления!';
        }
    })
    .catch(error => {
        text.textContent = 'Ошибка запроса!';
    });
}


//Срабатывает когда нажали на кнопку загрузить
function clickLoad() {
    hideInput.value = '';
    hideInput.click();
    text.textContent = ' ';    

}

//Срабатывает когда выбрали файл 
function loadFile(e) {
    let file = hideInput.files[0]; // Получаем файл
    const data = new FormData();
    data.append("thefile", file);

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            try {
                let response = xhttp.response; // Получаем ответ
                if (response && response.result === true) {
                    // если файл успешно загружен, выведем его
                    itemsBlock.insertAdjacentHTML('beforeend', `
                        <div class="item" data-pathtoitem="${response.curpath}" data-item="true">
                            <img src="images/file1.png" alt="file" class="filepic" data-item="true" style="width: 75px;">
                            <p data-item="true">${response.fileName}</p>
                        </div>
                    `);
                } else if (response && response.result === 'error') {
                    text.textContent = response.text;
                    text.classList.add('error');
                } else {
                    console.error('Unexpected response:', response);
                }
            } catch (error) {
                console.error('Error parsing response:', error);
                text.textContent = 'Ошибка обработки ответа';
                text.classList.add('error');
            }
        }
    };
    xhttp.open('POST', 'upload.php', true);
    xhttp.responseType = 'json';
    xhttp.send(data);
}

//Клике по папке
function clickToDir(e) {
    if (e.target.dataset.dir === 'true') {
        let targetPath = e.target.dataset.pathtoitem || e.target.closest('.item').dataset.pathtoitem;

        const data = new FormData();
        data.append('dirPath', targetPath);

        fetch('clickdir.php', {
            method: 'POST',
            body: data
        })
        .then(response => response.json())
        .then(result => {
            if (result.newpath) {
                curPathText.textContent = result.newpath;
                dirPath = result.newpath;

                if (dirPath !== 'disk:/' && back.classList.contains('hidden')) {
                    back.classList.remove('hidden');
                } else if (dirPath === 'disk:/' && !back.classList.contains('hidden')) {
                    back.classList.add('hidden');
                }
            }
            itemsBlock.innerHTML = result.output; // Заменяем все элементы контента
        })
        .catch(error => {
            text.textContent = 'Ошибка навигации!';
            text.classList.add('error');
        });
    }
}

//Клике назад
function clickToBack(e) {
    const data = new FormData();
    data.append('dirPath', dirPath);

    fetch('clickback.php', {
        method: 'POST',
        body: data
    })
    .then(response => response.json())
    .then(result => {
        if (result.newpath) {
            curPathText.textContent = result.newpath;
            dirPath = result.newpath;
            if (dirPath === 'disk:/' && !back.classList.contains('hidden')) {
                back.classList.add('hidden');
            }
        }
        itemsBlock.innerHTML = result.output; // Заменяем все элементы контента
    })
    .catch(error => {
        text.textContent = 'Ошибка при возврате!';
        text.classList.add('error');
    });
}

// ОБРАБОТЧИКИ
itemsBlock.addEventListener('contextmenu', openHideBar);
itemsBlock.addEventListener('click', clickToDir);
back.addEventListener('click', clickToBack);
document.documentElement.addEventListener('click', closeHideBar);
document.documentElement.addEventListener('contextmenu', closeHideBar, true);
hbtext.addEventListener('click', clickDelete);
btnLoad.addEventListener('click', clickLoad);
hideInput.addEventListener('change', loadFile);



