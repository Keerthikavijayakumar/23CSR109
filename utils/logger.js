const axios = require("axios");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrZWVydGhpa2F2LjIzY3NlQGtvbmd1LmVkdSIsImV4cCI6MTc3OTA4NjExOCwiaWF0IjoxNzc5MDg1MjE4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNmUxYzZkZjctMGVkNy00YzJkLWJhNmItZGI5MWNmMDc0MWFjIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoia2VlcnRoaSIsInN1YiI6Ijg0MDg4OWNiLTRhOGQtNGQ0ZS1iNWQ4LTYwODVhMzc0ZTFlYSJ9LCJlbWFpbCI6ImtlZXJ0aGlrYXYuMjNjc2VAa29uZ3UuZWR1IiwibmFtZSI6ImtlZXJ0aGkiLCJyb2xsTm8iOiIyM2NzcjEwOSIsImFjY2Vzc0NvZGUiOiJSeVpCY3kiLCJjbGllbnRJRCI6Ijg0MDg4OWNiLTRhOGQtNGQ0ZS1iNWQ4LTYwODVhMzc0ZTFlYSIsImNsaWVudFNlY3JldCI6ImFmSlNGdGZyc3B3dUhaZ3AifQ.WRGTxvF634NDpPJwWbDnPELVvOvFxMb06pySI0M4XaU";

async function Log(
    stack,
    level,
    packageName,
    message
) {

    try {

        const response = await axios.post(

            "http://4.224.186.213/evaluation-service/logs",

            {
                stack,
                level,
                package: packageName,
                message
            },

            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log(response.data);

    } catch (err) {

        console.log(
            err.response?.data || err.message
        );
    }
}

module.exports = Log;