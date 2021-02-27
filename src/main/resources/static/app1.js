
const currentUserFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },

    getCurrentUser: () => fetch("/api/admin/user")
}

async function getCurrentUsers() {
    let table = $('#mainTableWithUsers');
   // table.empty();
    let currentUser = await currentUserFetchService.getCurrentUser().then(rest => rest.json());

    $("#currentUserEmail").html(`${currentUser.email} with roles ${currentUser.roles.map(role=>role.role).join()}`)


    await currentUserFetchService.getCurrentUser()
        .then(res => res.json())
        .then(user => {
                let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.firstname}</td>
                            <td>${user.lastname}</td>
                            <td>${user.age}</td>
                            <td>${user.email}</td>
                            <td>${user.roles.map(role=>role.role).join(',')}</td>

                        </tr>
                )`;
                table.append(tableFilling);
            })
        }
getCurrentUsers();

