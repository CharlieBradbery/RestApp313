
const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    // bodyAdd : async function(user) {return {'method': 'POST', 'headers': this.head, 'body': user}},
    findAllUsers: () => fetch("/api/admin", {method: 'GET', headers: userFetchService.head,  }),
    findOneUser: (id) => fetch(`api/admin/user/${id}`),
    addNewUser: (user) => fetch('api/admin', {method: 'POST', headers: userFetchService.head, body: JSON.stringify(user)}),
    updateUser: (user, id) => fetch(`api/admin/${id}`, {method: 'PUT', headers: userFetchService.head, body: JSON.stringify(user)}),
    deleteUser: (id) => fetch(`api/admin/${id}`, {method: 'DELETE', headers: userFetchService.head}),
    getCurrentUser: () => fetch("/api/admin/user")
}
getTableWithUsers().then(_ => {
    getNewUserForm();
    getDefaultModal();
    addNewUser();

})

async function getTableWithUsers() {
    let table = $('#mainTableWithUsers tbody');
    table.empty();
    let currentUser = await userFetchService.getCurrentUser().then(rest => rest.json());

    $("#currentUserEmail").html(`${currentUser.email} with roles ${currentUser.roles.map(role=>role.role).join()}`)


    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.firstname}</td>
                            <td>${user.lastname}</td>
                            <td>${user.age}</td>
                            <td>${user.email}</td>
                            <td>${user.roles.map(role=>role.role).join(',')}</td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-outline-secondary"
                                data-toggle="modal" data-target="#userModal">Edit</button>
                            </td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-outline-danger"
                                data-toggle="modal" data-target="#userModal">Delete</button>
                            </td>
                        </tr>
                )`;
                table.append(tableFilling);
            })
        })

    // обрабатываем нажатие на любую из кнопок edit или delete
    // достаем из нее данные и отдаем модалке, которую к тому же открываем
    $("#mainTableWithUsers").find('button').on('click', (event) => {
        let defaultModal = $('#userModal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
        // editUser(defaultModal, buttonUserId);
    })
}


async function getNewUserForm() {
    let button = $(`#new`);
    let form = $(`#defaultSomeForm`)
    button.on('click', () => {
        if (form.attr("data-hidden") === "true") {
            form.attr('data-hidden', 'false');
            form.show();
            button.text('Hide panel');
        } else {
            form.attr('data-hidden', 'true');
            form.hide();
            button.text('Show panel');
        }
    })
}


