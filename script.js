document.getElementById("runCode").addEventListener("click", function () {
    const language = document.getElementById("language").value;
    const sourceCode = document.getElementById("sourceCode").value;
    const inputData = document.getElementById("inputData").value;

    const clientSecret = 'ead0bec43044ecc89517214020386399f3a4b7c4';
    const clientId = '3a96e4f31e3c17705e5789fb10d4a66d728349735b89.api.hackerearth.com';

    // Append client-secret and client-id to the URL parameters
    const apiUrl = `https://api.hackerearth.com/v4/partner/code-evaluation/submissions/?client-secret=${clientSecret}&client-id=${clientId}`;

    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
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
        console.log("API Response:", data); // Log full API response for debugging

        if (data && data.run_status) {
            document.getElementById("outputData").textContent = data.run_status.output || "No output";
        } else {
            document.getElementById("outputData").textContent = "Error: " + (data.error || "Unknown error");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("outputData").textContent = "An error occurred. Check console for details.";
    });
});
