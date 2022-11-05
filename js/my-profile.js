let newProfilePicture = undefined;
let currentLoggedUser = localStorage.getItem('loggedUser');

forceUserLogin();

function showUserProfileInfo() {
    const firstName = document.getElementById('first-name');
    const surname = document.getElementById('surname');
    const secondName = document.getElementById('second-name');
    const secondSurname = document.getElementById('second-surname');
    const eMail = document.getElementById('email');
    const phoneNumber = document.getElementById('contact-phone-number');
    const profilePicture = document.getElementById('profile-picture-container');

    let localUserProfiles = JSON.parse(localStorage.getItem('userProfiles')) || [];

    // Default profile picture if user doesn't have
    let defaultImagePath = "img/img_perfil.png";

    // Search for profile info of the current logged User
    let localUserProfile = undefined;
    for (const profile of localUserProfiles) {
        if (profile.eMail === currentLoggedUser) {
            localUserProfile = profile;
        }
    }

    // Display profile info if exists, or default if doesn't
    if (localUserProfile) {
        firstName.value = localUserProfile.firstName;
        surname.value = localUserProfile.surname;
        secondName.value = localUserProfile.secondName;
        secondSurname.value = localUserProfile.secondSurname;
        eMail.value = localUserProfile.eMail;
        profilePicture.src = localUserProfile.picture || defaultImagePath;
        phoneNumber.value = localUserProfile.phoneNumber;
    } else {
        eMail.value = currentLoggedUser;
        profilePicture.src = defaultImagePath;
    }
}

function updateProfileInfo() {
    let localUserProfiles = JSON.parse(localStorage.getItem('userProfiles')) || [];
    let userProfile = undefined;
    let userProfileIndex = undefined;

    // Search for saved profile of the current logged User
    for (let i = 0; i < localUserProfiles.length; i++) {
        if (localUserProfiles[i].eMail === currentLoggedUser) {
            userProfileIndex = i;
        }
    }

    userProfile = {
        'firstName': document.getElementById('first-name').value,
        'surname': document.getElementById('surname').value,
        'secondName': document.getElementById('second-name').value,
        'secondSurname': document.getElementById('second-surname').value,
        'eMail': document.getElementById('email').value,
        //'picture': flagPicture || "",
        'phoneNumber': document.getElementById('contact-phone-number').value
    }

    // Check for intent to change user's e-mail
    if (userProfile.eMail !== currentLoggedUser) {
        // Ask for confirmation
        if (confirm('Cambiaste tu e-mail por: ' + userProfile.eMail + '\n\n ¿ Confirmar ?')) {
            // Validate if new user e-mail is available
            if (localUserProfiles.every(profile => profile.eMail !== userProfile.eMail)) {
                updateProductCommentaries(currentLoggedUser, userProfile.eMail);
                localStorage.setItem('loggedUser', userProfile.eMail);
                currentLoggedUser = userProfile.eMail;
                showUser();
            } else {
                alert('El e-mail seleccionado no está disponible.');
                userProfile.eMail = currentLoggedUser;
            }
        } else {
            userProfile.eMail = currentLoggedUser;
        }
    }

    if (newProfilePicture) { // Store new selected profile picture
        userProfile.picture = newProfilePicture || "";
    } else if (localUserProfiles[userProfileIndex]?.picture && localUserProfiles[userProfileIndex]?.picture !== "") { // Else reuse current picture
        userProfile.picture = localUserProfiles[userProfileIndex].picture || "";
    }

    if (userProfileIndex || userProfileIndex === 0) { // If profile information for current user already exists, update
        localUserProfiles[userProfileIndex] = userProfile;
    } else { // Else add profile to store
        localUserProfiles.push(userProfile);
    }

    // Save updated profile to Local Storage
    localStorage.setItem('userProfiles', JSON.stringify(localUserProfiles));
}

// Store new image or set empty if no image was selected
function storeSelectedPicture(img) {
    let reader = new FileReader();
    reader.onloadend = () => {
        newProfilePicture = reader.result;
    };
    if (img) { reader.readAsDataURL(img) } else { newProfilePicture = '' }
}

function updateProductCommentaries(oldUserMail, newUserMail) {
    let productCommentaries = JSON.parse(localStorage.getItem('productCommentaries'));

    if (productCommentaries) {
        for (const comment of productCommentaries) {
            if (comment.user === oldUserMail) {
                comment.user = newUserMail;
            }
        }
        localStorage.setItem('productCommentaries', JSON.stringify(productCommentaries));
    }
}

document.addEventListener("DOMContentLoaded", function (e) {
    showUser();
    showUserProfileInfo();

    let profilePictureInput = document.getElementById('profile-picture');
    profilePictureInput.addEventListener('change', () => { storeSelectedPicture(profilePictureInput.files[0]) });

    // FORM submit event
    let profileForm = document.getElementById('profile-form');
    profileForm.addEventListener('submit', (event) => {

        if (!profileForm.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            updateProfileInfo();
        }

        profileForm.classList.add('was-validated');
    });

});