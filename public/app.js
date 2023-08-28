window.addEventListener("DOMContentLoaded", () => {
    let websocket = new WebSocket("ws://" + window.location.host + "/websocket");

    const inputElement = document.getElementById('myInput');
    let previousValue = ''; // To track the previous input value

	websocket.addEventListener("message", function (e) {
		let data = JSON.parse(e.data);
        console.log(data);
		inputElement.value = data.message;
	});

    inputElement.addEventListener('input', (event) => {
        const inputValue = event.target.value;
        const changes = getChanges(previousValue, inputValue);
        console.log("Changes additions:", changes.additions);
        console.log("Changes deletions:", changes.deletions);

        const idx = getChangedIdx(previousValue, inputValue);
        console.log("idx", idx);

        let changed = "";
        let deleted = false;

        if (inputValue.length < previousValue.length) {
            deleted = true;
            changed = previousValue[idx];
        } else {
            changed = inputValue[idx];
        }

        console.log("changed:", changed);

        previousValue = inputValue; // Update the previous value

        // websocket.send(inputValue);
		websocket.send(
			JSON.stringify({
                changed: changed,
			  deleted: deleted,
              idx: idx,
			})
		  );
    });

    
    function getChangedIdx(previousValue, newValue) {
        let idx = 0;
        while(idx < newValue.length && previousValue[idx] == newValue[idx]) {
            idx++;
        }

        return idx;
    }

    // function getChangedIdxs(previousValue, newValue) {
    //     let start = 0;
    //     let end = previousValue.length - 1;
    //     while(start < new && previousValue[start] == newValue[start]) {
    //         start++;
    //     }

    //     while(end >= start &&  previousValue[end] == newValue[end]) {
    //         console.log("hey")
    //         end--;
    //     }

    //     return { start, end };
    // }

    // Function to calculate the changes between two strings
    function getChanges(previousValue, newValue) {
        let start = 0;
        while (start < previousValue.length && start < newValue.length && previousValue[start] === newValue[start]) {
            start++;
        }

        let endPrev = previousValue.length - 1;
        let endNew = newValue.length - 1;
        while (endPrev >= start && endNew >= start && previousValue[endPrev] === newValue[endNew]) {
            console.log("hi")
            endPrev--;
            endNew--;
            console.log("endPrev", endPrev);
            console.log("endNew", endNew);
        }

        const additions = newValue.substring(start, endNew + 1);
        const deletions = previousValue.substring(start, endPrev + 1);

        return { additions, deletions };
    }
});
