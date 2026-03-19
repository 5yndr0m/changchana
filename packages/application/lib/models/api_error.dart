// ignore_for_file: non_constant_identifier_names

class ApiError {
  String _error = "";

  ApiError({
    required String error,
  }) {
    _error = error;
  }


  String get message => _error;

  ApiError.fromJson(Map<String, dynamic> json) {
    _error = json["error"];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['error'] = _error;
    return data;
  }
}
