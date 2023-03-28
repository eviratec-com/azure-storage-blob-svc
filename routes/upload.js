
const
    express = require('express')
  , router = express.Router()

  , multer = require('multer')
  , inMemoryStorage = multer.memoryStorage()
  , upload = multer({ storage: inMemoryStorage })

  , { BlockBlobClient } = require('@azure/storage-blob')
  , getStream = require('into-stream')
  , containerName = process.env.AZURE_STORAGE_CONTAINER_NAME
;

const handleError = (err, res) => {
  console.log(err);
  res.status(500);
};

const getBlobName = originalName => {
  const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
  return `${identifier}-${originalName}`;
};

function uploadFile (file) {
  const
      blobName = getBlobName(file.originalname)
    , blobService = new BlockBlobClient(process.env.AZURE_STORAGE_CONNECTION_STRING,containerName,blobName)
    , stream = getStream(file.buffer)
    , streamLength = file.buffer.length
  ;

  return {
    blobName,
    stream: blobService.uploadStream(stream, streamLength)
  }
}

router.post('/', upload.array('files'), (req, res) => {
  const resultUris = [];
  const files = [...req.files];
  const uploads = files.map(file => {
    console.log(file);
    const upload = uploadFile(file)
    resultUris.push(
      `${process.env.AZURE_STORAGE_CONTAINER_URI_PREFIX}/${upload.blobName}`
    )
    return upload.stream;
  });

  Promise.all(uploads).then(
    ()=>{
      res.status(200).send({
        message: 'File(s) uploaded to Azure Blob storage.',
        uris: [...resultUris],
      });
    }
  ).catch(
    (err)=>{
    if(err) {
      handleError(err);
      return;
    }
  })
});

module.exports = router;
