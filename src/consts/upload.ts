import multer from 'multer';

const UPLOAD_CSV_FORM_FIELD = 'file';
const MAX_CSV_SIZE = 10 * 1024 * 1024;

const csvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_CSV_SIZE }
});

export { UPLOAD_CSV_FORM_FIELD, MAX_CSV_SIZE, csvUpload };
