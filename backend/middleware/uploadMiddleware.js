import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

// file filtering
const fileFilter = (req,file,cb) =>{
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if(allowedFileTypes.includes(file.mimetype)){
        cb(null,true);
    }else{
        cb(new Error('Invalid file type. Only .jpeg, .png, and .jpg files are allowed'),false);
    }
}

const upload = multer({storage,fileFilter});

export default upload;