const State = {
  Idle: Symbol('Idle'),
  WaitingLocation: Symbol('WaitingLocation'),
  WatchingLocation: Symbol('WatchingLocation')
};

var getBtn, watchBtn, mState, id;

function Start() {
    console.log(onload)
    getBtn = document.getElementById("location");
    watchBtn = document.getElementById("watchLocation")

    setState(State.Idle);
    id = null;
}

function getLocation() {
    navigator.geolocation.watchPosition(success, error);
    setState(State.WaitingLocation);
}

function watchLocation() {
    console.log(id)
    if (id) {
        navigator.geolocation.clearWatch(id);
        id = null;
        setState(State.Idle)
    } else {
        resetResult();
        id = navigator.geolocation.watchPosition(success, error);
        setState(State.WatchingLocation)
    }
}

function success(position) {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    showResult(`Latitude: ${latitude} °, Longitude: ${longitude} °`);
    if (mState == State.WaitingLocation)
        setState(State.Idle)
}

function error(error) {
    showResult('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
    setState(State.Idle);
}

function showResult(text) {
    result = document.getElementById("result");
    result.innerHTML += "<li>" + text + "</li>";
    result.style.display = "block";
}

function resetResult() {
    result = document.getElementById("result");
    result.innerHTML = "";
    result.style.display = "none";
}

function setState(state) {
    mState = state
    switch (mState) {
        case State.Idle: {
            getBtn.innerText = "Location"
            watchBtn.innerText = "Watch Location"
            break;
        }
        case State.WaitingLocation: {
            getBtn.innerText = "Waiting"
            watchBtn.innerText = "Watch Location"
            break;
        }
        case State.WatchingLocation: {
            getBtn.innerText = "Location"
            watchBtn.innerText = "Stop"
            break;
        }
    }
    console.log(mState)
}
