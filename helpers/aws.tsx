import AWS from 'aws-sdk';

// AWS Configuration
const S3_BUCKET = 'userresume9728';
const REGION = 'ap-south-1'; 
const ACCESS_KEY = 'AKIAVVZOOHA33V3UBNQZ';
const SECRET_KEY = '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';

AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
    region: REGION,
});

const s3 = new AWS.S3();

/**
 * Uploads a file to AWS S3 and returns the file URL
 * @param {string} fileUri - The local file URI to upload
 * @param {string} fileName - The name of the file in the S3 bucket
 * @returns {Promise<string>} - The URL of the uploaded file
 */
export const uploadToS3 = async (fileUri: string, fileName: string) => {
    try {
        // Fetch the file as a Blob
        const response = await fetch(fileUri);
        const fileBlob = await response.blob();

        // S3 Upload Parameters
        const params = {
            Bucket: S3_BUCKET,
            Key: fileName, // Unique file name in the bucket
            Body: fileBlob,
            ContentType: fileBlob.type || 'application/octet-stream',
            ACL: 'public-read', // Optional: Makes the file publicly accessible
        };

        // Upload the file to S3
        return new Promise((resolve, reject) => {
            s3.upload(params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
                if (err) {
                    console.error('Error uploading to S3:', err.message);
                    reject(err.message);
                } else {
                    console.log('File uploaded successfully:', data.Location);
                    resolve(data.Location); // Return the public file URL
                }
            });
        });
    } catch (error) {
        console.error('Error preparing file for S3 upload:', (error as Error).message);
        throw new Error('Failed to upload file to S3.');
    }
};
