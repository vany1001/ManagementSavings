class Saving {
    constructor(codeNumber, name, identityCard, day,month,year, amount) {
        this.codeNumber = codeNumber;
        this.name = name;
        this.identityCard = identityCard;
       
        this.amount = amount;
        let openDay = new Date(year,month,day);
        this.openDay = `${openDay.getFullYear()}-${openDay.getMonth()}-${openDay.getDate() > 10?openDay.getDate():"0"+openDay.getDate()}`;
    }
}
var savings = [];
const key_data = 'saving_data';
var page_size = 5;
var total_pages = 0;
var page_number = 1;

function init(){
    if(getData(key_data) == null){
        let date = new Date();
        savings = [
            new Saving(103, 'Văn Ý', 206270653, date.getDate(), date.getMonth()+1, date.getFullYear(), 100000000),
            new Saving(104, 'Văn Tứ', 206270654, date.getDate(), date.getMonth()+1, date.getFullYear() , 200000000),
        ]
        setData(key_data, savings);
    }   
    else{
        savings = getData(key_data);
    }
}
function getData(key){
    return JSON.parse(localStorage.getItem(key));
}

function setData(key, data){
    localStorage.setItem(key, JSON.stringify(data))
}
function edit(index){
    console.log(savings);
    document.getElementById("code").value = savings[index].codeNumber;
    document.getElementById("name").value = savings[index].name;
    document.getElementById("card").value = savings[index].identityCard;
    document.getElementById("day").value = savings[index].openDay;
    document.getElementById("amount").value = savings[index].amount;
    document.getElementById("idEdit").value = index;
    document.getElementById("saving").style.display = "none";
    document.getElementById("edit").style.display = "block";
}
function editReal(){
    let idPage = document.getElementById("idPage").value;
    let index = document.getElementById("idEdit").value;
    savings[index].codeNumber = document.getElementById("code").value;
    savings[index].name = document.getElementById("name").value;
    savings[index].identityCard = document.getElementById("card").value;
    savings[index].openDay = document.getElementById("day").value;
    console.log(document.getElementById("day").value)
    savings[index].amount = Number(document.getElementById("amount").value);
    renderSaving();
    localStorage.setItem(key_data, JSON.stringify(savings));
    document.getElementById("saving").style.display = "block";
    document.getElementById("edit").style.display = "none";
    resetForm();
    console.log(saving);
}
function renderSaving() {
    let data = savings.slice((page_size * (page_number - 1)), (page_size * page_number));
    let tbSaving = document.querySelector('.table>tbody');
    let idPage = document.getElementById("idPage").value;
    let htmls;
    if(data){
        htmls = data.map(function (saved, index) {
            let arrStr = saved.openDay.split("-");
            return `
            <tr id>
                        <td class="text-center">${saved.codeNumber}</td>
                        <td class="text-center">${saved.name}</td>
                        <td class="text-center">${saved.identityCard}</td>
                        <td class="text-center">${arrStr[2]}-${arrStr[1]}-${arrStr[0]}</td>
                        <td class="text-center">${formatCurrency(saved.amount)}</td>
                        <td class="text-center">
                            <button class="btn btn-warning" onclick="edit(${index+5*idPage})">Edit</button>
                            <button class="btn btn-danger" onclick="removeSaving(${index})">Remove</button>
                        </td>
            </tr>
            `
        })
    } else{
        htmls = savings.map(function (saving, index) {
            console.log(saving.openDay.split("-"));
            return `
            <tr id>
                        <td class="text-center">${saving.codeNumber}</td>
                        <td class="text-center">${saving.name}</td>
                        <td class="text-center">${saving.identityCard}</td>
                        <td class="text-center">${saving.openDay}</td>
                        <td class="text-center">${formatCurrency(saving.amount)}</td>
                        <td class="text-center">
                            <button class="btn btn-warning" onclick="edit(${index}>Edit</button>
                            <button class="btn btn-danger" onclick="removeSaving(${index})">Remove</button>
                        </td>
            </tr>
            `
        })
    }
    tbSaving.innerHTML = htmls.join('');
    buildPagination();
}

function formatCurrency(number) {
    return number.toLocaleString('vi', { style: 'currency', currency: 'VND' });
}
function addSaving(){
    let code =  Number(document.querySelector('#code').value);
    if (!validation(document.querySelector('#code').value)) {
        alert("Code is required!")
        return;
    }
    let name = document.querySelector('#name').value;
    let card = Number(document.querySelector('#card').value);
    let dayArray = document.querySelector('#day').value.split('-')
    let year = dayArray[0];
    let month = dayArray[1]
    let day = dayArray[2];
    let amount = Number(document.querySelector('#amount').value);
    
    let newSaving = new Saving (code, name, card, day,month,year, amount)
      savings.push(newSaving);
      setData(key_data, savings);
      renderSaving();
      resetForm();
   
}
function resetForm(){
    document.querySelector('#code').value = '';
    document.querySelector('#name').value = '';
    document.querySelector('#card').value = '';
    document.querySelector('#day').value = '';
    document.querySelector('#amount').value = '';
    
}

function removeSaving(index){
    let idPage = document.getElementById("idPage").value;
    let confirm = window.confirm('Are you sure to remove this people?');
    if(confirm){
        savings.splice(index+5*idPage, 1);
        localStorage.setItem(key_data, JSON.stringify(savings));
        renderSaving();
    }
}

function buildPagination() {
    total_pages = Math.ceil(savings.length / page_size);
    let paginationString = "";
    let start = page_number == 1 ? 1 : page_number == total_pages ? page_number - 2 : page_number - 1;
    let end = page_number == total_pages ? total_pages : page_number == 1 ? page_number + 2 : page_number + 1;
    paginationString += `<button class="tbn-page " onclick='changePage(1)'>&#x25C0;</button>`;
    for (let page = 1; page <= total_pages; page++) {
        paginationString += `
                                    <button class='tbn-page ${page == page_number ? 'active' : ''}'
                                        onclick='changePage(${page})'>
                                ${page}</button>`
    }
    paginationString += `<button class="tbn-page " onclick='changePage(${total_pages})'>&#x25B6;</button>`;
    document.getElementById('paging-area').innerHTML = paginationString;
}
function changePage(page) {
    page_number = page;
    document.getElementById("idPage").value = page-1;
    renderSaving();
}


function validation(field) {
    return field != null && field.trim() != '';
}
function main(){
    init();
    renderSaving();
}
main();
