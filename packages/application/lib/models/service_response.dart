class ErrorMessages {
  String id;
  dynamic message;
  ErrorMessages({
    this.id = "",
    this.message = "",
  });
}

class ServiceResponse<T> {
  late int statusCode;
  late bool isSuccess;
  dynamic data = null;
  List<ErrorMessages> errorMessages = [];

  dynamic get errorMessage => errorMessages.isNotEmpty ? errorMessages[0].message : "Error something wrong";

  ServiceResponse({
    this.isSuccess = false,
    this.statusCode = 400,
    this.data,
    this.errorMessages = const [],
  });

  success(Map<String, dynamic> json) {
    isSuccess = true;
    statusCode = 200;
    data = json["data"];
  }

  error(Map<String, dynamic> json) {
    isSuccess = false;
    statusCode = json["statusCode"];
    errorMessages = json["data"];
  }

  setErrorObject(Map<String, dynamic> json) {
    isSuccess = false;
    statusCode = json["statusCode"] ?? 500;
    ErrorMessages e = ErrorMessages(id: "", message: json["message"]);
    errorMessages = [e];
  }
}
