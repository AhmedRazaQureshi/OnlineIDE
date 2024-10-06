document.getElementById("runCode").addEventListener("click", function () {
    const language = document.getElementById("language").value;
    const sourceCode = document.getElementById("sourceCode").value;
    const inputData = document.getElementById("inputData").value;

    const clientSecret = 'ead0bec43044ecc89517214020386399f3a4b7c4';  // Client Secret
    const clientId = '3a96e4f31e3c17705e5789fb10d4a66d728349735b89.api.hackerearth.com';  // Client ID

    const apiUrl = 'https://api.hackerearth.com/v4/partner/code-evaluation/submissions/';

    // First API call to submit the code for evaluation
    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "client-secret": clientSecret,  // Pass client-secret in headers (this is mandatory)
        },
        body: JSON.stringify({
            "source": sourceCode,
            "lang": language,
            "input": inputData,
            "memory_limit": 243232,
            "time_limit": 5,
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.he_id) {
            const heId = data.he_id; // Save the he_id to check the status later
            checkStatus(heId); // Start checking the status
        } else {
            document.getElementById("outputData").textContent = "Error: " + (data.message || "Unknown error");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("outputData").textContent = "An error occurred. Check console for details.";
    });
});

// Function to periodically check the status of the code evaluation
function checkStatus(heId) {
    const clientSecret = 'ead0bec43044ecc89517214020386399f3a4b7c4';  // Client Secret
    const statusUrl = `https://api.hackerearth.com/v4/partner/code-evaluation/submissions/${heId}/`;

    fetch(statusUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "client-secret": clientSecret  // Pass client-secret in headers
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.result && data.result.run_status) {
            const runStatus = data.result.run_status;
            document.getElementById("outputData").textContent = runStatus.output || "No output";
        } else if (data.request_status && data.request_status.code === "REQUEST_QUEUED") {
            // If the request is still queued, check again after some time
            setTimeout(() => checkStatus(heId), 2000); // Check again in 2 seconds
        } else {
            document.getElementById("outputData").textContent = "Error: " + (data.error || "Unknown error");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("outputData").textContent = "An error occurred while checking status. Check console for details.";
    });
}
