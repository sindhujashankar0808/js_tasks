// /created empty array for store the data
const usersList = [];
let selectedprojects = null;
const onFormSubmit = () => {
  const detailOfProjects = readFormData();
  if (selectedprojects == null) {
    usersList.push(detailOfProjects);
  } else {
    const index = usersList.indexOf(selectedprojects);
    usersList[index] = detailOfProjects;
    selectedprojects = null;
  }
  resetForm();
  renderedProjects("all");
  console.log(usersList.push(detailOfProjects));
};
const readFormData = () => {
  const detailOfProjects = {};
  (detailOfProjects["projectName"] = document.getElementById("projectName"))
    .value;
  detailOfProjects["assign"] = document.getElementById("assign").value;
  detailOfProjects["startDate"] = document.getElementById("startDate").value;
  detailOfProjects["endDate"] = document.getElementById("endDate").value;
  detailOfProjects["priority"] = document.querySelector(
    'input[name="priority"]:checked'
  )?.value;
  detailOfProjects["description"] =
    document.getElementById("description").value;
  return detailOfProjects;
};
const renderedProjects = (status) => {
  let filteredProject = usersList;
  if (status !== "all") {
    filteredProject = usersList.filter(
      (project) => project.priority === status
    );
  }
  const outputHTML = filteredProject
    .map((project, i) => {
      const projectNumber = i + 1;
      const formattedStartDate = formatDate(project.startDate);
      const formattedEndDate = formatDate(project.endDate);
      return `
      <div class="project">
        <h3>${projectNumber}. ${project.projectName} assigned to ${project.assign} - ${project.priority}</h3>
        <p>${formattedStartDate} to ${formattedEndDate}</p>
        <p>${project.description}</p>
      </div>
      <button onclick = "deleteProject(${i})">Delete</button>
      <button onclick = "onEdit(${i})">Edit</button>`;
    })
    .join("");
  if (outputHTML) {
    output.innerHTML = outputHTML;
  } else {
    output.innerHTML = "No data found";
  }
};
const filterBy = (priority) => {
  renderedProjects(priority);
};
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};
window.onload = () => {
  renderedProjects("all");
};
const resetForm = () => {
  document.getElementById("projectName").value = "";
  document.getElementById("assign").value = "";
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";
  document.querySelector('input[name="priority"]:checked').checked = "";
  document.getElementById("description").value = "";
  selectedprojects = null;
};
//to delete the single project
const deleteProject = (singleData) => {
  if (confirm("Are you sure want to delete?")) {
    usersList.splice(singleData, 1);
    renderedProjects("all");
  }
};
//to delete all the projects
const deleteAllProjects = () => {
  if (confirm("Are you sure want?")) {
    usersList.splice(0, usersList.length);
    renderedProjects("all");
  }
};
const onEdit = (index) => {
  selectedprojects = usersList[index];
  document.getElementById("projectName").value = selectedprojects.projectName;
  document.getElementById("assign").value = selectedprojects.assign;
  document.getElementById("startDate").value = selectedprojects.startDate;
  document.getElementById("endDate").value = selectedprojects.endDate;
  document.querySelector(
    `input[name="priority"][value="${selectedprojects.priority}"]`
  ).checked = true;
  document.getElementById("description").value = selectedprojects.description;
};
const highlightBtn = document.querySelectorAll(".btn");
const onBtnClick = (btn) => {
  highlightBtn.forEach((btn) => btn.classList.remove("highlight"));
  btn.classList.add("highlight");
  const defaultHighlight = document.getElementById("all");
  defaultHighlight.classList = "highlight";
  renderedProjects("all");
};
highlightBtn.forEach((btn) => {
  btn.onclick = () => {
    onBtnClick(btn);
  };
});
const defaultHighlight = document.getElementById("all");
defaultHighlight.classList = "highlight";
renderedProjects("highlight");
