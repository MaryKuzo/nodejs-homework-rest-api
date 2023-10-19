import multer from 'multer';
import path from 'path';

const destination = path.resolve("temp");

const storage = multer.diskStorage({
    destination,
    filename: (req, file, cb) => {
        const uniquePreffix = `${Date.now()}_${Math.random(Math.random()* 1E9)}`;
        const filename = `${uniquePreffix}_${file.originalname}`;

        cb(null, filename)
    }

});

const limits = {
    fileSize: 5 * 1024 * 1024
}

const authUpload = multer({
    storage,
    limits,
})

export default authUpload