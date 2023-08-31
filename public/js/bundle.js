/* eslint-disable */ /* eslint-disable */ /* eslint-disable */ const $94d08129b2afe48f$export$de026b00723010c1 = (type, msg)=>{
    $94d08129b2afe48f$export$3e63366088f78025();
    const markup = `<div class="alert alert--${type}"> ${msg} </div>`;
    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
    window.setTimeout(()=>{
        $94d08129b2afe48f$export$3e63366088f78025();
    }, 3000);
};
const $94d08129b2afe48f$export$3e63366088f78025 = ()=>{
    const alert = document.querySelector(".alert");
    if (alert) alert.parentElement.removeChild(alert);
};


const $433b644962c26f49$export$596d806903d1f59e = async (email, password)=>{
    try {
        const res = await axios({
            method: "POST",
            url: "http://127.0.0.1:3000/api/v1/users/login",
            data: {
                email: email,
                password: password
            }
        });
        if (res.data.status === "success") {
            (0, $94d08129b2afe48f$export$de026b00723010c1)("success", "Logged in successfully!");
            window.setTimeout(()=>{
                location.assign("/");
            }, 1500);
        }
    } catch (e) {
        (0, $94d08129b2afe48f$export$de026b00723010c1)("error", e.response.data.message);
    }
};


/* eslint-disable */ 
const $917ce638a9db0035$export$ca89bc660948fd97 = async (form)=>{
    try {
        const res = await axios({
            method: "PATCH",
            url: "http://127.0.0.1:3000/api/v1/users/update-user",
            data: form
        });
        if (res.data.status === "success") {
            (0, $94d08129b2afe48f$export$de026b00723010c1)("success", "Account updated successfully!");
            window.setTimeout(()=>{
                location.assign("/account");
            }, 1500);
        }
    } catch (e) {
        (0, $94d08129b2afe48f$export$de026b00723010c1)("error", e.response.data.message);
    }
};
const $917ce638a9db0035$export$e6af0f282bef35a9 = async (currentPassword, password, passwordConfirm)=>{
    try {
        const res = await axios({
            method: "PATCH",
            url: "http://127.0.0.1:3000/api/v1/users/update-password",
            data: {
                currentPassword: currentPassword,
                password: password,
                passwordConfirm: passwordConfirm
            }
        });
        if (res.data.status === "success") (0, $94d08129b2afe48f$export$de026b00723010c1)("success", "Password updated successfully!");
    } catch (e) {
        (0, $94d08129b2afe48f$export$de026b00723010c1)("error", e.response.data.message);
    }
};


/* eslint-disable */ 
const $cf1fae3c93b38a6e$export$a0973bcfe11b05c9 = async ()=>{
    try {
        const res = await axios({
            method: "GET",
            url: "http://127.0.0.1:3000/api/v1/users/logout"
        });
        if (res.data.status === "success") {
            (0, $94d08129b2afe48f$export$de026b00723010c1)("success", "Logged out successfully!");
            window.setTimeout(()=>{
                location.replace("/");
            }, 1500);
        }
    } catch (e) {
        (0, $94d08129b2afe48f$export$de026b00723010c1)("error", e.response.data.message);
    }
};


/* eslint-disable */ const $b521082dd449d16e$export$4c5dd147b21b9176 = (locations)=>{
    mapboxgl.accessToken = "pk.eyJ1IjoidnpvcmljaGV2IiwiYSI6ImNsbG1lMWNrajFnaWYzZmx3bG9xNHVsOWYifQ.-38bFnQcqiHBFWJIZ3PmBg";
    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/vzorichev/cllmef6pl02i401mfhq5c1ao8",
        interactive: false
    });
    const bounds = new mapboxgl.LngLatBounds();
    locations.forEach((location)=>{
        const pin = document.createElement("div");
        pin.className = "marker";
        new mapboxgl.Marker({
            element: pin,
            anchor: "bottom"
        }).setLngLat(location.coordinates).addTo(map);
        new mapboxgl.Popup({
            offset: 30
        }).setLngLat(location.coordinates).setHTML(`<p>Day ${location.day}: ${location.description}</p>`).setMaxWidth("300px").addTo(map);
        bounds.extend(location.coordinates);
    });
    map.fitBounds(bounds, {
        padding: 150
    });
};


/* eslint-disable */ 
const $174582039fef2e25$export$8d5bdbf26681c0c2 = async (id)=>{
    try {
        const res = await axios(`http://127.0.0.1:3000/api/v1/booking/checkout-session/${id}`);
        location.assign(res.data.stripeSession.url);
    } catch (e) {
        (0, $94d08129b2afe48f$export$de026b00723010c1)("error", e.response.data.message);
    }
};


const $c74e663a61ed842a$var$mapBoxEl = document.getElementById("map");
const $c74e663a61ed842a$var$loginForm = document.querySelector(".login-form .form");
const $c74e663a61ed842a$var$userDataForm = document.querySelector(".form-user-data");
const $c74e663a61ed842a$var$userPasswordForm = document.querySelector(".form-user-settings");
const $c74e663a61ed842a$var$logoutBtn = document.querySelector(".nav__el--logout");
const $c74e663a61ed842a$var$bookTourBtn = document.getElementById("book-tour");
if ($c74e663a61ed842a$var$mapBoxEl) {
    const locations = JSON.parse(document.getElementById("map").dataset.locations);
    if (locations.length > 0) (0, $b521082dd449d16e$export$4c5dd147b21b9176)(locations);
}
if ($c74e663a61ed842a$var$loginForm) $c74e663a61ed842a$var$loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    (0, $433b644962c26f49$export$596d806903d1f59e)(email, password);
});
if ($c74e663a61ed842a$var$logoutBtn) $c74e663a61ed842a$var$logoutBtn.addEventListener("click", ()=>{
    (0, $cf1fae3c93b38a6e$export$a0973bcfe11b05c9)();
});
if ($c74e663a61ed842a$var$userDataForm) $c74e663a61ed842a$var$userDataForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const form = new FormData();
    form.append("email", document.getElementById("email").value);
    form.append("name", document.getElementById("name").value);
    form.append("photo", document.getElementById("photo").files[0]);
    (0, $917ce638a9db0035$export$ca89bc660948fd97)(form);
});
if ($c74e663a61ed842a$var$userPasswordForm) $c74e663a61ed842a$var$userPasswordForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const currentPassword = document.getElementById("password-current").value;
    const newPassword = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    (0, $917ce638a9db0035$export$e6af0f282bef35a9)(currentPassword, newPassword, passwordConfirm);
});
if ($c74e663a61ed842a$var$bookTourBtn) $c74e663a61ed842a$var$bookTourBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    const tourId = e.target.dataset.tourId;
    (0, $174582039fef2e25$export$8d5bdbf26681c0c2)(tourId);
});


//# sourceMappingURL=bundle.js.map
