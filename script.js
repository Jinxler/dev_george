$(document).ready(function(){
                   
const hamburger = document.getElementById('hamburger');
const dropdownMenu = document.getElementById('dropdownMenu');

hamburger.addEventListener('click', () => {
  dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
});

const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const nameInput = document.getElementById('nameInput');
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));

let loggedIn = false;

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();
  if (!loggedIn) {
    const userName = nameInput.value.trim();
    if (userName) {
      loginBtn.textContent = `Logout (${userName})`;
      loginModal.hide();
      loggedIn = true;
    }
  } else {
    loginBtn.textContent = "Login";
    loggedIn = false;
  }
  loginForm.reset();
});

loginBtn.addEventListener('click', function () {
  if (loggedIn) {
    loginBtn.textContent = "Login";
    loggedIn = false;
  }
});

let data = []; 
const dataList = document.getElementById('dataList');
const dataForm = document.getElementById('dataForm');
const titleInput = document.getElementById('titleInput');
const descriptionInput = document.getElementById('descriptionInput');
const dataIdInput = document.getElementById('dataId');
const loadSampleBtn = document.getElementById('loadSampleBtn');
const exportBtn = document.getElementById('exportBtn');

fetch('data.json')
  .then(response => response.json())
  .then(json => {
    data = json;
    renderData();
  })
  .catch(error => console.error('Error loading JSON:', error));

function renderData() {
  dataList.innerHTML = '';
  data.forEach(item => {
    const div = document.createElement('div');
    div.className = 'list-group-item';
    div.innerHTML = `
      <h5>${item.title}</h5>
      <p>${item.description}</p>
      <button class="btn btn-sm btn-primary me-2" onclick="editData(${item.id})">Edit</button>
      <button class="btn btn-sm btn-danger" onclick="confirmDelete(${item.id})">Delete</button>
    `;
    dataList.appendChild(div);
  });
}

dataForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const id = dataIdInput.value;

  if (id) {
    const item = data.find(d => d.id == id);
    if (item) {
      item.title = title;
      item.description = description;
    }
  } else {
    const newItem = {
      id: Date.now(), 
      title,
      description
    };
    data.push(newItem);
  }

  dataForm.reset();
  dataIdInput.value = '';
  renderData();
});

loadSampleBtn.addEventListener('click', function () {
  titleInput.value = 'Sample Title';
  descriptionInput.value = 'This is a sample description.';
});

window.editData = function (id) {
  const item = data.find(d => d.id == id);
  if (item) {
    titleInput.value = item.title;
    descriptionInput.value = item.description;
    dataIdInput.value = item.id;
  }
};

window.confirmDelete = function (id) {
  const confirmBox = document.createElement('div');
  confirmBox.className = 'confirm-box';
  confirmBox.innerHTML = `
    <div class="card p-3">
      <h5>Are you sure you want to delete?</h5>
      <button class="btn btn-danger me-2" id="yesBtn">Yes</button>
      <button class="btn btn-secondary" id="noBtn">No</button>
    </div>
  `;
  dataList.prepend(confirmBox);

  document.getElementById('yesBtn').onclick = function () {
    data = data.filter(d => d.id !== id);
    renderData();
    confirmBox.remove();
  };

  document.getElementById('noBtn').onclick = function () {
    confirmBox.remove();
  };
};

exportBtn.addEventListener('click', function () {
  console.log(JSON.stringify(data, null, 2));
});
  
  }
);