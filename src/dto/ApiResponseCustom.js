class ApiResponse {
    constructor(status, message, data, success, metadata = null) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.success = success;
        if (metadata) {
            this.metadata = metadata;
        }
    }
}

export default ApiResponse;