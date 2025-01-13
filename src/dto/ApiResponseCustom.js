class ApiResponse {
    constructor(status, message, data, success) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.success = success;
    }
}

export default ApiResponse;