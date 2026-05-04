const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Initialize Supabase Storage Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE; // Service role for backend access
const supabase = createClient(supabaseUrl, supabaseKey);

// Multer Storage Configuration (Memory)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.png', '.jpg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  }
});

// Helper function to upload to Supabase
const uploadToSupabase = async (file, folder = 'attachments') => {
  const fileName = `${Date.now()}-${file.originalname}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('lms_storage') // Replace with your bucket name
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('lms_storage')
    .getPublicUrl(filePath);

  return {
    url: urlData.publicUrl,
    path: filePath,
    fileName: file.originalname,
    fileSize: file.size,
    mimeType: file.mimetype
  };
};

module.exports = {
  upload,
  uploadToSupabase
};
