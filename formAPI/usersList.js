let isLoading = false;
let previousEditButton = null;
let previousDeleteButton = null;
let selectedUser = null;
const submitButton = document.getElementById("submit");
const loadingMessage = document.getElementById("form-loader");
loadingMessage.style.display = "none";
//form loader
const formLoader = (currentStaus = false) => {
  if (currentStaus) {
    loadingMessage.style.display = "block";
    submitButton.disabled = true;
  } else {
    loadingMessage.style.display = "none";
    submitButton.disabled = false;
  }
};

const functionAPICall = async (path, method, data, message) => {
  const apiURL = "https://dummyapi.io/data/v1";
  try {
    isLoading = true;

    //submit button is disabled untill the data is loaded
    const response = await fetch(`${apiURL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "app-id": "6461ba68584b0c523fac7a75",
      },
      body: data ? JSON.stringify(data) : null,
    });
    const result = await response.json();
    if (response.status === 200) {
      //submit button is enable after the data is loaded
      isLoading = false;
      submitButton.disabled = false;
      if (message) {
        let messageElement = document.getElementById("snackbar");
        setTimeout(() => {
          messageElement.classList.remove("show");
        }, 3000);
        messageElement.classList.add("show");
        messageElement.textContent = message;
      }
    } else {
      throw new Error(error);
    }
    return result;
  } catch (error) {
    let errorMessage = document.getElementById("toast");
    errorMessage.classList.add("show");
    setTimeout(() => {
      errorMessage.classList.remove("show");
    }, 3000);
    submitButton.disabled = false;
    console.log(error, "error");
    return;
  } finally {
    formLoader(false);
  }
};

// window.isSindhu = "Yes I am the sindhu";
//submit the data in API
const submitForm = async () => {
  const firstName = document.getElementById("first_name")?.value;
  const lastName = document.getElementById("last_name")?.value;
  const email = document.getElementById("email")?.value;
  const user = {
    firstName,
    lastName,
    email,
  };
  //required fields
  if (firstName === "" || lastName === "" || email === "") {
    alert(`Please enter all required fields.`);
    return false;
  }
  try {
    if (selectedUser == null) {
      formLoader(true);
      await functionAPICall(
        "/user/create",
        "POST",
        user,
        "Submitted Successfully"
      ); // Create API
      console.log(
        functionAPICall("/user/create", "POST", user, "Submitted Successfully")
      );
    } else {
      formLoader(true);
      await functionAPICall(
        `/user/${selectedUser.id}`,
        "PUT",
        user,
        "Updated Successfully"
      ); //Update API
      if (previousEditButton) {
        previousEditButton.disabled = false; // Enable previous edit button
      }
      document.getElementById(`edit-${selectedUser.id}`).disabled = false; // enable edit button
      document.getElementById(`delete-${selectedUser.id}`).disabled = false;
      selectedUser = null;
    }
  } catch (Error) {
    submitButton.disabled = false;
  }
  formReset();
  submitButton.value = "Submit"; // button value changed
};

//user list render
const listRender = async (data) => {
  const list = await functionAPICall("/user", "GET", data);
  const renderList = document.getElementById("output");
  if (list) {
    renderList.innerHTML = "";
    list.data.map((user, i) => {
      const output = document.createElement("div");
      output.innerHTML = `<p><b>${i + 1}.Name: ${user.firstName} ${
        user.lastName
      }<b></p>
        <button class="btn-edit" id="edit-${user.id}" onclick= "onEditUser('${
        user.id
      }')" >Edit</button>
        <button class = "btn-delete" id='delete-${
          user.id
        }' onclick=  "deleteUser('${user.id}')">Delete</button>
        `;
      renderList.append(output);
    });
  }
};

//get the data from API and prefill the data on form
const onEditUser = async (id) => {
  if (previousEditButton) {
    previousEditButton.disabled = false;
    previousDeleteButton.disabled = false;
  }
  formLoader(true);
  try {
    // Get data from API and populate the form
    selectedUser = await functionAPICall(`/user/${id}`, "GET");
    document.getElementById("first_name").value = selectedUser.firstName;
    document.getElementById("last_name").value = selectedUser.lastName;
    document.getElementById("email").value = selectedUser.email;
    if (selectedUser) {
      // Submit button will change to "Update" when data is being edited
      document.getElementById("submit").value = "Update";

      const editButton = document.getElementById(`edit-${selectedUser.id}`);
      editButton.disabled = true;

      const deleteButton = document.getElementById(`delete-${selectedUser.id}`);
      deleteButton.disabled = true;

      previousEditButton = editButton;
      previousDeleteButton = deleteButton;

      // Click and scroll
      const formContainer = document.getElementById("form-container");
      formContainer.scrollIntoView({ behavior: "smooth" });
    }
  } catch (error) {
    let errorMessage = document.getElementById("toast");
    errorMessage.classList.add("show");
    setTimeout(() => {
      errorMessage.classList.remove("show");
    }, 3000);
    submitButton.disabled = false;
    return;
  } finally {
    formLoader(false); // Hide form loader
  }
};
// delete user data by id
const deleteUser = async (id) => {
  if (confirm("Are you sure you want to delete?")) {
    formLoader(true);
    const response = await functionAPICall(
      `/user/${id}`,
      "DELETE",
      null,
      "Deleted Successfully"
    );
    listRender();
    return response;
  }
};
// form reset
const formReset = () => {
  if (!selectedUser) {
    document.getElementById("first_name").value = "";
    document.getElementById("last_name").value = "";
    document.getElementById("email").value = "";
  } else {
    onEditUser(selectedUser.id);
  }
};
// Loader
const listLoader = () => {
  if (!isLoading) {
    document.getElementById("loader").style.display = "none";
    document.getElementById("output").style.display = "block";
  } else {
    return false;
  }
};
setTimeout(listLoader, 2000);
listRender();
