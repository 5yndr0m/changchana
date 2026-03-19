// ignore_for_file: non_constant_identifier_names, unnecessary_getters_setters
class ApiResponse {
  Object data;
  Object error = Null;
  
  ApiResponse({required this.data, error});

  Object get Data => data;
  set Data(Object _data) => data = _data;

  Object get ApiError => error;
  set ApiError(Object _error) => error = _error;
}