// что то деалем при открытии модалки и при закрытии
// основываясь на ее дата атрибутах
async function getDefaultModal() {
    $('#userModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}


// редактируем юзера из модалки редактирования, забираем данные, отправляем
async function editUser(modal, id) {
    let preuser = await userFetchService.findOneUser(id);
    let user = await preuser.json();

    modal.find('.modal-title').html('Edit user');

    let editButton = `<button  class="btn btn-outline-success" id="editButton">Edit</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);

    let bodyForm = `
        <form class="form-group" id="editUser">
            <label class="font-weight-bold" >ID</label>
            <input type="text" class="form-control" id="editId" name="id" value="${user.id}" disabled><br>
            <label class="font-weight-bold">First name</label>
            <input class="form-control" id="editFirstname" type="text" placeholder="first name" name="firstname" value="${user.firstname}"><br>
            <label class="font-weight-bold">Last name</label>
            <input class="form-control" id="editLastname" type="text" placeholder="last name" name="lastname" value="${user.lastname}"><br>
            <label class="font-weight-bold">Age</label>
            <input class="form-control" id="editAge" type="number" placeholder="age" value="${user.age}"><br>
            <label class="font-weight-bold">Email</label>
            <input class="form-control" id="editEmail" type="text" placeholder="email" name="email"  value="${user.email}"><br>
            <label class="font-weight-bold">Password</label>
            <input class="form-control" id="editPassword" type="text" placeholder="password" name="password"  value="" required><br>
            
            <select  value="${user.roles}" multiple size="2" class="form-control"  id="editRoles" name="roles">
                     <option value="ROLE_USER" selected="${user.roles.includes('ROLE_USER')}"> USER </option>
                     <option value="ROLE_ADMIN" selected="${user.roles.includes('ROLE_ADMIN')}"> ADMIN </option>
            </select>
        </form>
    `
    modal.find('.modal-body').append(bodyForm);

    $("#editButton").on('click', async () => {
        let id = modal.find("#editId").val().trim();
        let firstname = modal.find("#editFirstname").val().trim();
        let lastname = modal.find("#editLastname").val().trim();
        let email = modal.find("#editEmail").val().trim();
        let password = modal.find("#editPassword").val().trim();
        let age = modal.find("#editAge").val().trim();
        let roles = modal.find("#editRoles").val();
        let data = {
            id,
            firstname,
            lastname,
            email,
            password,
            age,
            roles
        }
        const response = await userFetchService.updateUser(data, id);

        if (response.ok) {
            getTableWithUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}



// удаляем юзера
async function deleteUser(modal, id) {
    let preuser = await userFetchService.findOneUser(id);
    let user = await preuser.json();

    modal.find('.modal-title').html('Delete user');

    let deleteButton = `<button  class="btn btn-outline-success" id="deleteButton">Delete</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(deleteButton);
    modal.find('.modal-footer').append(closeButton);

    let bodyForm = `
        <form class="form-group" id="deleteUser">
            <label class="font-weight-bold" >ID</label>
            <input type="text" class="form-control" id="deleteId" name="id" value="${user.id}" disabled><br>
            <label class="font-weight-bold">First name</label>
            <input class="form-control" id="deleteFirstname" type="text" name="firstname" value="${user.firstname}" readonly><br>
            <label class="font-weight-bold">Last name</label>
            <input class="form-control" id="deleteLastname" type="text" name="lastname" value="${user.lastname}" readonly><br>
            <label class="font-weight-bold">Age</label>
            <input class="form-control" id="deleteAge" type="number" value="${user.age}" readonly><br>
                        
            <select  value="${user.roles}" multiple size="2" class="form-control"  id="deleteRoles" name="roles" disabled>
                     <option value="ROLE_USER" selected="${user.roles.includes('ROLE_USER')}"> USER </option>
                     <option value="ROLE_ADMIN" selected="${user.roles.includes('ROLE_ADMIN')}"> ADMIN </option>
            </select>
        </form>
    `
    modal.find('.modal-body').append(bodyForm);
    $("#deleteButton").on('click', async () => {


    await userFetchService.deleteUser(id);
    getTableWithUsers();
    modal.modal('hide');

    // modal.find('.modal-title').html('');
    // modal.find('.modal-body').html('User was deleted');
    // let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    // modal.find('.modal-footer').append(closeButton);
    })
}

async function addNewUser() {
    $('#addNewUserButton').click(async () =>  {
        let addUserForm = $('#defaultSomeForm')
        let firstname = addUserForm.find("#newFirstname").val().trim();
        let lastname = addUserForm.find("#newLastname").val().trim();
        let age = addUserForm.find("#newAge").val().trim();
        let email = addUserForm.find("#newEmail").val().trim();
        let password = addUserForm.find("#NewPassword").val().trim();
        let roles = addUserForm.find("#roles").val();
        let data = {
            firstname,
            lastname,
            email,
            password,
            age,
            roles
        }
        const response = await userFetchService.addNewUser(data);
        if (response.ok) {
            getTableWithUsers();
            addUserForm.find('#newFirstname').val('');
            addUserForm.find('#newLastname').val('');
            addUserForm.find('#newAge').val('');
            addUserForm.find('#newEmail').val('');
            addUserForm.find('#NewPassword').val('');
            addUserForm.find('#roles').val('');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            addUserForm.prepend(alert)
        }
    })
}

