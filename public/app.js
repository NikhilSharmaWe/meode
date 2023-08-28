window.addEventListener("DOMContentLoaded", () => {
    let websocket = new WebSocket("ws://" + window.location.host + "/websocket");

    const inputElement = document.getElementById('myInput');
    let previousValue = ''; // To track the previous input value

	websocket.addEventListener("message", function (e) {
		let data = JSON.parse(e.data);
		inputElement.value = data;
	});

    inputElement.addEventListener('input', (event) => {
        const inputValue = event.target.value;
        const changes = getChanges(previousValue, inputValue);
        console.log("Changes additions:", changes.additions);
        console.log("Changes deletions:", changes.deletions);


        previousValue = inputValue; // Update the previous value

        // websocket.send(inputValue);
		websocket.send(
			JSON.stringify({
			  additions: changes.additions,
			  deletions: changes.deletions,
			})
		  );
    });

    // Function to calculate the changes between two strings
    function getChanges(previousValue, newValue) {
        let start = 0;
        while (start < previousValue.length && start < newValue.length && previousValue[start] === newValue[start]) {
            start++;
        }

        let endPrev = previousValue.length - 1;
        let endNew = newValue.length - 1;
        while (endPrev >= start && endNew >= start && previousValue[endPrev] === newValue[endNew]) {
            endPrev--;
            endNew--;
        }

        const additions = newValue.substring(start, endNew + 1);
        const deletions = previousValue.substring(start, endPrev + 1);

        return { additions, deletions };
    }
});
