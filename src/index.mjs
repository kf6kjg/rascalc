/* eslint-env browser */

function calculate(event) {
	event.preventDefault();

	const roundNode = document.getElementById("round");

	const form = document.querySelector("form");
	if (form.checkValidity && !form.checkValidity()) {
		form.reportValidity();
		throw new Error("Invalid value in form");
	}

	const d0Node = document.getElementById("damageInitial");
	const D0 = Number(d0Node.value);
	const v0Node = document.getElementById("velocityInitial");
	const V0 = Number(v0Node.value);
	const t0Node = document.getElementById("totalTime");
	const T0 = Number(t0Node.value);

	const oxNode = document.getElementById("distance");
	const Ox = Number(oxNode.value);
	const ovNode = document.getElementById("bestVelocity");
	const Ov = Number(ovNode.value);
	const osNode = document.getElementById("bestVelocitySign");
	const Os = osNode.value === "+" ? 1 : -1;
	const doNode = document.getElementById("danger");
	const Od = Number(doNode.value);

	const smNode = document.getElementById("maneuverability");
	const Sm = Number(smNode.value);
	const saNode = document.getElementById("armor");
	const Sa = Number(saNode.value);
	const stNode = document.getElementById("thrust");
	const St = Number(stNode.value);
	const sdNode = document.getElementById("damage");
	const Sd = Number(sdNode.value);

	const Ds = Math.max(0, Os * Math.floor((Od * (Ov - V0)) / (Sm + Sa + 1)));

	const V = Math.floor(Math.sqrt(V0 * V0 + 2 * St * Ox) / Math.max(1, D0 + Ds));

	const T = Math.floor((2 * Ox) / (V0 + V)) + 1;

	const D = Math.max(0, D0 + Ds + T * Sd);

	const totalTime = T + T0;

	d0Node.value = D;
	v0Node.value = V;
	t0Node.value = totalTime;

	// Record
	const roundLog = document.createElement("td");
	roundLog.innerText = roundNode.value;
	const damageLog = document.createElement("td");
	damageLog.innerText = D;
	const velocityLog = document.createElement("td");
	velocityLog.innerText = V;
	const transitTimeLog = document.createElement("td");
	transitTimeLog.innerText = T;
	const totalTimeLog = document.createElement("td");
	totalTimeLog.innerText = totalTime;

	const row = document.createElement("tr");
	row.appendChild(roundLog);
	row.appendChild(damageLog);
	row.appendChild(velocityLog);
	row.appendChild(transitTimeLog);
	row.appendChild(totalTimeLog);
	document.getElementById("results").appendChild(row);

	roundNode.value++;
}

function reset() {
	const log = document.getElementById("results");
	while (log.firstChild) {
		log.removeChild(log.firstChild);
	}

	document.getElementById("round").value = 1;

	document.getElementById("damageInitial").value = 0;
	document.getElementById("velocityInitial").value = 0;
	document.getElementById("totalTime").value = 0;

	document.getElementById("distance").value = "";
	document.getElementById("bestVelocity").value = "";
	document.getElementById("bestVelocitySign").value = "+";
	document.getElementById("danger").value = "";

	document.getElementById("maneuverability").value = "";
	document.getElementById("armor").value = "";
	document.getElementById("thrust").value = "";
	document.getElementById("damage").value = "";
}

function handleToggleButton(states, state, target) {
	const currentState = states[state];
	if (target && currentState.action) {
		currentState.action(target);
	}
	return currentState.nextState;
}

document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("calculate").addEventListener("click", calculate);
	document.getElementById("clearall").addEventListener("click", reset);

	const statusSection = document.getElementById("status");
	const statusToggle = document.getElementById("statusToggle");

	const statusToggleStates = {
		closed: {
			action: (target) => {
				target.innerHTML = "Edit";
				target.parentNode.classList.add("mui--pull-right");
				statusSection.classList.add("collapsed");
				statusSection
					.querySelectorAll("input")
					.forEach((el) => el.setAttribute("disabled", "disabled"));
			},
			nextState: "editing",
		},
		editing: {
			action: (target) => {
				target.innerHTML = "Close";
				target.parentNode.classList.remove("mui--pull-right");
				statusSection.classList.remove("collapsed");
				statusSection
					.querySelectorAll("input")
					.forEach((el) => el.removeAttribute("disabled"));
			},
			nextState: "closed",
		},
	};
	let statusToggleState = "closed";

	statusToggleState = handleToggleButton(
		statusToggleStates,
		statusToggleState,
		statusToggle
	);

	document.getElementById("statusToggle").addEventListener("click", () => {
		statusToggleState = handleToggleButton(
			statusToggleStates,
			statusToggleState,
			statusToggle
		);
	});
});
