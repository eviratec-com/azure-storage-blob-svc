# Eviratec Azure Storage Blob Web Service

A web service to accept `multipart/form-data` POST requests with files, and upload them to Azure Storage Blob Service.

Based on [Azure-Samples/storage-blob-upload-from-webapp-node](https://github.com/Azure-Samples/storage-blob-upload-from-webapp-node).

## Install

`$ npm install`

## Exec

`$ npm run-script start`

## Usage

```
curl 'http://localhost:4000/upload' \
  -H 'Accept: */*' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: multipart/form-data; boundary=----WebKitFormBoundarycqfcd5JALXmOxr7H' \
  -H 'User-Agent: Mozilla/5.0' \
  -H 'X-Eviratec-Token: ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890' \
  --data-raw $'------WebKitFormBoundarycqfcd5JALXmOxr7H\r\nContent-Disposition: form-data; name="files"; filename="WIN_20230327_22_06_32_Pro.jpg"\r\nContent-Type: image/jpeg\r\n\r\n\r\n------WebKitFormBoundarycqfcd5JALXmOxr7H\r\nContent-Disposition: form-data; name="files"; filename="WIN_20230327_22_06_35_Pro.jpg"\r\nContent-Type: image/jpeg\r\n\r\n\r\n------WebKitFormBoundarycqfcd5JALXmOxr7H--\r\n' \
  --compressed
```

## Environment Variables

- **AZURE_STORAGE_CONNECTION_STRING:** Azure Storage Connection String used to connect to Azure
- **AZURE_STORAGE_CONTAINER_NAME:** Name of Storage Container to store uploads in
