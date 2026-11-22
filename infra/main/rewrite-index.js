// CloudFront Function (viewer request): serve folder index files.
//   /            -> /index.html  (also covered by default_root_object)
//   /about/      -> /about/index.html
//   /about       -> /about/index.html
//   /logo.svg    -> unchanged
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri.endsWith("/")) {
    request.uri = uri + "index.html";
  } else if (!uri.split("/").pop().includes(".")) {
    request.uri = uri + "/index.html";
  }

  return request;
}
