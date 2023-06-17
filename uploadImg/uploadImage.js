const usersInfoList = [];
let selectedDetails = null;
let userId = 0;
let isEditing = false;
// const output = document.getElementById("output");

// const updateButton = document.createElement("update");

const submitData = () => {
  const firstName = document.getElementById("firstName")?.value;
  const lastName = document.getElementById("lastName")?.value;
  const gender = document.querySelector('input[name="gender"]:checked')?.value;
  const location = document.getElementById("location")?.value;
  const subject = document.getElementById("subject")?.value;
  const photo = document.getElementById("photo")?.files[0];
  if (firstName === "" || lastName === "" || !gender) {
    alert("Please fill all required fields");
    return false;
  }
  const user = {
    id: userId + 1,
    firstName,
    lastName,
    gender,
    location,
    subject,
    photo,
  };
  if (selectedDetails == null) {
    usersInfoList.push(user);
  } else {
    const userIdx = usersInfoList.findIndex(
      (userDetail) => userDetail.id === selectedDetails.id
    );
    if (user.photo) {
      selectedDetails.photo = user.photo;
    }
    usersInfoList[userIdx] = {
      ...selectedDetails,
      ...user,
    };

    selectedDetails = null;
  }
  // console.log(document.getElementById("submit").value);
  userId++;
  output.innerHTML = "";
  console.log(usersInfoList);
  usersInfoList.forEach((userDetail) => renderData(userDetail));
  resetForm();
  document.getElementById("submit").value = "Submit";
};
const resetForm = () => {
  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
  document.querySelector('input[name="gender"]:checked').checked = false;
  document.getElementById("location").value = "";
  document.getElementById("subject").value = "";
  document.getElementById("photo").files[0] = "";
  // selectedDetails = null;
};
const renderData = (user) => {
  let dataRender = document.createElement("div");
  dataRender.innerHTML += `Detail of user List`;
  if (user) {
    dataRender.innerHTML = `
    
      <h3> Details Of User</h3>

      <p> Name: ${user.firstName} ${user.lastName} </p>
      <p>Gender: ${user.gender}</p>
      <p>Location: ${user.location}</p>
      <p>Subject: ${user.subject}</p>
      <p>Photo:</p>
      <div>
      <button  onclick="onEdit(${user.id})" >Edit</button>
      <button onclick="deleteOneUser(${user.id})" >Delete</button
      `;
    if (user.photo) {
      const reader = new FileReader();
      reader.readAsDataURL(user.photo);
      reader.onload = () => {
        const imageData = document.createElement("div");
        imageData.classList.add("data");
        const img = document.createElement("img");
        img.src = reader.result;
        imageData.appendChild(img);
        dataRender.appendChild(imageData);
      };
      dataRender.innerHTML += `
      <button onclick="deletePhoto(${user.id})" >X</button>`;
    } else {
      dataRender.innerHTML += `<p>User photo not found</p>
      <p>You can upload your photo if you want.</p>
      <button onclick="uploadPhoto(${user.id})" >upload</button>`;
    }
    output.appendChild(dataRender);
  } else {
    dataRender.innerHTML += `<p>No data found</p>`;
  }
  output.appendChild(dataRender);
};
const deleteOneUser = (id) => {
  const index = usersInfoList.findIndex((user) => user.id === id);
  if (index !== -1) {
    usersInfoList.splice(index, 1);
    output.innerHTML = "";
    usersInfoList.forEach((user) => renderData(user));
  }
};
// console.log(document.getElementById("submit").value);
const onEdit = (userId) => {
  selectedDetails = usersInfoList.find((user) => user.id === userId);
  document.getElementById("firstName").value = selectedDetails.firstName;
  document.getElementById("lastName").value = selectedDetails.lastName;
  document.querySelector(
    `input[name="gender"][value="${selectedDetails.gender}"]`
  ).checked = true;
  document.getElementById("location").value = selectedDetails.location;
  document.getElementById("subject").value = selectedDetails.subject;
  if (photo) {
    document.getElementById("photo").files[0] = selectedDetails.photo;
  }
  if (selectedDetails) {
    document.getElementById("submit").value = "Update";
  }
};
const deletePhoto = (id) => {
  const user = usersInfoList.find((user) => user.id === id);
  if (user) {
    user.photo = null;
    output.innerHTML = "";
    usersInfoList.forEach((user) => renderData(user));
  }
};
const uploadPhoto = (id) => {
  const user = usersInfoList.find((user) => user.id === id);
  const photoInput = document.createElement("input");
  photoInput.type = "file";
  photoInput.accept = "image/*";
  photoInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      user.photo = file;
      output.innerHTML = "";
      usersInfoList.forEach((user) => renderData(user));
    };
  });
  photoInput.click();
};
